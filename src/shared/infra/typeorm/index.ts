import * as dotenv from 'dotenv';
import { DataSource } from "typeorm";

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT as number | undefined,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  entities: [process.env.TYPEORM_ENTITIES as string],
  migrations: [process.env.TYPEORM_MIGRATIONS as string],
})
