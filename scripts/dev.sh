#!/bin/bash

# Blue Pine AI - Development Script
# This script starts both frontend and backend services for local development

set -e

echo "🚀 Starting Blue Pine AI Development Environment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "packages/frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install --workspace=packages/frontend
fi

if [ ! -d "packages/backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install --workspace=packages/backend
fi

# Check for environment files
if [ ! -f "packages/backend/.env" ]; then
    echo "⚠️  Warning: Backend .env file not found. You may need to copy from env.example"
fi

echo "🏃‍♂️ Starting development servers..."
echo "📱 Frontend will be available at: http://localhost:8084"
echo "🖥️  Backend will be available at: http://localhost:3001"
echo ""
echo "📝 Logs:"

# Start both services using npm workspaces
npm run dev:all 