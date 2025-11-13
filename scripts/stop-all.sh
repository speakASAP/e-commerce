#!/bin/bash

# Stop All Services Script
# This script stops all microservices for the FlipFlop.cz platform

set -e

echo "🛑 Stopping FlipFlop.cz E-commerce Platform..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
NOTIFICATION_DIR="$PROJECT_ROOT/../notification-microservice"
LOGGING_DIR="$PROJECT_ROOT/../logging-microservice"

# Stop main platform services
echo -e "${BLUE}🏪 Stopping Main Platform Services...${NC}"
cd "$PROJECT_ROOT"
docker-compose down

# Stop notification service
echo -e "${BLUE}📧 Stopping Notification Microservice...${NC}"
if [ -d "$NOTIFICATION_DIR" ]; then
    cd "$NOTIFICATION_DIR"
    docker-compose down
    echo -e "${GREEN}✅ Notification service stopped${NC}"
else
    echo -e "${YELLOW}⚠️  Notification microservice directory not found${NC}"
fi

# Stop logging service
echo -e "${BLUE}📝 Stopping Logging Microservice...${NC}"
if [ -d "$LOGGING_DIR" ]; then
    cd "$LOGGING_DIR"
    docker-compose down
    echo -e "${GREEN}✅ Logging service stopped${NC}"
else
    echo -e "${YELLOW}⚠️  Logging microservice directory not found${NC}"
fi

echo ""
echo -e "${GREEN}✅ All services stopped!${NC}"

