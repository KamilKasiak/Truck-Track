import mongoose from "mongoose"

const tripSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    cityTwo: {
        type: String,
        required: true
    },
    dateStart: {
        type: Date, default: Date.now,
        required: true
    },
    dateStop: {
        type: Date,
    },
    workTime: {
        type: Date,
    },
    user_id: {
        type: String,
        required: true
    },
}, {timestamps: true});

const Trip = mongoose.model("Trip", tripSchema)

export default Trip