# Python Project Boilerplate with Docker, Husky, and Poetry

## Overview

This boilerplate is designed for setting up Python projects using Docker. It includes Husky for commit hooks and linting, and Poetry for Python dependency management and virtual environments. The setup ensures that these tools run within Docker containers, eliminating the need for local installation.

## Key Components

- **Dockerfile**: Defines the Python environment and installs dependencies via Poetry.
- **docker-compose.yml**: Manages the services, including the Node.js environment for Husky and the Python application.
- **Husky Setup**: Manages pre-commit hooks and linting, running within a Node.js Docker container.

## Getting Started

### Initial Setup

1. Clone the repository.
2. Run the setup script to install Husky and other dependencies:
   ```bash
   ./setup.sh
   ```

### Python Virtual Environment

The virtual environment is created inside the `/app` directory and is named `.venv`. This allows the IDE to access it when mounted to the host.

1. Update `docker-compose.yml` to include the `.venv` volume mapping.
2. Run your Python application or manage dependencies using:
   ```bash
   docker compose exec app poetry add <package-name>
   docker compose exec app poetry run <command>
   ```

### Adding Python Packages

To add new Python packages, use Poetry via Docker Compose:

```bash
docker-compose exec app poetry add <package-name>
```

### Running the Application

To start the application, use Docker Compose:

```bash
docker-compose up
```

## Additional Information

### Structure

- `/app`: Contains the Python application and Dockerfile.
- Root directory: Contains configuration files and setup scripts.

### Customization

- Modify the Dockerfile for specific Python versions or dependencies.
- Update `docker-compose.yml` for additional services or configurations.

Certainly! Here's a paragraph note explaining the use of Docker with the `docker compose` command, which has replaced the older `docker-compose`:

### Paragraph Note on Docker Compose Usage

In this project, we utilize Docker along with the `docker compose` command, which is the newer iteration of `docker-compose`. The `docker compose` command is integrated directly into the Docker CLI as a plugin, streamlining the process of defining and running multi-container Docker applications. With this integration, Docker simplifies the orchestration of complex container setups, making it more efficient and user-friendly. Commands that previously were executed as `docker-compose up`, `docker-compose build`, etc., are now run as `docker compose up`, `docker compose build`, and so on, directly through the Docker CLI. This change reflects Docker's ongoing effort to enhance the developer experience by incorporating commonly used tools directly into its core command set.

## Contributing

Contributions to improve this boilerplate are welcome. Please follow standard GitHub pull request procedures.
