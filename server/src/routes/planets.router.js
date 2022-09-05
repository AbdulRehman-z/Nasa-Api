import express from "express";
import { getAllPLanetsController } from "./planets.controller.js";
// import { getAllPLanets } from "../modals/planets.modal.js";
// import { getAllPLanets } from "../modals/planets.modal.js";
export const planetsRouter = express.Router();

planetsRouter.get("/", getAllPLanetsController);
