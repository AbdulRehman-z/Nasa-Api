import express from "express";
import { planetsRouter } from "./planets.router.js";
import { launchesRouter } from "./launches.router.js";

export const api = express.Router();

api.use("/planets", planetsRouter);
api.use("/launches", launchesRouter);
