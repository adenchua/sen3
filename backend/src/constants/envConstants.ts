const ENVIRONMENT_CONSTANTS = {
  server: {
    port: process.env.BACKEND_SERVICE_PORT || 5001,
  },
  database: {
    url: process.env.OPENSEARCH_DATABASE_URL || "",
    username: process.env.OPENSEARCH_DATABASE_USERNAME || "",
    password: process.env.OPENSEARCH_DATABASE_PASSWORD || "",
  },
  telegramService: {
    url: process.env.TELEGRAM_SERVICE_API_URL || "",
  },
};

export default ENVIRONMENT_CONSTANTS;
