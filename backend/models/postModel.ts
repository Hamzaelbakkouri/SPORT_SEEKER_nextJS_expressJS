import mongoose from "mongoose";

const postschema = new mongoose.Schema({
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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
}, {
    timestamps: true
})

const PostModel = mongoose.model('Post', postschema);

export default PostModel
