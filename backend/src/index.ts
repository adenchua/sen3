import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import ENVIRONMENT_CONSTANTS from "./constants/envConstants";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";
import chatRouter from "./routes/chatRouter";
import messageRouter from "./routes/messageRouter";
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

// register chat routes
app.use("/api/v1/chats", chatRouter);
// register message routes
app.use("/api/v1/messages", messageRouter);
// register telegram routes
app.use("/api/v1/telegram", telegramRouter);
// register subscriber routes
app.use("/api/v1/subscribers", subscriberRouter);

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
