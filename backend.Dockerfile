# Use official Python lightweight image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (needed for psycopg2, pdfkit, etc.)
RUN apt-get update && apt-get install -y \\
    build-essential \\
    libpq-dev \\
    wkhtmltopdf \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend application
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run Uvicorn server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
