#!/bin/bash

# Path to the virtual environment directory
VENV_PATH="/usr/src/app/.venv"

# Check if the .venv directory is empty
if [ -z "$(ls -A $VENV_PATH)" ]; then
    echo "Virtual environment is empty. Repopulating..."
    poetry install
else
    echo "Virtual environment is already populated."
fi

# Execute the passed command
exec "$@"
