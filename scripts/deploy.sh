#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Open Learning Center - API Deploy    ${NC}"
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

echo -e "${YELLOW}Building and starting API...${NC}"

# Build and start
docker compose -f docker/docker-compose.production.yml up -d --build

echo -e "${GREEN}Waiting for API to be healthy...${NC}"
sleep 10

# Check health
echo -e "${YELLOW}Checking API health...${NC}"

if curl -sf http://localhost:3010/api/docs > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API is healthy (port 3010)${NC}"
else
    echo -e "${RED}✗ API health check failed${NC}"
    echo -e "${YELLOW}Check logs: docker logs olc-api${NC}"
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!                 ${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "  API:  http://localhost:3010"
echo -e "  Docs: http://localhost:3010/api/docs"
echo -e "  Web:  Deployed on Vercel"
echo -e "${GREEN}========================================${NC}"
