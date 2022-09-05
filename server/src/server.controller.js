import { app } from "./app.js";
import { loadPlanetsData } from "./modals/planets.modal.js";
import { loadLaunchesData } from "./modals/launches.modal.js";
import { mongoConnect } from "./services/mongoose.services.js";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8000;
const init = async function () {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

init();
