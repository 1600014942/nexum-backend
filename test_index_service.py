from app.services.index_service import IndexCalculationService


def test_weighted_median_simple():
    service = IndexCalculationService()
    assert service.weighted_median([(1, 1), (2, 1), (3, 1)]) == 2


def test_weighted_median_weighted():
    service = IndexCalculationService()
    assert service.weighted_median([(1, 1), (10, 10), (20, 1)]) == 10
