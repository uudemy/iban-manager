FROM python:3.11-slim

WORKDIR /app

# Sistem bağımlılıklarını yükle
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Python bağımlılıklarını yükle
COPY requirements-production.txt .
RUN pip install --no-cache-dir -r requirements-production.txt

# Uygulama kodunu kopyala
COPY . .

# Port'u belirt
EXPOSE 5000

# Uygulamayı başlat
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "src.main:app"]
