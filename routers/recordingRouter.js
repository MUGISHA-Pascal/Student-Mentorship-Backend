import express from "express";
import {
  startRecording,
  stopRecording,
} from "../controllers/recordingController.js";

export const recordingRouter = express.Router();

recordingRouter.post("/start", startRecording);
recordingRouter.post("/stop", stopRecording);
