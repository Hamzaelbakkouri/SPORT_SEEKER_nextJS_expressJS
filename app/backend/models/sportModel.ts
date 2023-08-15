import mongoose from "mongoose";

const sportmodel = new mongoose.Schema({
    sport: {
        type: String,
        required: true,
        unique: true
    }
})

const SportModel = mongoose.model('sports', sportmodel)

export default SportModel