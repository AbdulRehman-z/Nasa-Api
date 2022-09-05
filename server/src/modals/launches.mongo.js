import mongoose from "mongoose";
const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  missionName: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  target: {
    type: String,
    // required: true,
  },
  customers: {
    type: [String],
    required: true,
  },
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
  },
});

export const launchesDatabase = mongoose.model("launch", launchesSchema);
