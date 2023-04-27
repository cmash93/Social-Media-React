import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        likes: [],
        createdAt: {
            type: Date,
            default: new Date()
        },
        image: String
    },
    {
        timestamps: true
    }
);

const Post = mongoose.model('Posts', postSchema);
export default Post;