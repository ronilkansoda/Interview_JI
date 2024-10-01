import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import io from 'socket.io-client';
import { CODE_SNIPPETS } from '../utilities/constants';
import Video from '../components/video';
import Output from '../components/output';
import LanguageSelector from '../components/languageSelector';

export default function CodeEditor() {
  const editorRef = useRef();
  const [value, setValue] = useState('')
  const [language, setLanguage] = useState('javascript');

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };
  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };


  const socket = io('http://localhost:3000');
  const handelChange = (newCode) => {
    setValue(newCode);
    socket.emit('codeUpdate', newCode);
  };

  useEffect(() => {
    // Listen for code updates from the server
    socket.on('codeUpdate', (newCode) => {
      setValue(newCode);
    });

    return () => {
      socket.off('codeUpdate');
    };
  }, []);


  return (
    <div className="bg-[#0f0a19] w-full h-screen text-gray-500 p-6">
      {/* Container for entire layout */}
      <div className="flex flex-col h-full">
        <div className='flex flex-col h-full'>
          {/* Header Area */}
          <div className="flex justify-center items-center mb-4 gap-2">
            {/* Language Selector at the top */}
            <LanguageSelector language={language} onSelect={onSelect} />
          </div>

          {/* Main Area */}
          <div className="flex flex-grow space-x-4">
            {/* Code Editor Section */}
            <div className="flex-grow">
              <Editor
                options={{ minimap: { enabled: false } }}
                // height="75vh"
                theme="vs-dark"
                language={language}
                defaultValue={CODE_SNIPPETS[language]}
                onMount={onMount}
                value={value}
                onChange={(value) => handelChange(value)}
              />
              {/* <div className="mt-4 flex justify-center"> */}
              {/* Pass isLoading and runCode to RunCodeButton */}
              {/* <RunCodeButton /> */}
              {/* </div> */}
            </div>

            {/* Video and Output Section */}
            <div className="flex flex-col justify-between w-2/5 space-y-4">
              {/* Video Component */}
              <Video />

              {/* Output Section */}
              <Output editorRef={editorRef} language={language} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
