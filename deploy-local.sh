#!/bin/bash

echo "Starting Cinema Booking System Local Deployment..."
echo

echo "Building and starting all services with Docker Compose..."
docker-compose up --build -d

echo
echo "Waiting for services to start..."
sleep 30

echo
echo "Checking service status..."
docker-compose ps

echo
echo "========================================"
echo "Deployment Complete!"
echo "========================================"
echo
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8080/api"
echo "WebSocket: ws://localhost:8080/ws"
echo
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"
echo

