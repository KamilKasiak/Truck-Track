import mongoose from "mongoose"
import bcrypt from "bcrypt"
import validator from "validator"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
    },
    facebookId: {
        type: String,
    },
    userPermissions: {
        type: String
    }
})

    // CREATE additional STATIC "signup" method in model. Use after export: User.signup() with 2 arguments: email and password
    // have to be regular function, NOT ARROW function because i am useing "this" keyword
userSchema.statics.signup = async function (email, password) {

    // VALIDATION
    if(!email || !password) {
        throw Error("All fields must be filled")
    }
    if(!validator.isEmail(email)) {
        throw Error("Email is not valid")
    }
    if(!validator.isStrongPassword(password)) {
        throw Error("Password is not strong enought")
    }

    const exist = await this.findOne({ email })

    if(exist){
        throw Error("Email already i use")
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash})

    return user
}

// Create additional STATIC "login" method in model
userSchema.statics.login = async function (email, password) {
     if(!email || !password) {
        throw Error("All fields must be filled")
    }
    const user = await this.findOne({ email })

    if(!user){
        throw Error("Invalid login credentials")
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error("Invalid login credentials")
    }
    return user
}


const User = mongoose.model("User", userSchema)

export default User