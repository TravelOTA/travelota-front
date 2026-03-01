#!/bin/bash

echo "🚀 Starting TravelOTA project..."

# Add Node.js to PATH
export PATH="/usr/local/lib/node/bin:$PATH"

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install it from https://nodejs.org"
    exit 1
fi

# Check if pnpm is installed, install if not
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "📦 Installing project dependencies..."
pnpm install

echo "🌐 Starting development server..."
pnpm dev
