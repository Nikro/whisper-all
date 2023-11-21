#!/bin/bash

echo "Setting up the project..."

# Run npm install to set up Husky
docker compose run --user node node npm install

echo "Setup complete!"
