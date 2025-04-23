import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({
  selectedFile,
  onEditorMount,
  onEditFile,
  onExcuteFile,
  onRunCode,
}) {
  const languageOptions = ['java', 'python3'];
  const [language, setLanguage] = useState(selectedFile.language);
  const [code_content, setCodeContent] = useState(selectedFile.code);

  return (
    <div className='p-2 flex h-full  flex-col bg-code'>
      <div className='flex items-center justify-between mb-2 p-2 bg-code'>
        <h2 className='text-[#ABB2BF] flex gap-2 bg-transparent3 border p-[5px] px-5 rounded-lg'>
          <span className=''>{selectedFile.file_name || '새 파일'}</span>
        </h2>
        <div className='flex items-center'>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className='border rounded p-1 mr-2 text-sm bg-[#3B4048] text-[#ABB2BF] border-[#383E4A]'
          >
            {languageOptions.map((lang) => (
              <option
                key={lang}
                value={lang}
                className='bg-[#282C34] text-[#ABB2BF]'
              >
                {lang}
              </option>
            ))}
          </select>
          <div className='flex gap-2'>
            <button
              onClick={() => {
                onExcuteFile(true);
                onRunCode();
              }}
              className='bg-transparent2 text-black rounded p-2 text-sm'
            >
              실행
            </button>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => onEditFile()}
              className='bg-transparent2 text-black rounded p-2 text-sm'
            >
              저장
            </button>
          </div>
        </div>
      </div>
      <div className='border h-full rounded overflow-hidden border-[#383E4A]'>
        <Editor
          className='h-[500px] text-[#ABB2BF]'
          language={language == 'python3' ? 'python' : language}
          value={selectedFile.code}
          onMount={onEditorMount}
          onChange={setCodeContent}
          options={{
            fontSize: 20,
            minimap: { enabled: false },
            selectOnLineNumbers: true,
            theme: 'vs-dark',
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
