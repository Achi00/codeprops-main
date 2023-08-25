import express from 'express';
import prettier from 'prettier'

const router = express.Router();

router.post('/format-code', (req, res) => {
    const { code } = req.body;
  
    try {
        const formattedCode = prettier.format(code, { semi: false, parser: "babel" });
        console.log("Formatted code:", formattedCode); // Log it here
        res.json({ formattedCode });
      } catch (error) {
        res.status(400).json({ error: 'Error formatting the code.' });
      }
      
  });
  

export default router;