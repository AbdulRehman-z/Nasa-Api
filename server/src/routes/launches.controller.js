import {
  getAllLaunches,
  abortLaunch,
  scheduleNewLaunch,
  launchesHasId,
} from "../modals/launches.modal.js";
import { pagination } from "../services/query.services.js";

export const getLaunchesController = async function (req, res) {
  const { skip, limit } = pagination(req.query);
  console.log(skip, limit);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
};
// launchesHasId
export const postLaunchesController = async function (req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.target ||
    !launch.launchDate
  ) {
    return res.status(400).json({ error: "Please provide valid inputs." });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  await scheduleNewLaunch(launch);
  console.log(launch);
  return res.status(201).json(launch);
};

export const deleteLaunchesController = async function (req, res) {
  const launchId = +req.params.id;
  console.log(`deleting ${launchId}`);
  //If launchId does not exists then return 404
  const launchExists = await launchesHasId(launchId);
  if (!launchExists) {
    return res.status(404).json({ error: "Launch  not found" });
  }

  //If launchId exists, delete it
  if (!abortLaunch) {
    return res.status(204).json({ error: "Launch not found" });
  }

  const aborted = abortLaunch(launchId);
  return res.status(200).json({
    ok: true,
  });
};
