import express from "express"
import { createProblem, getAllProblems, getProblemDetail, updateProblem, deleteProblem } from "../controllers/problem.controller.js";

const router = express.Router()

router.route("/").get(getAllProblems).post(createProblem);
router.route("/:id").get(getProblemDetail).put(updateProblem).delete(deleteProblem);

// Add more routes like router.route("/:id").get(getProblemDetail) etc.

export default router
