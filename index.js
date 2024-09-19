import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import httpErrors from "http-errors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { UserRouter } from "./routers/userRouter.js";
import { authRouter } from "./routers/authRouter.js";
import path from "path";
import cors from "cors";
import { subscriptionRouter } from "./routers/subscriptionRouter.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

const swaggerJson = JSON.parse(
  fs.readFileSync(`${path.resolve()}/docs/swagger.json`)
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/user", UserRouter);

app.use("/api/v1/subscription", subscriptionRouter);

app.use((req, res, next) => {
  next(httpErrors(404, "Not Found"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;