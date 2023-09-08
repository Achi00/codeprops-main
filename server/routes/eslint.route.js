import { ESLint } from 'eslint';
import express from 'express';

const router = express.Router();

const eslint = new ESLint();

router.post('/lint-code', async (req, res) => {
  try {
    const code = req.body.code;
    const results = await eslint.lintText(code);
    const formatter = await eslint.loadFormatter('json');
    const resultJson = formatter.format(results);

    // Parse the JSON string into an object.
    const resultObject = JSON.parse(resultJson);

    // You can now work with resultObject as needed, or return it directly.
    res.json({ lintResults: resultObject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while linting the code' });
  }
});

export default router;
