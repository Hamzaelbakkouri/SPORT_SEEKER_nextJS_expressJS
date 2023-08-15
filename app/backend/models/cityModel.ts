import mongoose from "mongoose";

const Cityschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: { type: String },
    image: [{ type: String }],
    description: { type: String }
})

const cityModel = mongoose.model('city', Cityschema)

export default cityModel