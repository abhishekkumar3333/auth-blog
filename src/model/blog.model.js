import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    image: {
        type: String,

    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],

}, {
    timestamps: true
}
);

const Blog = mongoose.model("blog", blogSchema)

export default Blog