import { launchesDatabase } from "./launches.mongo.js";
import { planetModel } from "./planets.mongo.js";
import axios from "axios";
import { response } from "express";

let latestFlightNumber = 100;
let DEF_FLIGHT_NUMBER = 100;
const SPACEX_QUERRY_URL = "https://api.spacexdata.com/v4/launches/query";

const launch = {
  flightNumber: 100, //flight_Number
  missionName: "Nasa-Exploration", // name
  rocket: "Explorer IS1", // rocket.name
  date: new Date("20 December,2030"), // date_local
  target: "kepler-1652 b",
  customers: ["ZTM", "PAK Aerospace"], // payload.customers
  upcoming: true, // upcoming
  success: true, //success
};

const findLaunch = async function (filter) {
  return await launchesDatabase.findOne(filter);
};

export const launchesHasId = async function (launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
};

export const abortLaunch = async function (launchId) {
  const abortedLaunch = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return abortedLaunch.modifiedCount === 1 && abortedLaunch.matchedCount === 1;
};

const saveLaunch = async function (launch) {
  return await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
};

export const scheduleNewLaunch = async function (launch) {
  await planetModel.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("Could  not find planet " + launch.target + " in database");
  }

  const latestFlightNumber =
    (await getLatestFlightNumber(launchesDatabase)) + 1;

  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: true,
    customers: ["ZTM", "PAK Aerospace"],
    flightNumber: latestFlightNumber,
  });
  await saveLaunch(newLaunch);
};

export const getAllLaunches = async function (skip, limit) {
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({
      flightNumber: 1,
    })
    .skip(skip)
    .limit(limit);
};

const getLatestFlightNumber = async function (launches) {
  const latestLaunch = await launches.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEF_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
};

const populateLaunches = async function () {
  const response = await axios.post(SPACEX_QUERRY_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("launches has failed during downloading ");
    throw new Error(response.status + " " + response.statusText);
  }

  const launchDocs = response.data.docs;
  console.log(launchDocs.length);
  for (const launchDoc of launchDocs) {
    const payLoads = launchDoc["payloads"];
    const customers = payLoads.flatMap((payload) => payload["customers"]);
    const launchData = {
      flightNumber: launchDoc["flight_number"],
      missionName: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      date: launchDoc["date_local"],
      customers,
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
    };
    console.log(launchData.success, launchData.flightNumber);
    await saveLaunch(launchData);
  }
};

export const loadLaunchesData = async function () {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 9",
    missionName: "Falcon Sat",
  });
  console.log(firstLaunch);
  if (firstLaunch) {
    console.log("Launches already loaded");
  } else {
    await populateLaunches();
  }
};
