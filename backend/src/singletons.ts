import DatabaseModel from "./services/DatabaseService";
import TelegramService from "./services/TelegramService";

const DATABASE_URL = process.env.DATABASE_URL || "";
const DATABASE_USERNAME = process.env.DATABASE_USERNAME || "";
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "";
const TELEGRAM_API_URL = process.env.TELEGRAM_API_URL || "";

export const databaseInstance = new DatabaseModel(
  DATABASE_URL,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
);

export const telegramInstance = new TelegramService(TELEGRAM_API_URL);
