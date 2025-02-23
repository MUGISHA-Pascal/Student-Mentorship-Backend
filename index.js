import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import http from "http";
import httpErrors from "http-errors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { UserRouter } from "./routers/userRouter.js";
import { authRouter } from "./routers/authRouter.js";
import path from "path";
import cors from "cors";
import { subscriptionRouter } from "./routers/subscriptionRouter.js";
import { coachRouter } from './routers/coachRouter.js';
import { studentRouter } from './routers/studentRouter.js';
import { documentRouter } from './routers/documentRouter.js';
import { blogRouter } from "./routers/blogRouter.js";
import {sessionRouter} from './routers/sessionRouter.js';
import {messageRouter} from './routers/messageRouter.js';
import { initSocket } from './services/socketService.js';
import { recordingRouter } from "./routers/recordingRouter.js";
import {participantRouter} from './routers/participantRouter.js';
import { videoCallRouter } from "./routers/videoCallRouter.js";
import { adminRouter } from "./routers/adminRouter.js";


dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running');
});


// Initialize socket.io
initSocket(server);
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan("dev"));

const swaggerJson = JSON.parse(
  fs.readFileSync(`${path.resolve()}/docs/swagger.json`)
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/user", UserRouter);

app.use("/api/v1/subscription", subscriptionRouter);

app.use('/api/v1/coach', coachRouter); 
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/document', documentRouter);
app.use('/api/v1/blog', blogRouter)
app.use('/api/session', sessionRouter);
app.use('/api/message', messageRouter);
app.use('/api/recording', recordingRouter)
app.use('/api/participant', participantRouter)


app.use('/api/stream', videoCallRouter);



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