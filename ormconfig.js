module.exports =
{
  "type": process.env.DATABASE_TYPE,
  "host": process.env.DATABASE_HOST,
  "database": process.env.DATABASE,
  "username": process.env.DATABASE_USERNAME,
  "password": process.env.DATABASE_PASSWORD,
  "port": process.env.DATABASE_PORT,
  "insecureAuth": true,
  "entities": [
    process.env.TYPEORM_ENTITIES
  ],
  "migrations": [
    process.env.TYPEORM_MIGRATIONS
  ],
  "cli": {
    "migrationsDir": process.env.TYPEORM_MIGRATIONS_DIR
  }
}
