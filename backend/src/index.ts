import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import ENVIRONMENT_CONSTANTS from "./constants/envConstants";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";
import analyticsRouter from "./routes/analyticsRouter";
import chatRouter from "./routes/chatRouter";
import deckRouter from "./routes/deckRouter";
import deckTemplateRouter from "./routes/deckTemplateRouter";
import healthCheckRouter from "./routes/healthcheckRouter";
import messageRouter from "./routes/messageRouter";
import notificationRouter from "./routes/notificationRouter";
import subscriberRouter from "./routes/subscriberRouter";
import telegramRouter from "./routes/telegramRouter";
import { databaseInstance } from "./singletons";

const PORT = ENVIRONMENT_CONSTANTS.server.port;
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/telegram", telegramRouter);
app.use("/api/v1/subscribers", subscriberRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/decks", deckRouter);
app.use("/api/v1/deck-templates", deckTemplateRouter);

app.use("/healthcheck", healthCheckRouter);

// catch async errors
app.use(errorHandlerMiddleware);

app.listen(PORT, async () => {
  const isConnected = await databaseInstance.ping();

  if (!isConnected) {
    throw new Error("Failed to connect to the database!");
  }

  console.log("Connection to database successful!");
  console.log(`Server is running at PORT: ${PORT}...`);
});
