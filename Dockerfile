# Stage 1: Build frontend
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Copy frontend dependencies
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy frontend source code
COPY client ./client
COPY server ./server
COPY shared ./shared
COPY vite.config.ts tsconfig.json tsconfig.node.json components.json ./

# Build frontend
RUN pnpm build

# Stage 2: Build backend
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy Python requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p app/api app/services web scripts

# Copy backend Python files
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

# Copy built frontend files from builder stage
COPY --from=frontend-builder /app/dist/public web/

EXPOSE 8000

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
