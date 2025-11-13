#!/bin/bash

# Health Check Script
# Checks the health of all services

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_service() {
    local name=$1
    local port=$2
    local url="http://localhost:$port/health"
    
    echo -n "Checking $name (:$port)... "
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ Unhealthy${NC}"
        return 1
    fi
}

echo -e "${BLUE}🏥 Health Check - FlipFlop.cz Platform${NC}"
echo "=========================================="
echo ""

# Check main platform services
echo -e "${BLUE}Main Platform Services:${NC}"
check_service "API Gateway" 3001
check_service "Product Service" 3002
check_service "Order Service" 3003
check_service "User Service" 3004
check_service "Supplier Service" 3006
check_service "AI Service" 3007
check_service "Analytics Service" 3008

echo ""
echo -e "${BLUE}External Services:${NC}"
check_service "Logging Service" 3009
check_service "Notification Service" 3010

echo ""
echo -e "${BLUE}Frontend:${NC}"
check_service "Frontend" 3000 || echo -e "${YELLOW}⚠️  Frontend not running (may not be implemented yet)${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}Health check complete!${NC}"

