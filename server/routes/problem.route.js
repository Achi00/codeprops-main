import express from 'express';
import { getAllProblems, createProblem, getProblemDetail, updateProblem, deleteProblem } from '../controllers/problem.controller.js';

const router = express.Router();

router.get('/', getAllProblems);
router.post('/', createProblem);
router.get('/:id', getProblemDetail);
router.put('/:id', updateProblem);
router.delete('/:id', deleteProblem);

export default router;
