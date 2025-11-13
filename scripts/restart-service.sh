#!/bin/bash

# Restart Service Script
# Usage: ./scripts/restart-service.sh [service-name]

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 [service-name]"
    echo ""
    echo "Available services:"
    echo "  - api-gateway"
    echo "  - user-service"
    echo "  - product-service"
    echo "  - order-service"
    echo "  - supplier-service"
    echo "  - ai-service"
    echo "  - analytics-service"
    echo "  - frontend"
    echo "  - notification-service (in ../notification-microservice)"
    echo "  - logging-service (in ../logging-microservice)"
    exit 1
fi

SERVICE=$1
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Handle external services
if [ "$SERVICE" = "notification-service" ]; then
    cd "$PROJECT_ROOT/../notification-microservice"
    echo -e "${BLUE}🔄 Restarting Notification Service...${NC}"
    docker-compose restart notification-service
    echo -e "${GREEN}✅ Notification service restarted${NC}"
    exit 0
fi

if [ "$SERVICE" = "logging-service" ]; then
    cd "$PROJECT_ROOT/../logging-microservice"
    echo -e "${BLUE}🔄 Restarting Logging Service...${NC}"
    docker-compose restart logging-service
    echo -e "${GREEN}✅ Logging service restarted${NC}"
    exit 0
fi

# Handle main platform services
cd "$PROJECT_ROOT"
echo -e "${BLUE}🔄 Restarting $SERVICE...${NC}"
docker-compose restart "$SERVICE"
echo -e "${GREEN}✅ $SERVICE restarted${NC}"

