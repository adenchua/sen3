import DatabaseModel from "./services/DatabaseService";

const DATABASE_URL = process.env.DATABASE_URL || "";
const DATABASE_USERNAME = process.env.DATABASE_USERNAME || "";
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "";

export const databaseInstance = new DatabaseModel(
  DATABASE_URL,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
);
