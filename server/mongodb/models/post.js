import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    header: {type: String, required: true},
    header2: {type: String, required: true},
    header3: {type: String, required: true},
    imgurl: {type: String, required: true},
    tech: {type: String, required: true},
    postType: {type: String, required: true},
    photo: {type: String, required: true},
    photo2: {type: String, required: true},
    photo3: {type: String, required: true},
    photo4: {type: String, required: true},
    github: {type: String, required: true},
    preview: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})

const postModel = mongoose.model('Post', PostSchema)

export default postModel