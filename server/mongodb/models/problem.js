import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    timeToSolve: {type: Number, required: true}, // in minutes
    difficulty: {type: String, required: true},
    description: {type: String, required: true},
    language: {type: String, required: true}, // such as JS, TSX, CSS, etc.
    solution: {type: String, required: true}, // could be a correct code snippet
    consoleOutput: {type: String, required: true}
})

const problemModel = mongoose.model('Problem', ProblemSchema)

export default problemModel
