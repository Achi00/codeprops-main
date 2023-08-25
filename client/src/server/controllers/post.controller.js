import Post from '../mongodb/models/post.js'
import User from '../mongodb/models/user.js'

import * as dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import mongoose from 'mongoose'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const getAllPosts = async (req, res) => {
    const { _end, _start,_order, _sort, title_like = "", productType = "" } = req.query
    const query = {}
    if (productType !== "") {
        query.productType = productType
    }
    if (title_like) {
        query.title = { $regex: title_like, $options: 'i'}
    }
    try {
        const count = await Post.countDocuments({ query })
        const posts = await Post
        .find(query)
        .limit(_end)
        .skip(_start)
        .sort({ [_sort]: _order });
        res.header('x-total-count', count)
        res.header('Access-Control-Expose-Headers', 'x-total-count')

        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getPostDetail = async (req, res) => {
    const { id } = req.params
    const postExists = await Post.findOne({ _id: id }).populate('creator')

    if (postExists) {
        res.status(200).json(postExists)
    } else {
        res.status(404).json({ message: 'Post not found' })
    }
}

const createPost = async (req, res) => {
    try {
    const { 
      title,
      description,
      stock,
      flavor,
      serving,
      weight,
      productType,
      price,
      photo,
      photo2,
      email 
    } = req.body

    // start new session
    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);
    console.log(user);

    if (!user) throw new Error("User not found");

    const photoUrl = await cloudinary.uploader.upload(photo)
    const photoUrl2 = await cloudinary.uploader.upload(photo2)
    // const photoUrl3 = await cloudinary.uploader.upload(photo3)
    // const photoUrl4 = await cloudinary.uploader.upload(photo4)

    const newPost = await Post.create({
        title,
        description,
        stock,
        flavor,
        serving,
        weight,
        productType,
        price,
        photo: photoUrl.url,
        photo2: photoUrl2.url,

        creator: user._id
    })
    user.allPosts.push(newPost._id)
    await user.save({ session })
    await session.commitTransaction()

    res.status(200).json({ message: 'Post created successfully'})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const updatePost = async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        title,
        description,
        stock,
        flavor,
        productType,
        serving,
        weight,
        price,
        photo,
        photo2,
        email 
      } = req.body
  
      const post = await Post.findById(id);
  
      if (!post) {
        throw new Error("Post not found");
      }
  
      const photoUrl = photo ? await cloudinary.uploader.upload(photo) : null;
      const photoUrl2 = photo2 ? await cloudinary.uploader.upload(photo2) : null;
  
      await post.updateOne({
        title,
        description,
        stock,
        flavor,
        serving,
        weight,
        productType,
        price,
        photo: photoUrl?.url || post.photo,
        photo2: photoUrl2?.url || post.photo2,
      });
  
      res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const deletePost = async (req, res) => {
    try {
      const { id } = req.params;
  
      const postToDelete = await Post.findOne({ _id: id }).populate("creator");
  
      if (!postToDelete) throw new Error("Post not found");
  
      const session = await mongoose.startSession();
      session.startTransaction();
  
      await Post.deleteOne({ _id: id }, { session });
      postToDelete.creator.allPosts.pull(postToDelete);
  
      await postToDelete.creator.save({ session });
      await session.commitTransaction();
  
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export {
    getAllPosts,
    getPostDetail,
    createPost,
    updatePost,
    deletePost,
}