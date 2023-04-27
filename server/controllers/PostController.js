import mongoose from 'mongoose';
import Post from '../models/Post.js';
import User from '../models/User.js';

// Creating Post
export const createPost = async (req, res) => {
    const newPost = new Post(req.body);

    try {
        await newPost.save();
        res.status(200).json(newPost)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

// Get Single Post
export const getPost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await Post.findById(id)
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error.message)
    }
}

// Update Post
export const updatePost = async (req, res) => {
    const id = req.params.id;
    const { userId } =req.body;

    try {
        const post = await Post.findById(id);
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json({ message: 'Post updated!' });
        } else {
            res.status(403).json({ message: 'Authentication failed.' });
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}

// Delete Post
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);
        if (post.userId === userId) {
            await post.deleteOne();
            res.status(200).json({ message: 'Post successfully deleted.' });
        } else {
            res.status(403).json({ message: 'Action forbidden.' });
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}

// Like/Dislike Post
export const likePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);
        if (post.likes.includes(userId)) {
            await post.updateOne({
                $pull: {
                    likes: userId
                }
            })
            res.status(200).json({ message: 'Post disliked.' })
        } else {
            await post.updateOne({
                $push: {
                    likes: userId
                }
            });
            res.status(200).json({ message: 'Post liked.' });
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}

// Get All Timeline Posts (based on userId)
export const getTimeline = async (req, res) => {
    const userId = req.params.id;

    try {
        const currentUserPosts = await Post.find({ userId: userId });
        const followingPosts = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'following',
                    foreignField: 'userId',
                    as: 'followingPosts'
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ]);

        // lookup why this works :)
        res.status(200).json(
            currentUserPosts
            .concat(...followingPosts[0].followingPosts)
            .sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            })
        );
    } catch (error) {
        res.status(500).json(error.message)
    }
}