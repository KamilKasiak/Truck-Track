import mongoose from "mongoose";
import Trip from "../models/tripModel.js";

//GET all tracks
const getTracks = async (req, res) => {
  const user_id = req.user._id;
  const trips = await Trip.find({ user_id }).sort({ dateStart: -1 });
  res.status(200).json(trips);
};

// GET a single track
const getTrack = async (req, res) => {
  //grab id from route /:id and asign params to it
  const { id } = req.params;

  // id must be a string of 12 bytes or a string of  24 hex characters or integer for mongoose. If it is invalid handle error
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ err: "No such trip tracked" });
  }

  const trip = await Trip.findById(id);

  if (!trip) {
    return res.status(404).json({ error: "No such trip tracked" });
  } else {
    return res.status(200).json(trip);
  }
};

//CREATE a new track
const createTrack = async (req, res) => {
  const {
    title,
    cityTwo,
    dateStart,
    dateStop,
    workTime,
    milageStart,
    milageStop,
  } = req.body;

  let emptyFields = [];
  if (!title) {
    emptyFields.push("title");
  }
  if (!cityTwo) {
    emptyFields.push("cityTwo");
  }
  if (!dateStart) {
    emptyFields.push("dateStart");
  }
  if (!milageStart) {
    emptyFields.push("milageStart");
  }
  if (emptyFields.length > 0) {
    return res
      .status(404)
      .json({ error: "Please fill in empty fields", emptyFields });
  }

  // add doc to database
  try {
    // grab user._id from req - we passed user object to req in middleware requireAuth
    const user_id = req.user._id;
    const trip = await Trip.create({
      title,
      cityTwo,
      dateStart,
      dateStop,
      workTime,
      user_id,
      milageStart,
      milageStop,
    });
    return res.status(200).json(trip);
  } catch (err) {
    return res.status(404).json({ err: err.message });
  }
};

//DELETE specific track
const deleteTrack = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ err: "Can't delete this trip" });
  }
  const trip = await Trip.findByIdAndDelete({ _id: id });

  if (!trip) {
    return res.status(404).json({ error: "No such trip tracked" });
  } else {
    return res.status(200).json(trip);
  }
};

//UPDATE specific track
const updateTrack = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ err: "Can't patch this trip" });
  }
  const trip = await Trip.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!trip) {
    return res.status(404).json({ error: "No such trip tracked" });
  } else {
    return res.status(200).json(trip);
  }
};

export { getTrack, getTracks, createTrack, deleteTrack, updateTrack };
