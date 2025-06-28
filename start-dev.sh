#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌟 Starting Magical Board in Development Mode 🌟${NC}"
echo ""

# Check if PostgreSQL is running locally
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running locally.${NC}"
    echo -e "${YELLOW}   Make sure to start PostgreSQL or use ./start.sh for Docker setup.${NC}"
    echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Generate Prisma client
echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
npx prisma generate

# Push database schema (create tables if they don't exist)
echo -e "${YELLOW}📊 Pushing database schema...${NC}"
npx prisma db push

echo ""
echo -e "${GREEN}✨ Starting development server... ✨${NC}"
echo ""
echo -e "${GREEN}🌐 Application will be available at: http://localhost:3000${NC}"
echo -e "${GREEN}📊 Prisma Studio: Run 'npm run prisma:studio' in another terminal${NC}"
echo ""

# Start the development server
npm run dev