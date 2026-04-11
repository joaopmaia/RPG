# syntax=docker/dockerfile:1
# Contexto de build: raiz do repositório (docker compose).
FROM python:3.12-slim AS builder
WORKDIR /build
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*
COPY front/requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.12-slim AS runtime
WORKDIR /app
ENV PATH=/root/.local/bin:$PATH \
    PYTHONUNBUFFERED=1
COPY --from=builder /root/.local /root/.local
COPY resources ./resources
COPY service ./service
COPY front/backend ./front/backend
COPY front/historias ./front/historias
RUN mkdir -p /app/front/backend/uploads
WORKDIR /app/front/backend
EXPOSE 5000
CMD ["python", "app.py"]
