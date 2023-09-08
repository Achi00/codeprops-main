import { Typography, Box, Stack, Link } from "@pankod/refine-mui";
import { useDelete, useGetIdentity, useShow } from "@pankod/refine-core";
import { CustomButton, Loading } from "components";
import Editor from '@monaco-editor/react';
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash"
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MyFrameComponent from "components/MyFrameComponent";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from 'react-hot-toast';
import _ from "lodash";
import {CustomToastContent, customStyles} from '../components/helpers/toast'
import Alert from '@mui/material/Alert';

let lastMessageTime = 0; // define this variable outside your component or function

const ProblemDetails = () => {
    const { queryResult } = useShow();
    const { data, isLoading, isError } = queryResult;
  
    const problemDetails = data?.data; // assuming problemDetails is an object

    const [logs, setLogs] = useState<string[]>([]);
    const [code, setCode] = useState(`console.log("CodeProps")`);
    const [formattedError, setFormattedError] = useState<React.ReactNode | null>(null);
    const [chatDetails, setchatDetails] = useState<string | null>(null)
    // col line
    const [cursorPosition, setCursorPosition] = useState<{ line: number, column: number }>({ line: 1, column: 1 });
    // check if error exists
    const [hasLintError, setHasLintError] = useState(false);
    const [hasRuntimeError, setHasRuntimeError] = useState(false);

    // code editor
    const editorRef = useRef<any>(null);
    // State to store linting results
    const [lintResults, setLintResults] = useState<any[]>([]);

    // monitor if there is error in custom log 
    useEffect(() => {
      const errorFound = logs.some(log => log.toLowerCase().includes('error'));
      if (errorFound) {
        setHasRuntimeError(true);
      }
  }, [logs]);
  

    // use mutation for chat ai streaming results
    const { mutate: sendMessage } = useMutation({
      mutationFn: async (messageContent: string) => {
        // Create individual message segments
        const taskDescription = `Task description: ${problemDetails?.description}`;
        const languageSegment = `Language: ${problemDetails?.language}`;
        const codeSegment = `Code: ${code}`;
        const consoleOutputSegment = hasRuntimeError ? `Console Output: ${logs}` : "";
        const eslintSegment = hasLintError ? `ESLint Errors: ${JSON.stringify(lintResults)}` : "";
    
        // Construct the final message
        const finalMessage = `${taskDescription}\n${languageSegment}\n${codeSegment}\n${consoleOutputSegment}\n${eslintSegment}\n give me some advice or a hint on how to fix this, but please don't solve it for me and don't gave any code examples also dont suggest to install any libraries becouse its already installed`;

        console.log(finalMessage)
    
        const response = await fetch("http://localhost:8080/api/v1/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: finalMessage.trim(),
              },
            ],
          }),
        });
    
        if (!response.body) {
          throw new Error('Response body is null');
        }    
  
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let result = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          const chunk = decoder.decode(value);
          setchatDetails((prevData:any) => (prevData ? prevData + chunk : chunk)); // Update your state here
          result += chunk;
        }
        return result; // the whole response
      },
    });

    // cursor position listener
    function handleEditorMount(editor: any) {
      editorRef.current = editor;
      editor.onDidChangeCursorPosition((e: any) => {

        setCursorPosition({
          line: e.position.lineNumber,
          column: e.position.column
        });
      });
    }
       
    function handleIframeMessage(event: any) {
      if (event.data.type === 'error') {
        const customError = {
          name: "Error",
          message: event.data.message,
          stack: event.data.stack || "",
        };
        const customErrorMessage = displayError(customError);
        setFormattedError(customErrorMessage); // Save the formatted JSX message
        setHasRuntimeError(true);
      } else if (event.data.type === 'log') {
        handleIframeLog(event.data.message);
      }
    }
    
    useEffect(() => {
      window.addEventListener('message', handleIframeMessage);
    
      return () => {
        window.removeEventListener('message', handleIframeMessage);
      };
    }, []);
    

    // display better error message
    function displayError(error: any) {
      // Extract the error type and message
      const errorType = error.name || "Error";
      const errorMessage = error.message || "An unknown error occurred";
    
      // Try to extract line and column information
      let lineInfo = "";
      const match = error.stack.match(/<anonymous>:(\d+):(\d+)/);
      if (match) {
        const line = match[1];
        const column = match[2];
        lineInfo = `Line: ${line}, Column: ${column}`;
      }
    
      return (
        <div>
          <strong>{errorType}:</strong> {errorMessage}
          <div>{lineInfo}</div> {/* Show the line and column info */}
        </div>
      );
    }
        


    // check syntax
    async function lintCode() {
      try {
        const response = await fetch('http://localhost:8080/api/v1/eslint/lint-code', {
          method: 'POST',
          body: JSON.stringify({ code }),
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        setLintResults(result.lintResults);
      } catch (error) {
        console.error("Linting error:", error);
      }
    }
    

    // check for async function error handling
  const debouncedCheck = _.debounce(async () => {
  const currentTime = new Date().getTime();

  console.log('Current Time:', currentTime);
  console.log('Last Message Time:', lastMessageTime);

  // cahnge back to 60000
  if (currentTime - lastMessageTime < 60000) { 
    // Less than a minute has passed since the last message
    return;
  }

  // Only proceed if enough time has passed since the last message
    try {
      const response = await fetch('http://localhost:8080/api/v1/prisma/check-error-handling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }), // replace 'code' with your variable
      });

      const data = await response.json();

      if (data.message === 'You should add error-handling to your async function.') { // replace with whatever message your server sends
        toast((t) => <CustomToastContent />, {
          style: customStyles,
          icon: '⚠️',
        });
        lastMessageTime = currentTime; // Update last message time
      }
    } catch (error) {
      console.error('Error checking for error-handling:', error);
    }

}, 1500);

    // detect infinite loops and warn user about
    function detectInfiniteLoop(code: string): number[] {
      const patterns = [
          /while\s*\(\s*true\s*\)\s*\{/,
          /for\s*\(\s*;\s*;\s*\)\s*\{/,
          /for\s*\(\s*let\s+\w+\s*=\s*\d+;\s*\w+\s*<\s*\d+;\s*\w+\s*--\s*\)\s*\{/,
          /for\s*\(\s*let\s+\w+\s*=\s*\d+;\s*\w+\s*>\s*\d+;\s*\w+\s*\+\+\s*\)\s*\{/
      ];
  
      const lines = code.split('\n');
      const offendingLines: number[] = [];
  
      for (let i = 0; i < lines.length; i++) {
          for (let pattern of patterns) {
              if (pattern.test(lines[i])) {
                  offendingLines.push(i + 1); // +1 because line numbers usually start from 1, not 0
              }
          }
      }
  
      return offendingLines;
  }  
    

    const debouncedLintCode = debounce(lintCode, 300); // 300ms delay
    // update code
    function handleEditorChange(value: any) {
      setLintResults([]);
      setCode(value);
      debouncedCheck();
  
      const offendingLines = detectInfiniteLoop(value);
      if (offendingLines.length > 0) {
          toast(`Detected potential infinite loops on lines: ${offendingLines.join(', ')}`, {
              icon: '⚠️',
              style: {
                border: '1px solid #0D1318',
                padding: '16px',
                fontSize: '19px',
                color: '#f2f2f2',
                backgroundColor: '#0D1318'
              },
          } );
          console.log(`Detected potential infinite loops on lines: ${offendingLines.join(', ')}`);
      } else {
          debouncedLintCode();
      }
  }
    

    function handleIframeLog(message: string) {
      setLogs(prevLogs => [...prevLogs, message]);
    }
     
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    //  clear state on button click
    function ClearConsole() {
      setLogs([]);
    }

    const options = {
        autoIndent: 'full',
        contextmenu: true,
        fontFamily: "Courier New",
        fontSize: 22,
        lineHeight: 24,
        hideCursorInOverviewRuler: true,
        matchBrackets: 'always',
        minimap: {
          enabled: true,
        },
        scrollbar: {
          horizontalSliderSize: 4,
          verticalSliderSize: 18,
        },
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: true,
      };
  
    if (isLoading) {
      return <Loading />;
    }
  
    if (isError) {
      return <div>Something went wrong!</div>;
    }
  
    return (
      <Box component="div" sx={{ width: '100%' }}>
        <Toaster />
        <Box component="div" sx={{ padding: '2rem'}}>
          <Stack direction="row" width="100%" justifyContent="space-around">
          <Stack direction="column" width="100%">
              <Typography sx={{borderTop: '1px solid black'}}>{problemDetails?._id}</Typography>
              <Typography sx={{borderTop: '1px solid black'}}>{problemDetails?.name}</Typography>
              <Typography sx={{borderTop: '1px solid black'}}>{problemDetails?.category}</Typography>
              <Typography sx={{borderTop: '1px solid black'}}>{problemDetails?.difficulty}</Typography>
              <Typography sx={{borderTop: '1px solid black'}}>{problemDetails?.language}</Typography>
              <Typography sx={{borderTop: '1px solid black'}}>{problemDetails?.timeToSolve}</Typography>
              <Typography sx={{borderTop: '1px solid black'}}>{problemDetails?.description}</Typography>
              <Typography sx={{borderTop: '1px solid black'}}>{problemDetails?.solution}</Typography>
              <Typography sx={{borderTop: '1px solid black'}}>{problemDetails?.consoleOutput}</Typography>
          </Stack>
          <Box component="div" sx={{ width: "100%"}}>
              <Editor 
              height="85vh" 
              defaultLanguage="javascript" 
              defaultValue={`console.log("CodeProps")`} 
              options={options}
              theme="vs-dark"
              onChange={handleEditorChange}
              onMount={handleEditorMount}
              />
              {/* <button onClick={runCode}>Run Code</button> */}
              <button onClick={() => { 
                if (iframeRef.current) {
                  iframeRef.current.contentWindow?.postMessage({ code }, '*');
                }
              }}>Run Code</button>
              <button onClick={ClearConsole}>Clear Console</button>
              {/* get AI help */}
              <div>
                <div>
                <button disabled={!(hasLintError || hasRuntimeError)} onClick={() => sendMessage('')}>
                    AI Help
                </button>
                </div>
              </div>
              <div>
                Line: {cursorPosition.line}, Column: {cursorPosition.column}
              </div>
              <MyFrameComponent ref={iframeRef} code={code} onLog={handleIframeLog} />
              <ConsoleOutput logs={logs} />
              {formattedError && (
                <div style={{ color: 'red', padding: '10px' }}>
                  {formattedError}
                </div>
              )}
              {chatDetails && (
                  <Box component="div">
                    this is Ai message
                    <Box component="div" sx={{ 
                      backgroundColor: '#1E1E1E', 
                      color: 'white', 
                      height: 'auto',
                    }}>
                      <Box component="div"
                        sx={{
                          overflowWrap: 'break-word',
                          padding: '2rem',
                          wordWrap: 'break-word',
                          overflow: 'auto',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {chatDetails}
                      </Box>
                    </Box>
                  </Box>
                )}
              <LintingOutput results={lintResults} />
          </Box>
          </Stack>
        </Box>
      </Box>
    );
  };

  function ConsoleOutput({ logs }: any) {
    return (
      <div
        style={{
          backgroundColor: '#1E1E1E',
          color: 'white',
          padding: '10px',
          fontFamily: 'monospace',
          overflowX: 'auto',
          width: '100%',
          whiteSpace: 'pre-line'
        }}
      >
        {logs?.map((log: string, index: number) => {
          try {
            // Parse the JSON string into an object
            const jsonObj = JSON.parse(log);
  
            // Convert the object back to a string with formatting
            const prettyJsonString = JSON.stringify(jsonObj, null, 2)
              .split('\n')
              .map((line, lineIndex) => {
                const isChildBlock = line.trim().startsWith('"');
                return (
                  <div key={lineIndex} style={{ marginLeft: isChildBlock ? '20px' : '0px' }}>
                    {line}
                  </div>
                );
              });
  
            return <div key={index}>{prettyJsonString}</div>;
          } catch (e) {
            // If it's not a JSON string, just render it as-is
            return <div key={index}>{log}</div>;
          }
        })}
      </div>
    );
}
  
  
function LintingOutput({ results }: any) {
  return (
    <div style={{ padding: '10px', fontFamily: 'monospace' }}>
      {results?.map((result: any, index: number) => (
        <Stack direction="column" gap="2vmin" key={index}>
          {result.messages.map((message: any, i: number) => (
            <Alert severity="error">
            <div
              key={i}
              style={{ marginBottom: '10px', color: message.severity === 2 ? 'red' : 'orange' }}
            >
              <strong>{message.message}</strong>
              <div>Line: {message.line}, Column: {message.column}</div>
              {message.fix?.text && (
                <div>
                  Suggested fix: 
                  <code>{message.fix.text}</code>
                </div>
              )}
            </div>
            </Alert>
          ))}
        </Stack>
      ))}
    </div>
  );
}


export default ProblemDetails;
  