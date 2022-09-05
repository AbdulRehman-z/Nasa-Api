// import { getAllPlanets } from "../modals/planets.modal.js";
import { getAllPLanets } from "../modals/planets.modal.js";

export const getAllPLanetsController = async (req, res) => {
  return res.status(200).json(await getAllPLanets());
};
