import express from "express"
import { getTrack, getTracks, createTrack, deleteTrack, updateTrack } from "../controllers/tracksController.js"
import requireAuth from "../middleware/requireAuth.js"


const router = express.Router()

//do check before the rest. if error it stops and throw error. Don't let to move to other trip routes
router.use(requireAuth)

// GET all tracks
router.get("/", getTracks)

// GET a single track
router.get("/:id", getTrack)

//POST a new track
router.post("/", createTrack)
    

//Delete specific track
router.delete("/:id", deleteTrack)

//UPDATE specific track
router.patch("/:id", updateTrack)

export default router