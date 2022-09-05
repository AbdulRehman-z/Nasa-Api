import { parse } from "csv-parse";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { planetModel } from "./planets.mongo.js";
// export const getAllPLanets = (req, res) => {
//   return res.status(200).json(habitablePlanets);
// };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

export const loadPlanetsData = function () {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "data", "kepler_data.csv")
    ).pipe(
      parse({
        comment: "#",
        columns: true,
      })
        .on("data", async (data) => {
          if (isHabitablePlanet(data)) {
            await savePlanet(data);
          }
        })
        .on("error", (err) => {
          console.error(err);
          reject(err);
        })
        .on("end", async () => {
          const habitablePlanetsCount = (await getAllPLanets()).length;
          console.log(`${habitablePlanetsCount} habitable planets found!`);
          resolve();
        })
    );
  });
};

export const getAllPLanets = async function () {
  return await planetModel.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
};

export const savePlanet = async function (planet) {
  return await planetModel.updateOne(
    { keplerName: planet.kepler_name },
    { keplerName: planet.kepler_name },
    { upsert: true }
  );
};
