import jwt from "jsonwebtoken"
import User from "../models/userModel.js"


const requireAuth = async (req, res, next) => {

    //verify authentication. One of the headers param is "authorization" so we can destructure it from headers
    // authorization is present as string: "Bearer sdafafadfaadfa.3q4rdfrq34tadfa.245efargrga" - 2nd part is a token, so split it
    const { authorization } = req.headers

    if(!authorization) {
        return res.status(404).json({error: "Authorization token required"})
    }

    //split after " ". token is on poz. [1] in table
    const token = authorization.split(" ")[1]

    try{
        const { _id } = jwt.verify(token, process.env.SECRET)

        req.user = await User.findOne({ _id }).select("_id")
        next()

    } catch (error) {
        console.log(error)
        res.status(404).json({error: "Request is not authorized"})
    }

}

export default requireAuth