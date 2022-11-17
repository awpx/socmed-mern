import Post from "../models/Post.js";
import User from "../models/User.js";

//@desc       create post
//@route      POST /:userid/posts
//@access     verified only

export const createPost = async(req,res) => {
    try {
        const { userId, description, picturePath } = req.body
        const user = await User.findById(userId)
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            likes: {},
            comments: []
        })

        await newPost.save()

        const post = await Post.find()
        res.status(201).json(post)
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

//@desc       READ/get posts
//@route      GET /posts
//@access     verified only

export const getFeedPosts = async(req,res) => {
    try {
        const post = await Post.find()
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

//@desc       READ/get user posts
//@route      GET /posts
//@access     verified only

export const getUserPosts = async(req,res) => {
    try {
        const {userId} = req.params
        const post = await Post.find({userId})
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

//@desc       Update user posts
//@route      patch /:userid/post
//@access     verified only

export const likePost = async(req,res) => {
    try {
        const {id} = req.params
        const {userId} = req.body
        const post =await Post.findById(id)
        const isLiked = post.likes.get(userId)

        if(isLiked) {
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true)
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
        )

        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}