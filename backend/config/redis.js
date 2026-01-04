const redis = require('redis');
require('dotenv').config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis client
const client = redis.createClient({
  url: REDIS_URL,
});

// Error handling
client.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

client.on('connect', () => {
  console.log('✅ Redis Client Connected');
});

// Connect to Redis
(async () => {
  try {
    await client.connect();
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.error('❌ Redis connection error:', error);
    // Don't exit - app can work without Redis in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

// Graceful shutdown
process.on('SIGINT', async () => {
  await client.quit();
  console.log('Redis connection closed');
  process.exit(0);
});

module.exports = client;

