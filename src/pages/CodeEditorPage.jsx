import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

export default function CodeEditorPage() {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const terminalRef = useRef(null);
  const term = useRef(null);
  const [code, setCode] = useState(`from discord.ext import commands

bot = commands.Bot("")

@bot.command('ping')
async def ping(ctx: commands.Context):
    await ctx.send('pong')

bot.run('TOKEN')`);

  useEffect(() => {
    if (editorRef.current) {
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value: code,
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
      });

      monacoRef.current.onDidChangeModelContent(() => {
        setCode(monacoRef.current.getValue());
      });
    }

    if (terminalRef.current && !term.current) {
      term.current = new Terminal();
      term.current.open(terminalRef.current);
      term.current.writeln('Microsoft Windows [Version 10.0.19044.2728]');
      term.current.writeln('(c) Microsoft Corporation. All rights reserved.');
      term.current.write('C:\\Users\\You> ');
    }
  }, []);

  const handleRun = () => {
    // 추후 API 요청 추가 예정
    term.current.writeln('\r\n> 명령을 실행합니다... (API 요청 전 단계)');
    term.current.write('C:\\Users\\You> ');
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex items-center justify-between p-2 bg-gray-900 text-white'>
        <div>www.url.com</div>
        <button className='bg-blue-600 px-3 py-1' onClick={handleRun}>
          실행
        </button>
      </div>
      <div className='flex flex-1'>
        <div className='w-1/5 bg-gray-800 text-white p-2'>
          <div className='mb-2'>📁 폴더</div>
          <ul>
            <li className='p-1'>📄 File.py</li>
            <li className='p-1'>📄 File2.py</li>
            <li className='p-1'>📄 File3.py</li>
          </ul>
        </div>
        <div className='w-4/5 flex flex-col'>
          <div ref={editorRef} className='flex-1' />
          <div ref={terminalRef} className='h-40 bg-black text-white p-2' />
        </div>
      </div>
    </div>
  );
}
