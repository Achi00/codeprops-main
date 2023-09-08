import React, { useRef, useEffect, forwardRef } from 'react';
import Frame from 'react-frame-component';

const MyFrameComponent = forwardRef<any, { code: string, onLog: (message: string) => void }>(
  ({ code }, ref) => {
    const initialContent = `
    <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        </head>
        <body>
          <script>
          // Save a reference to the real axios object
          const realAxios = axios;

          const methodsToOverride = ['get', 'post', 'put', 'delete'];

          methodsToOverride.forEach((method) => {
            window.axios[method] = function (...args) {
              return realAxios[method](...args).catch((error) => {
                let errorMessage;
                if (error.response) {
                  errorMessage = {
                    type: 'error',
                    status: error.response.status,
                    message: error.response.statusText,
                  };
                } else {
                  // Handle generic error, including network errors
                  errorMessage = {
                    type: 'error',
                    message: 'There was a network error: ' + error.message,
                  };
                }
              
                // Post the error message to the parent window
                window.parent.postMessage(errorMessage, '*');
              
                // Re-throw the error to be handled by user code
                throw error;
              });
            };
          });    
        
            window.onerror = function(message, source, lineno, colno, error) {
              console.error('Global error:', error);
              const errorMessage = {
                type: 'error',
                message: message,
                stack: error.stack,
                line: lineno,
                column: colno,
              };
              window.parent.postMessage(errorMessage, '*');
            };
          
            window.addEventListener('message', function(event) {
              let hasError = false;
          
              const timeoutId = setTimeout(() => {
                  // Time limit exceeded
                  hasError = true;  // Indicate that we've terminated due to a timeout
                  const errorMessage = {
                      type: 'error',
                      message: 'Code execution terminated due to timeout.',
                  };
                  window.parent.postMessage(errorMessage, '*');
              }, 5000);  // Set your desired timeout, e.g., 5000 for 5 seconds
          
              try {
                  eval(event.data.code);
                  if (!hasError) {  // If code executed successfully without a timeout
                      clearTimeout(timeoutId);  // Clear the timeout
                  }
              } catch (error) {
                  if (!hasError) {  // If the error wasn't caused by our timeout termination
                      clearTimeout(timeoutId);  // Clear the timeout
                      console.error(error);
                      const errorMessage = {
                          type: 'error',
                          message: error.message,
                          stack: error.stack,
                          line: error.lineNumber,
                          column: error.columnNumber,
                      };
                      window.parent.postMessage(errorMessage, '*');
                  }
              }        
          });
          
          
            console.log = function(...args) {
              const messages = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg));
              window.parent.postMessage({ type: 'log', message: messages.join(' ') }, '*');
            };
          </script>
        </body>
      </html>
    
`;

    return (
      <div style={{ display: 'none' }}>
      <Frame ref={ref} initialContent={initialContent}>
        <div /> {/* Empty div inside the iframe */}
      </Frame>
      </div>
    );
  }
);

export default MyFrameComponent;
