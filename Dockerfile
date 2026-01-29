FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies (currently only stdlib needed)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 8000

# Run server
CMD ["python3", "server.py"]
