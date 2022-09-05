import mongoose from "mongoose";
const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
  },
});

export const planetModel = mongoose.model("Planet", planetsSchema);
