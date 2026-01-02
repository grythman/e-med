# Database Setup (MongoDB)

## MongoDB Setup

### Using Docker (Recommended)

```bash
# Start MongoDB and Redis
docker-compose up -d

# Check MongoDB is running
docker ps
```

### Manual Setup

1. Install MongoDB Community Edition ([Download](https://www.mongodb.com/try/download/community))
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

## Connection

MongoDB will be available at `mongodb://localhost:27017/emed`

Update your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/emed
```

## Models

MongoDB uses Mongoose models instead of SQL tables. Models are defined in `backend/models/`:

- `User.js` - User accounts
- More models will be added as needed

## MongoDB vs SQL Differences

### No Migrations Needed
MongoDB doesn't require migrations like SQL databases. Schema is defined in Mongoose models and applied automatically.

### Collections
MongoDB uses "collections" instead of "tables". Collections are created automatically when you first insert data.

### Indexes
Indexes are defined in Mongoose schemas and created automatically.

## Useful Commands

### MongoDB Shell (mongosh)

```bash
# Connect to MongoDB
mongosh

# Switch to database
use emed

# List collections
show collections

# Find users
db.users.find()

# Count documents
db.users.countDocuments()
```

### Docker Commands

```bash
# Connect to MongoDB in Docker
docker exec -it emed-mongodb mongosh

# View MongoDB logs
docker logs emed-mongodb

# Restart MongoDB
docker restart emed-mongodb
```
