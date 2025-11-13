#!/bin/bash
# Template script for creating service structure
SERVICE_NAME=$1
SERVICE_PORT=$2

if [ -z "$SERVICE_NAME" ] || [ -z "$SERVICE_PORT" ]; then
  echo "Usage: $0 <service-name> <port>"
  exit 1
fi

SERVICE_DIR="services/$SERVICE_NAME"
mkdir -p "$SERVICE_DIR/src"

# Create basic files (will be customized per service)
echo "Created structure for $SERVICE_NAME on port $SERVICE_PORT"
