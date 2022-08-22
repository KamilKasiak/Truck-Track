import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import mongoose from "mongoose"
import router from "./routes/tracks.js"




const app = express();
const port = process.env.PORT;

// MIDDLEWARE
app.use(express.json())
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "optionsSuccessStatus": 204
  }))

// ROUTES 
app.use("/api/tracks",router)

// CONNECT TO DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // LISTEN for request only if connected to DB
        app.listen(port, () => {
            console.log(`Connected to Database and listening at port ${port}`)
        })
    })
    .catch( (err) => {
        console.log(err)
    })


