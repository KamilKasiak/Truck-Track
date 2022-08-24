import express from "express"
import { loginUser, signupUser } from "../controllers/userController.js"


const userRouter = express.Router()

//login route
userRouter.post("/login", loginUser)


//sign up route
userRouter.post("/signup", signupUser)


export default userRouter