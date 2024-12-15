import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import chatRouter from "./routes/chatRouter";
import messageRouter from "./routes/messageRouter";
import telegramRouter from "./routes/telegramRouter";
import { databaseInstance } from "./singletons";

const PORT = process.env.SERVER_PORT || 5000;
const app = express();

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

app.listen(PORT, async () => {
  const isConnected = await databaseInstance.ping();

  if (!isConnected) {
    throw new Error("Failed to connect to the database!");
  }

  console.log("Connection to database successful!");
  console.log(`Server is running at PORT: ${PORT}`);
});
