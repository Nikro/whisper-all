# Use the official lightweight Python image.
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV POETRY_VERSION 1.1.13
ENV PYTHONPATH /usr/src/app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential gcc g++ curl && \
    rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -

# Add Poetry to PATH in .bashrc for interactive sessions
RUN echo "export PATH=\"/root/.local/bin:$PATH\"" >> /root/.bashrc

# Set the PATH for subsequent Docker layers
ENV PATH "/root/.local/bin:${PATH}"

RUN poetry --version

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the pyproject.toml file (and optionally poetry.lock) into the container
COPY pyproject.toml poetry.lock* ./

# Install project dependencies
RUN poetry config virtualenvs.in-project true \
    && poetry install --no-interaction --no-ansi

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Run the command to start your application
EXPOSE 8000
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0"]
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]