from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Iterable

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import IndexDefinition, IndexValue, PriceObservation


class IndexCalculationError(Exception):
    pass


class IndexCalculationService:
    def __init__(self, lookback_hours: int = 72) -> None:
        self.lookback_hours = lookback_hours

    @staticmethod
    def weighted_median(values: Iterable[tuple[float, float]]) -> float:
        pairs = sorted((float(value), max(float(weight), 0.000001)) for value, weight in values)
        if not pairs:
            raise IndexCalculationError("Cannot calculate weighted median with no values.")

        total_weight = sum(weight for _, weight in pairs)
        midpoint = total_weight / 2
        cumulative = 0.0
        for value, weight in pairs:
            cumulative += weight
            if cumulative >= midpoint:
                return value
        return pairs[-1][0]

    @staticmethod
    def observation_weight(obs: PriceObservation) -> float:
        volume_component = obs.volume_available if obs.volume_available and obs.volume_available > 0 else 1.0
        confidence_component = obs.confidence_score if obs.confidence_score is not None else 0.6
        return max(volume_component * confidence_component, 0.000001)

    def list_valid_observations(self, db: Session, index_def: IndexDefinition) -> list[PriceObservation]:
        since = datetime.now(timezone.utc) - timedelta(hours=self.lookback_hours)
        stmt = select(PriceObservation).where(
            PriceObservation.asset_type == index_def.asset_type,
            PriceObservation.sample_time >= since,
            PriceObservation.price_usd > 0,
        )

        filters = index_def.asset_filter or {}
        for key, value in filters.items():
            if value is None:
                continue
            if key == "asset_name":
                stmt = stmt.where(PriceObservation.asset_name == value)
            elif key == "model_name":
                stmt = stmt.where(PriceObservation.model_name == value)
            elif key == "gpu_type":
                stmt = stmt.where(PriceObservation.gpu_type == value)
            elif key == "region":
                stmt = stmt.where(PriceObservation.region == value)
            elif key == "unit":
                stmt = stmt.where(PriceObservation.unit == value)

        observations = list(db.scalars(stmt).all())
        return self.remove_outliers(observations)

    @staticmethod
    def remove_outliers(observations: list[PriceObservation]) -> list[PriceObservation]:
        if len(observations) < 5:
            return observations

        prices = sorted(obs.price_usd for obs in observations)
        median = prices[len(prices) // 2]
        if median <= 0:
            return observations

        lower = median * 0.25
        upper = median * 4.0
        return [obs for obs in observations if lower <= obs.price_usd <= upper]

    def recalculate_one(self, db: Session, index_def: IndexDefinition) -> IndexValue:
        observations = self.list_valid_observations(db, index_def)
        if not observations:
            raise IndexCalculationError(f"No valid price observations for index {index_def.symbol}.")

        value = self.weighted_median((obs.price_usd, self.observation_weight(obs)) for obs in observations)
        ordered = sorted(observations, key=lambda item: item.sample_time)
        prices = [obs.price_usd for obs in ordered]
        avg_confidence = sum(obs.confidence_score for obs in ordered) / len(ordered)

        index_value = IndexValue(
            index_id=index_def.id,
            timestamp=datetime.now(timezone.utc),
            value_usd=value,
            open=prices[0],
            high=max(prices),
            low=min(prices),
            close=prices[-1],
            sample_count=len(observations),
            confidence_score=round(avg_confidence, 4),
        )
        db.add(index_value)
        db.commit()
        db.refresh(index_value)
        return index_value

    def recalculate_by_symbol(self, db: Session, symbol: str) -> IndexValue:
        index_def = db.scalar(select(IndexDefinition).where(IndexDefinition.symbol == symbol))
        if not index_def:
            raise IndexCalculationError(f"Index definition not found: {symbol}")
        return self.recalculate_one(db, index_def)

    def recalculate_all_public(self, db: Session) -> list[IndexValue]:
        index_defs = list(db.scalars(select(IndexDefinition).where(IndexDefinition.is_public.is_(True))).all())
        values: list[IndexValue] = []
        errors: list[str] = []
        for index_def in index_defs:
            try:
                values.append(self.recalculate_one(db, index_def))
            except IndexCalculationError as exc:
                errors.append(str(exc))
        if not values and errors:
            raise IndexCalculationError("; ".join(errors))
        return values
