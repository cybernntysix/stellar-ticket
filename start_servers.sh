#!/bin/bash
echo "Stopping existing servers..."
pkill -f "node backend/server.js" || true
pkill -f "vite" || true

echo "Starting Backend..."
cd backend
nohup node server.js > ../server.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo "Starting Frontend..."
cd ..
nohup npm run dev > dev.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo "Servers started in background."
