#!/bin/bash

# Activate the virtual environment here if you're using one
# source venv/bin/activate

# Collect static files
echo "Collect static files"
pdm run python manage.py collectstatic --noinput

# Apply database migrations
echo "Apply database migrations"
pdm run python manage.py migrate

# Start server
if [ "$RUN_ENV" = "prod" ]
then
    echo "Starting Gunicorn WSGI server"
    exec gunicorn myproject.wsgi:application --bind 0.0.0.0:8000
else
    echo "Starting development server"
    exec python manage.py runserver 0.0.0.0:8000
fi
