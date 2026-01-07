#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Open Learning Center - Deployment    ${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if running in the correct directory
if [ ! -f "docker/docker-compose.production.yml" ]; then
    echo -e "${RED}Error: Run this script from the project root directory${NC}"
    exit 1
fi

# Check for required env files
if [ ! -f ".env.production" ]; then
    echo -e "${RED}Error: .env.production not found${NC}"
    echo -e "${YELLOW}Copy docker/env.production.example to .env.production and fill in your values${NC}"
    exit 1
fi

if [ ! -f "apps/api/.env.production" ]; then
    echo -e "${YELLOW}Warning: apps/api/.env.production not found, using root .env.production${NC}"
fi

echo -e "${YELLOW}Building and starting services...${NC}"

# Build and start
docker compose -f docker/docker-compose.production.yml up -d --build

echo -e "${GREEN}Waiting for services to be healthy...${NC}"
sleep 10

# Check health
echo -e "${YELLOW}Checking service health...${NC}"

if curl -sf http://localhost:3010/api/docs > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API is healthy (port 3010)${NC}"
else
    echo -e "${RED}✗ API health check failed${NC}"
fi

if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Web is healthy (port 3000)${NC}"
else
    echo -e "${RED}✗ Web health check failed${NC}"
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!                 ${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "  Web:  http://localhost:3000"
echo -e "  API:  http://localhost:3010"
echo -e "  Docs: http://localhost:3010/api/docs"
echo -e "${GREEN}========================================${NC}"
