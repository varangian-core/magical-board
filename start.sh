#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌟 Starting Magical Board Application 🌟${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Stop any running containers
echo -e "${YELLOW}🛑 Stopping any existing containers...${NC}"
docker-compose down

# Build and start containers
echo -e "${YELLOW}🔨 Building containers...${NC}"
if ! docker-compose build; then
    echo -e "${RED}❌ Build failed. Trying with --no-cache...${NC}"
    docker-compose build --no-cache
fi

echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker-compose up -d

# Wait for database to be ready
echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
sleep 10

# Run database migrations
echo -e "${YELLOW}📊 Running database migrations...${NC}"
docker-compose exec app npx prisma migrate deploy

# Generate Prisma client
echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
docker-compose exec app npx prisma generate

echo ""
echo -e "${GREEN}✨ Magical Board is now running! ✨${NC}"
echo ""
echo -e "${GREEN}🌐 Application: http://localhost:3000${NC}"
echo -e "${GREEN}💾 Database Admin: http://localhost:5050${NC}"
echo -e "${GREEN}   Email: admin@magical-board.com${NC}"
echo -e "${GREEN}   Password: admin${NC}"
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo "  View logs:        docker-compose logs -f"
echo "  Stop containers:  docker-compose down"
echo "  Restart:          docker-compose restart"
echo "  Database shell:   docker-compose exec postgres psql -U magical_user -d magical_board"
echo ""