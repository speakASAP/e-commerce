#!/bin/bash

# Start All Services Script
# This script starts all microservices for the FlipFlop.cz platform

set -e

echo "🚀 Starting FlipFlop.cz E-commerce Platform..."

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if nginx-network exists
if ! docker network inspect nginx-network > /dev/null 2>&1; then
    echo "⚠️  nginx-network not found. Creating it..."
    docker network create nginx-network
fi

# Start logging service first (other services depend on it)
echo -e "${BLUE}📝 Starting Logging Microservice...${NC}"
if [ -d "$LOGGING_DIR" ]; then
    cd "$LOGGING_DIR"
    docker-compose up -d
    echo -e "${GREEN}✅ Logging service started${NC}"
else
    echo -e "${YELLOW}⚠️  Logging microservice directory not found at $LOGGING_DIR${NC}"
fi

# Start notification service
echo -e "${BLUE}📧 Starting Notification Microservice...${NC}"
if [ -d "$NOTIFICATION_DIR" ]; then
    cd "$NOTIFICATION_DIR"
    docker-compose up -d
    echo -e "${GREEN}✅ Notification service started${NC}"
else
    echo -e "${YELLOW}⚠️  Notification microservice directory not found at $NOTIFICATION_DIR${NC}"
fi

# Start main platform services
echo -e "${BLUE}🏪 Starting Main Platform Services...${NC}"
cd "$PROJECT_ROOT"
docker-compose up -d

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check service health
echo -e "${BLUE}🏥 Checking service health...${NC}"

check_health() {
    local service=$1
    local port=$2
    local url="http://localhost:$port/health"
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service is healthy${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $service health check failed${NC}"
        return 1
    fi
}

check_health "API Gateway" 3001
check_health "Product Service" 3002
check_health "Order Service" 3003
check_health "User Service" 3004
check_health "Supplier Service" 3006
check_health "AI Service" 3007
check_health "Analytics Service" 3008
check_health "Logging Service" 3009
check_health "Notification Service" 3010

echo ""
echo -e "${GREEN}🎉 All services started!${NC}"
echo ""
echo "Service URLs:"
echo "  - API Gateway: http://localhost:3001"
echo "  - Frontend: http://localhost:3000"
echo "  - Logging Service: http://localhost:3009"
echo "  - Notification Service: http://localhost:3010"
echo ""
echo "View logs: docker-compose logs -f [service-name]"
echo "Stop all: ./scripts/stop-all.sh"

