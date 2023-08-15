import mongoose from "mongoose";

const saveShchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    salleID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})
const SaveModel = mongoose.model('save', saveShchema)

export default SaveModel