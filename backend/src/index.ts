import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const PORT = process.env.SERVER_PORT || 5000;
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
