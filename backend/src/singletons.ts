import ENVIRONMENT_CONSTANTS from "./constants/envConstants";
import DatabaseModel from "./services/DatabaseService";
import TelegramService from "./services/TelegramService";

export const databaseInstance = new DatabaseModel(
  ENVIRONMENT_CONSTANTS.database.url,
  ENVIRONMENT_CONSTANTS.database.username,
  ENVIRONMENT_CONSTANTS.database.password,
);

export const telegramInstance = new TelegramService(ENVIRONMENT_CONSTANTS.telegramService.url);
