import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import router from "./routes/tracks.js"
import userRouter from "./routes/user.js"

const url = process.env.MONGO_URI;
const app = express();
const port = process.env.PORT || 4000;

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
if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get("*", (req,res) => {
        res.sendFile(
            path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
        )
    })
}else {
    app.get('/', (req,res) => res.send("Please set env to production mode"))
}

// CONNECT TO DB
mongoose.connect(url, {  useUnifiedTopology:true,
    useNewUrlParser: true,
    useCreateIndex: true})
    .then(() => {
        // LISTEN for request only if connected to DB
        app.listen(port, () => {
            console.log(`Connected to Database and listening at port ${port}`)
        })
    })
    .catch( (err) => {
        console.log(err)
        process.exit(1)
    })


