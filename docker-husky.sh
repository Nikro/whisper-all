#!/bin/sh
# docker-husky.sh

# Check if the Node container is running
running=$(docker compose ps -q node | wc -l)

# If the container is not running, start it
if [ "$running" -eq 0 ]; then
  docker compose up -d node
fi

# Run the command inside the Node.js container
docker compose exec -T node sh -c "su node && $*"
