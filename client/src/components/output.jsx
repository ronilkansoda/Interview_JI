import React, { useState, useEffect, useRef } from 'react';
import { executeCode } from "../utilities/api";
import { useSocket } from "../context/SocketProvider";

export default function Output({ editorRef, language }) {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const socket = useSocket();

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));

      let checkErr = result.stderr ? true : false;
      console.log(checkErr)

      setIsError(checkErr)
      socket.emit('outputUpdate', {
        hasError: checkErr,
        outputLines: result.output.split("\n")
      });
      console.log('Output Update sent:', { hasError: checkErr, outputLines: result.output.split("\n") });

    } catch (error) {
      console.log("Error:", error);
      // Handle error (e.g., show a toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize socket connection
    // socket = io('http://localhost:3000');


    // Listen for output updates from the server
    socket.on('outputUpdate', ({ hasError, outputLines }) => {
      console.log('Output Update received:', { hasError, outputLines });
      setIsError(hasError)
      setOutput(outputLines);
    });
    // socket.current.on('errorUpdate', (error) => {
    //   setIsError(error);
    // });

    return () => {
      // Cleanup on component unmount
      socket.off('outputUpdate');
      // socket.current.off('errorUpdate');
      // socket.disconnect();
    };
  }, [socket]);


  return (
    <div className="bg-[#1f1b2e] border border-gray-700 rounded h-1/2 px-6 py-2 overflow-auto">
      <div className="flex justify-between">
        <h1 className='text-gray-300 flex items-center'>Output:</h1>
        <button
          className="px-4 py-2 mb-2 border border-green-500 rounded text-green-500 hover:bg-green-500 hover:text-white transition-colors"
          disabled={isLoading}
          onClick={runCode}
        >
          {isLoading ? 'Running...' : 'Run Code'}
        </button>
      </div>

      <div className="outputDiv">
        {output ? (
          output.map((line, i) => (
            <p key={i} className={isError ? "text-red-500" : "text-gray-300"}  >
              {line}
            </p>
          ))
        ) : (
          <p className="text-gray-300 flex justify-center">Click "Run Code" to see the output here</p>
        )}
      </div>
    </div>
  );
}
