#!/bin/bash

# View Logs Script
# Usage: ./scripts/view-logs.sh [service-name] [--follow]

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
BLUE='\033[0;34m'
NC='\033[0m'

if [ -z "$1" ]; then
    echo "Usage: $0 [service-name] [--follow]"
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
    echo "  - all (shows all services)"
    echo ""
    echo "Add --follow to follow logs in real-time"
    exit 1
fi

SERVICE=$1
FOLLOW=${2:-""}

# Handle external services
if [ "$SERVICE" = "notification-service" ]; then
    cd "$PROJECT_ROOT/../notification-microservice"
    echo -e "${BLUE}📋 Viewing Notification Service logs...${NC}"
    if [ "$FOLLOW" = "--follow" ]; then
        docker-compose logs -f notification-service
    else
        docker-compose logs notification-service
    fi
    exit 0
fi

if [ "$SERVICE" = "logging-service" ]; then
    cd "$PROJECT_ROOT/../logging-microservice"
    echo -e "${BLUE}📋 Viewing Logging Service logs...${NC}"
    if [ "$FOLLOW" = "--follow" ]; then
        docker-compose logs -f logging-service
    else
        docker-compose logs logging-service
    fi
    exit 0
fi

# Handle main platform services
cd "$PROJECT_ROOT"

if [ "$SERVICE" = "all" ]; then
    echo -e "${BLUE}📋 Viewing all service logs...${NC}"
    if [ "$FOLLOW" = "--follow" ]; then
        docker-compose logs -f
    else
        docker-compose logs
    fi
else
    echo -e "${BLUE}📋 Viewing $SERVICE logs...${NC}"
    if [ "$FOLLOW" = "--follow" ]; then
        docker-compose logs -f "$SERVICE"
    else
        docker-compose logs "$SERVICE"
    fi
fi

