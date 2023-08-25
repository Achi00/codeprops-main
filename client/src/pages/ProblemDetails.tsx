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
    const [hasError, setHasError] = useState(false);
    // code editor
    const editorRef = useRef<any>(null);

    // State to store linting results
    const [lintResults, setLintResults] = useState<any[]>([]);

    // use mutation for chat ai streaming results
    const { mutate: sendMessage } = useMutation({
      mutationFn: async (messageContent: string) => {
        const response = await fetch("http://localhost:8080/api/v1/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `Task description: ${problemDetails?.description}\nLanguage: ${problemDetails?.language}\nCode: ${code}\nConsole Output: ${logs} \n give me some advice or a hint on how to fix this, but please don't solve it for me`,
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
        setHasError(true);
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

    const debouncedLintCode = debounce(lintCode, 300); // 300ms delay
  // update code
    function handleEditorChange(value:any) {
      setLintResults([])
      setCode(value);
      debouncedLintCode()
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
        <Box component="div" sx={{ padding: '2rem'}}>
          <Stack direction="row" width="100%" justifyContent="space-around">
          <Stack direction="column" width="100%">
              <Typography>{problemDetails?._id}</Typography>
              <Typography>{problemDetails?.name}</Typography>
              <Typography>{problemDetails?.category}</Typography>
              <Typography>{problemDetails?.difficulty}</Typography>
              <Typography>{problemDetails?.language}</Typography>
              <Typography>{problemDetails?.timeToSolve}</Typography>
              <Typography>{problemDetails?.description}</Typography>
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
                  <button disabled={!hasError} onClick={() => sendMessage('')}>
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
                      backgroundColor: 'black', 
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
          backgroundColor: 'black',
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
        <div key={index}>
          {result.messages.map((message: any) => (
            <div
              key={message.ruleId}
              style={{ marginBottom: '10px', color: message.severity === 2 ? 'red' : 'orange' }}
            >
              <span>
                {message.severity === 2 ? (
                  <ErrorIcon sx={{ color: 'red' }} /> // Error icon
                ) : (
                  <WarningAmberIcon sx={{ color: 'orange' }} /> // Warning icon
                )}
              </span>
              <strong>{message.message}</strong>
              <div>Line: {message.line}, Column: {message.column}</div>
              {message.fix && (
                <div>
                  Suggested fix: 
                  <code>{message.fix.text}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}


export default ProblemDetails;
  