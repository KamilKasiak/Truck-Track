import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import mongoose from "mongoose"
import router from "./routes/tracks.js"
import userRouter from "./routes/user.js"
const connectDB = require('./config/db');
const port = process.env.PORT || 4000;

// CONNECT TO DB
connectDB();

const app = express();


// MIDDLEWARE
app.use(express.json())
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "optionsSuccessStatus": 204
  }))

// ROUTES 
app.use("/api/tracks",router)
app.use("/api/user",userRouter)

//SERVE Frontend on production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get("*", (req,res) => {
        res.sendFile(
            path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
        )
    })
}else {
    app.get('/', (req,res) => res.send("Please set env to production mode"))
}


// LISTEN for request only if connected to DB
app.listen(port, () => {
    console.log(`Connected to Database and listening at port ${port}`)
})



