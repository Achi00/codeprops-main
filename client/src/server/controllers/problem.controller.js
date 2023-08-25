import Problem from '../mongodb/models/problem.js'

// Retrieve and return all problems
const getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find();
        res.status(200).json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProblem = async (req, res) => {
    const { name, timeToSolve, difficulty, language, solution, consoleOutput, description } = req.body;
    try {
        const newProblem = await Problem.create({
            name,
            timeToSolve,
            difficulty,
            language,
            solution,
            consoleOutput,
            description,
        });

        res.status(200).json({ message: 'Problem created successfully', problem: newProblem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Retrieve and return specific problem details
const getProblemDetail = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        res.status(200).json(problem);
    } catch (error) {
        res.status(404).json({ message: 'Problem not found', error: error.message });
    }
};

// Update an existing problem
const updateProblem = async (req, res) => {
    try {
        const updatedProblem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Problem updated successfully', problem: updatedProblem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a specific problem
const deleteProblem = async (req, res) => {
    try {
        await Problem.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Problem deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createProblem, getAllProblems, getProblemDetail, updateProblem, deleteProblem };
