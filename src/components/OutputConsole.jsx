import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';

export default function OutputConsole({
  folderStructure,
  selectedFile,
  output,
}) {
  const terminalRef = useRef(null);
  const terminal = useRef(null);
  const fitAddon = useRef(new FitAddon());

  const getFilePath = (structure, fileId) => {
    let filePath = '';
    const findFilePath = (folders) => {
      for (let folder of folders) {
        const file = folder.files?.find((f) => f.file_id === fileId);
        if (file) {
          filePath = `${folder.folder_name}/${file.file_name}`;
          return true;
        }
        if (folder.children) {
          if (findFilePath(folder.children)) {
            filePath = `${folder.folder_name}/${filePath}`;
            return true;
          }
        }
      }
      return false;
    };

    findFilePath(structure);
    return filePath || '/';
  };

  // 1. 터미널 초기화
  useEffect(() => {
    if (!terminal.current) {
      terminal.current = new Terminal({
        cursorBlink: true,
        theme: {
          background: '#21252B',
          foreground: '#ABB2BF',
        },
      });
      terminal.current.loadAddon(fitAddon.current);
      terminal.current.open(terminalRef.current);
      fitAddon.current.fit();
      terminal.current.writeln('Welcome to the File Explorer Terminal!');
    }
  }, []);

  // 2. 선택된 파일이 바뀔 때마다 경로 출력
  useEffect(() => {
    if (terminal.current) {
      const filePath = getFilePath(folderStructure, selectedFile?.file_id);
      terminal.current.clear();
      terminal.current.writeln(`현재 경로: ${filePath}`);
      terminal.current.writeln(`\x1b[1;32m${output}\x1b[0m`); // 초록색 출력
    }
  }, [folderStructure, selectedFile]);

  return (
    <div className='flex w-full'>
      <div
        ref={terminalRef}
        className='h-full border border-[#383E4A] bg-[#21252B] text-[#ABB2BF]'
      />
    </div>
  );
}
