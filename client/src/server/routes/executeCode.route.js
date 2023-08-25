import express from 'express';
import axios from 'axios';
import ivm from 'isolated-vm'

const router = express.Router();

router.post('/execute-code', async (req, res) => {
    try {
      const code = req.body.code;
      const wrappedCode = `(async () => { ${code} })()`;
  
      const isolate = new ivm.Isolate();
      const context = await isolate.createContext();
  
      // Create a synchronous wrapper for Axios get method
      const axiosGetSync = new ivm.Reference(function (url) {
        return axios.get(url).then(response => response.data);
      });
  
      await context.global.set('axios', { get: axiosGetSync });
  
      const script = await isolate.compileScript(wrappedCode);
      const result = await script.run(context);
  
      res.json({ result: result.deref() });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while executing the code' });
    }
});
  
  

export default router;
