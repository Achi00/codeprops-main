import express from "express";
import OpenAIStream from '../lib/stream.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const messages = req.body.messages;
  console.log("Received prompt:", messages);
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "There was an error with your text, try again!" });
  }
  
  try {
    const payload = {
      model: "gpt-4",
      messages: messages,
      temperature: 0.1,
      top_p: 0.1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1024,
      stream: true,
      n: 1,
    };
  
      const stream = await OpenAIStream(payload);
  
      res.setHeader("Content-Type", "text/plain");
  
      for await (const chunk of stream) {
        res.write(chunk);
      }
  
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  
  export default router
  