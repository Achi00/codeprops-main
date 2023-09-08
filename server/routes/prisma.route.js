import express from 'express';
import esprima from 'esprima';

const router = express.Router();

function checkErrorHandlingInAsyncFunctions(ast) {
    let hasAsyncFunction = false;
    
    function traverse(node, insideAsyncFunction) {
      if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
        if (node.async) {
          insideAsyncFunction = true;
          hasAsyncFunction = true;  // Set the flag that we have an async function
        } else {
          insideAsyncFunction = false;
        }
      }
  
      if (insideAsyncFunction && node.type === 'TryStatement') {
        return true;  // Error-handling is present
      }
  
      let errorHandledInChildren = false;
      for (const key in node) {
        if (node[key] && typeof node[key] === 'object') {
          if (traverse(node[key], insideAsyncFunction)) {
            errorHandledInChildren = true;
          }
        }
      }
  
      return errorHandledInChildren;
    }
  
    const result = traverse(ast, false);
  
    if (!hasAsyncFunction) {
      return { message: 'No async function found.' };
    }
    return result ? { message: 'All good!' } : { message: 'You should add error-handling to your async function.' };
}

  
  

  router.post('/check-error-handling', (req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
      console.log('Received code:', req.body);  // Debugging line
      const { code } = req.body;
      const ast = esprima.parseScript(code, { comment: true, tolerant: true });
      const result = checkErrorHandlingInAsyncFunctions(ast);
      console.log('Result:', result);  // Debugging line
      res.json(result);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ message: 'An internal error occurred.' });
    }
  });
  

export default router;
