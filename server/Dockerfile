# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install system dependencies
RUN apt-get update \
    && apt-get install --assume-yes --no-install-recommends \
        gettext \
        git \
        make \
        libpq5 \
        netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN apt-get update \
    && apt-get install --assume-yes --no-install-recommends \
        gcc \
        libc6-dev \
        libpq-dev \
    && python3 -m pip install --no-cache-dir -r requirements.txt \
    && apt-get purge --assume-yes --auto-remove \
        gcc \
        libc6-dev \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy project
COPY . /code/

RUN cd /code

RUN chmod +x ./setup_app.sh