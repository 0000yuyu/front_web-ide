import { useState } from 'react';

export default function CodeTestPage() {
  const [form, setForm] = useState({
    teamId: 1,
    questId: 1,
    userId: 'user123',
    folderName: 'utils',
    fileName: 'main.py',
    language: 'python',
    codeContent: "print('Hello')",
    folderId: null,
    fileId: 5,
  });
  const [results, setResults] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateResult = (key, value) => {
    setResults((prev) => ({ ...prev, [key]: value }));
  };

  const clearResult = (key) => {
    setResults((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const runTest = async (type) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      const { teamId, questId, userId } = form;

      if (type === 'getCodeList') {
        const res = await fetch(`/code/${teamId}/${questId}/${userId}`);
        const data = await res.json();
        updateResult(type, { status: res.status, ...data });
      }
      if (type === 'addFolder') {
        const res = await fetch(`/code/${teamId}/${questId}/${userId}/folder`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ teamId, questId, userId, folderName: form.folderName })
        });
        const data = await res.json();
        updateResult(type, { status: res.status, ...data });
      }
      if (type === 'addFile') {
        const res = await fetch(`/code/${teamId}/${questId}/${userId}/file`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            teamId,
            questId,
            userId,
            folderId: form.folderId,
            fileName: form.fileName,
            language: form.language
          })
        });
        const data = await res.json();
        updateResult(type, { status: res.status, ...data });
      }
      if (type === 'editFile') {
        const res = await fetch(`/code/${teamId}/${questId}/${userId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            folderId: form.folderId,
            fileId: form.fileId,
            codeContent: form.codeContent
          })
        });
        const data = await res.json();
        updateResult(type, { status: res.status, ...data });
      }
      if (type === 'runCode') {
        const res = await fetch('/code/run', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            codeContext: form.codeContent,
            language: form.language
          })
        });
        const data = await res.json();
        updateResult(type, { status: res.status, ...data });
      }
    } catch (err) {
      updateResult(type, { status: 'error', message: err.message });
    }
  };

  const Section = ({ title, id, children }) => (
    <div className="mb-6 p-4 border border-transparent3 rounded-lg bg-transparent2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base1 font-semibold">{title}</h3>
        <button onClick={() => clearResult(id)} className="text-error text-sm">결과 삭제</button>
      </div>
      <div>{children}</div>
      {results[id] && (
        <div className={`mt-3 p-3 text-sm rounded-lg ${results[id].status === 200 ? 'bg-base3 text-white' : 'bg-error2 text-error'}`}>
          <pre>{JSON.stringify(results[id], null, 2)}</pre>
        </div>
      )}
    </div>
  );

  const Input = ({ name, placeholder, type = 'text' }) => (
    <input
      className="block w-full px-3 py-2 mb-2 border border-transparent3 rounded bg-white text-transparent3"
      name={name}
      value={form[name]}
      onChange={handleChange}
      placeholder={placeholder}
      type={type}
    />
  );

  return (
    <div className="p-6 font-mono">
      <h2 className="text-xl font-bold text-base1 mb-4">🧠 코드 관련 API 테스트</h2>

      <Section title="코드 목록 조회" id="getCodeList">
        <Input name="teamId" placeholder="팀 ID" type="number" />
        <Input name="questId" placeholder="퀘스트 ID" type="number" />
        <Input name="userId" placeholder="유저 ID" />
        <button onClick={() => runTest('getCodeList')} className="bg-base1 text-white px-4 py-1 rounded">조회</button>
      </Section>

      <Section title="폴더 추가" id="addFolder">
        <Input name="folderName" placeholder="폴더 이름" />
        <button onClick={() => runTest('addFolder')} className="bg-base1 text-white px-4 py-1 rounded">추가</button>
      </Section>

      <Section title="파일 추가" id="addFile">
        <Input name="folderId" placeholder="폴더 ID (null 가능)" />
        <Input name="fileName" placeholder="파일 이름 (ex. main.py)" />
        <Input name="language" placeholder="언어 (ex. python)" />
        <button onClick={() => runTest('addFile')} className="bg-base1 text-white px-4 py-1 rounded">추가</button>
      </Section>

      <Section title="파일 편집" id="editFile">
        <Input name="fileId" placeholder="파일 ID" />
        <Input name="folderId" placeholder="폴더 ID (null 가능)" />
        <Input name="codeContent" placeholder="코드 내용" />
        <button onClick={() => runTest('editFile')} className="bg-base1 text-white px-4 py-1 rounded">편집</button>
      </Section>

      <Section title="코드 실행" id="runCode">
        <Input name="codeContent" placeholder="실행할 코드 내용" />
        <Input name="language" placeholder="언어 (ex. python)" />
        <button onClick={() => runTest('runCode')} className="bg-base1 text-white px-4 py-1 rounded">실행</button>
      </Section>
    </div>
  );
}
