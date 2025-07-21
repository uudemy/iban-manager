#!/bin/bash

# Railway start script with proper PORT handling

echo "=== Railway Start Script ==="
echo "PORT environment variable: $PORT"
echo "All environment variables:"
env | sort

# Set default PORT if not provided
if [ -z "$PORT" ]; then
    export PORT=5000
    echo "Setting default PORT to 5000"
fi

echo "Final PORT value: $PORT"

# Start the application
echo "Starting gunicorn on port $PORT..."
exec gunicorn --bind 0.0.0.0:$PORT src.main:app --workers 4 --timeout 120 --access-logfile - --error-logfile -
