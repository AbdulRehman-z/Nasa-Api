import express from "express";
import {
  getLaunchesController,
  postLaunchesController,
  deleteLaunchesController,
} from "./launches.controller.js";
export const launchesRouter = express.Router();

launchesRouter.get("/", getLaunchesController);
launchesRouter.post("/", postLaunchesController);
launchesRouter.delete("/:id", deleteLaunchesController);
