import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { FaCheck } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

function CodeEditor({
  selectedFile,
  onEditorMount,
  onEditFile,
  onExcuteFile,
  onRunCode,
}) {
  const languageOptions = ['java', 'python3'];
  const [new_file_name, set_file_name] = useState('');
  const [is_edit, set_edit] = useState(false);
  const [language, setLanguage] = useState(selectedFile.language);
  const [code_content, setCodeContent] = useState(selectedFile.code);

  // selectedFile이 변경될 때 code_content를 동기화
  useEffect(() => {
    console.log('바뀜');
    console.log(selectedFile);
    setCodeContent(selectedFile.code_context ?? '');
    setLanguage(selectedFile.language);
    set_edit(false);
  }, [selectedFile]);

  return (
    <div className='p-2 flex w-full overflow-hidden flex-col bg-code'>
      <div className='flex items-center justify-between mb-2 p-2 bg-code'>
        <div className='flex flex-col justify-start gap-2 items-start'>
          <h2 className='text-[#ABB2BF] flex gap-2 bg-transparent3 border p-[5px] px-5 rounded-lg'>
            <span className=''>{selectedFile.file_name || '새 파일'}</span>
            <button
              onClick={() => {
                if (is_edit) {
                  onEditFile({ file_name: new_file_name });
                  selectedFile.file_name = new_file_name;
                  set_file_name('');
                }
                set_edit(!is_edit);
              }}
            >
              | {is_edit ? '완료' : '수정'}
            </button>
          </h2>
          {is_edit && (
            <input
              type='text'
              value={new_file_name}
              onChange={(e) => set_file_name(e.target.value)}
              placeholder='새 파일 이름'
              className='p-1 mr-2 bg-[#3B4048] w-full text-[#ABB2BF] border border-[#383E4A] rounded text-sm'
            />
          )}
        </div>
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
              onClick={() => {
                console.log(selectedFile);
                onEditFile();
              }}
              className='bg-transparent2 text-black rounded p-2 text-sm'
            >
              저장
            </button>
          </div>
        </div>
      </div>
      <div className='border h-full rounded overflow-hidden border-[#383E4A]'>
        <Editor
          className='h-[500px] w-full text-[#ABB2BF]' // Added w-full here
          language={language === 'python3' ? 'python' : language}
          value={code_content} // code_content 상태를 value로 사용
          onMount={onEditorMount}
          onChange={setCodeContent} // 에디터 내용이 변경될 때 code_content 업데이트
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
