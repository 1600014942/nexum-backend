FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p app/api app/services web scripts

COPY __init__.py app/__init__.py
COPY main.py app/main.py
COPY config.py app/config.py
COPY database.py app/database.py
COPY models.py app/models.py
COPY schemas.py app/schemas.py
COPY security.py app/security.py

COPY admin.py app/api/admin.py
COPY public.py app/api/public.py
COPY health.py app/api/health.py
RUN touch app/api/__init__.py

COPY email_service.py app/services/email_service.py
COPY index_service.py app/services/index_service.py
RUN touch app/services/__init__.py

COPY seed.py scripts/seed.py

COPY index.html web/index.html
COPY app.js web/app.js
COPY styles.css web/styles.css

EXPOSE 8000

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
