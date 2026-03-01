#!/bin/bash

echo "🛑 Stopping TravelOTA development server..."

# Kill any process running on port 3000
PID=$(lsof -ti :3000)

if [ -n "$PID" ]; then
    kill $PID
    echo "✅ Server stopped (PID: $PID)"
else
    echo "ℹ️  No server found running on port 3000"
fi
