#!/bin/bash

# Database backup script

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP"

mkdir -p $BACKUP_DIR

echo "📦 Creating MongoDB backup..."

# Backup MongoDB
docker-compose exec -T mongodb mongodump \
    --archive \
    --username=${MONGO_ROOT_USERNAME:-admin} \
    --password=${MONGO_ROOT_PASSWORD:-changeme} \
    --authenticationDatabase=admin \
    > "$BACKUP_FILE.tar.gz"

echo "✅ Backup created: $BACKUP_FILE.tar.gz"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "🧹 Old backups cleaned up"

