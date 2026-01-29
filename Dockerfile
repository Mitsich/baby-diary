FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt && \
    mkdir -p /app/data

EXPOSE 8000

CMD ["python3", "server.py"]
