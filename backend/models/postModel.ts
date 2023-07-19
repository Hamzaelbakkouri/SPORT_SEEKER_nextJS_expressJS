import mongoose from "mongoose";

const postschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    postTitle: {
        type: String,
        required: true
    },
    postText: {
        type: String,
    },
    postImage: {
        type: String,
    },
})

const PostModel = mongoose.model('PostModel',postschema);

export default PostModel
