export default () => ({
  server: {
    port: process.env.SERVER_PORT || 3001,
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DATABASE_USERNAME || 'student',
    password: process.env.DATABASE_PASSWORD || 'student',
    database: process.env.DATABASE_NAME || 'kupipodariday',
  },
  jwt: {
    key: process.env.JWT_KEY || 'e776c17dcf7b8de11a1647faa49b89c2',
    ttl: process.env.JWT_TTL || '7d',
  },
  hash: {
    salt: process.env.SALT || 10,
  },
});