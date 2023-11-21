# Python Project Boilerplate with Docker, Husky, and Poetry

## Overview

This boilerplate is designed for setting up Python projects using Docker, enabling a seamless development experience both locally and in containerized environments. It includes Husky for commit hooks and linting, and Poetry for Python dependency management and virtual environments, all running within Docker containers. This setup eliminates the need for local installation of these tools, ensuring a consistent development environment.

## Key Components

- **Dockerfile**: Defines the Python environment and installs dependencies via Poetry, creating a virtual environment.
- **docker-compose.yml**: Manages services, including the Node.js environment for Husky and the Python application.
- **Husky Setup**: Manages pre-commit hooks and linting, executed within a Node.js Docker container.
- **Entrypoint Script**: Ensures the virtual environment is correctly set up and synchronized on container start.

## Getting Started

### Initial Setup

1. Clone the repository.
2. Run the setup script to install Husky and other dependencies:
   ```bash
   ./setup.sh
   ```

### Python Virtual Environment

The virtual environment is managed within the Docker container to ensure consistency across development setups. An entrypoint script checks if the virtual environment (`/usr/src/app/.venv`) is empty and, if so, repopulates it using Poetry.

1. To run commands within this virtual environment:
   ```bash
   docker compose exec app poetry run <command>
   ```

2. To add new Python packages:
   ```bash
   docker compose exec app poetry add <package-name>
   ```

### Running the Application

Start the application with Docker Compose:
```bash
docker compose up
```

This command initiates the entrypoint script, ensuring the virtual environment is prepared before starting the application.

## Additional Information

### Structure

- `/app`: Contains the Python application, Dockerfile, and the virtual environment.
- Root directory: Contains configuration files, setup scripts, and Node.js related files.

### Customization

- Modify the Dockerfile for specific Python versions or dependencies.
- Update `docker-compose.yml` for additional services or configurations.
- Adjust the entrypoint script as needed for specific startup behaviors.

### Docker Compose Usage

This project utilizes the `docker compose` command, the modern iteration of `docker-compose`. Integrated directly into the Docker CLI, it streamlines defining and running multi-container Docker applications. Commands like `docker-compose up` or `docker-compose build` are now simplified to `docker compose up` and `docker compose build`, enhancing user experience by embedding common tools into Docker's core command set.

## Contributing

Contributions to improve this boilerplate are welcome. Please adhere to standard GitHub pull request procedures.

## License

MIT. 
See [LICENSE](LICENSE) for more details.
