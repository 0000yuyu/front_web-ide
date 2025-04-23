import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  addFile,
  addFolder,
  getCodeList,
  runCode,
  editFile,
  updateQuestState,
  getQuest,
} from '@/utils/codeManage';
import CodeEditor from '@/components/CodeEidtor';
import FileExplorer from '@/components/FileExplorer';
import OutputConsole from '@/components/OutputConsole';

export default function CodeEditorPage() {
  const { team_id, quest_id, user_id } = useParams();
  const [folderStructure, setFolderStructure] = useState([]);
  const [fetchUpdate, setFetchUpdate] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExcute, setExcute] = useState(false);
  const [output, setOutput] = useState('');
  const [quest, setQuest] = useState(null);
  const editRef = useRef(null);

  useEffect(() => {
    fetchQuest();
    fetchFolderStructure();
  }, [fetchUpdate]);

  async function fetchQuest() {
    try {
      const data = await getQueszt(team_id, quest_id);
      console.log(data);
      setQuest(data);
    } catch (error) {}
  }

  // 폴더 구조를 가져와서 트리 구조로 변환ab
  async function fetchFolderStructure() {
    try {
      const flatStructure = await getCodeList(team_id, quest_id, user_id);
      console.log(flatStructure.length);
      if (flatStructure.length == 0) {
        console.log('실행');
        return await handleAddFolder(null, 'root');
      }

      const nestedStructure = buildNestedStructure(flatStructure);
      setFolderStructure(nestedStructure);
    } catch (error) {
      console.error('폴더 구조를 가져오는 데 실패했습니다:', error);
    }
  }

  // 평면적인 폴더 구조를 계층 구조로 변환
  function buildNestedStructure(flatFolders) {
    const folderMap = {};
    const rootFolders = [];

    flatFolders.forEach((folder) => {
      folder.children = [];
      folderMap[folder.folder_id] = folder;
    });

    flatFolders.forEach((folder) => {
      if (folder.parent_id !== null && folderMap[folder.parent_id]) {
        folderMap[folder.parent_id].children.push(folder);
      } else {
        rootFolders.push(folder);
      }
    });

    return rootFolders;
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleEditorMount = (editor, monaco) => {
    editRef.current = editor;
  };

  // 코드 실행 함수
  const handleRunCode = async () => {
    if (!selectedFile || !editRef.current) return;
    const codeContext = editRef.current.getValue();
    try {
      const result = await runCode(codeContext, selectedFile.language);
      console.log(result);
      console.log(result.output);
      setOutput(result.output || '실행 오류!');
    } catch (error) {
      console.error('코드 실행 중 오류 발생:', error);
      setOutput('실행 오류!');
    }
    setFetchUpdate(!fetchUpdate);
  };
  // 폴더 추가 함수
  const handleAddFolder = async (parent_id, folder_name) => {
    try {
      const { status, folder_id } = await addFolder(
        team_id,
        quest_id,
        parent_id,
        folder_name
      );
      if (status === 200) {
        setFetchUpdate(!fetchUpdate);
      } else {
        console.error('폴더 추가 실패');
      }
    } catch (error) {
      console.error('폴더 추가 중 오류 발생:', error);
    }
  };

  // 파일 추가 함수
  const handleAddFile = async (folderId, file_name, language) => {
    try {
      const { status, file_id } = await addFile(
        team_id,
        quest_id,
        folderId,
        file_name,
        language
      );
      if (status === 200) {
        setFetchUpdate(!fetchUpdate);
      } else {
        console.error('파일 추가 실패');
      }
    } catch (error) {
      console.error('파일 추가 중 오류 발생:', error);
    }
  };
  const handleQuestState = async () => {
    try {
      const success = await updateQuestState(team_id, quest_id);
      console.log(success);
    } catch (error) {}
  };

  // 파일 내용 수정 함수
  const handleEditFile = async ({
    code_content = selectedFile.code,
    file_name = selectedFile.file_name,
    language = selectedFile.language,
  }) => {
    if (!selectedFile) return;
    if (language === 'java' && file_name.endsWith('.py')) {
      file_name = file_name.replace('.py', '.java');
    }
    if (language === 'python3' && file_name.endsWith('.java')) {
      file_name = file_name.replace('.java', '.py');
    }
    console.log(editRef.current);
    if (editRef.current) {
      code_content = editRef.current.getValue();
      language = editRef.current.getLanguage();
    }
    console.log(code_content, language);

    const { status } = await editFile(
      team_id,
      quest_id,
      selectedFolder,
      file_name,
      language,
      selectedFile.file_id,
      code_content
    );
    if (status === 200) {
      setFetchUpdate(!fetchUpdate);
    } else {
      console.error('파일 수정 실패');
    }
  };

  return (
    <div className='w-screen h-screen flex flex-col bg-code text-transparent2'>
      <div className='flex justify-between p-2'>
        <span className='text-2xl'>{quest?.quest_name}</span>
        <button
          className='bg-transparent1 p-2 rounded-lg text-white'
          onClick={handleQuestState}
        >
          완료
        </button>
      </div>

      <div className='flex flex-grow w-full '>
        <div className='min-w-[350px] h-full'>
          <FileExplorer
            folderStructure={folderStructure}
            onFileSelect={handleFileSelect}
            onFolderSelect={setSelectedFolder}
            onAddFile={handleAddFile}
            onAddFolder={handleAddFolder}
            selectedFile={selectedFile}
            selectedFolder={selectedFolder}
            onEditFile={handleEditFile}
          />
        </div>

        {selectedFile ? (
          <div className='flex flex-col flex-grow w-full'>
            <div className='flex-grow'>
              {/* CodeEditor가 남은 공간을 차지하도록 */}
              <CodeEditor
                selectedFile={selectedFile}
                onEditorMount={handleEditorMount}
                onRunCode={handleRunCode}
                onEditFile={handleEditFile}
                onExcuteFile={setExcute}
              />
            </div>
            {isExcute && (
              <OutputConsole
                folderStructure={folderStructure}
                selectedFile={selectedFile}
                output={output}
              />
            )}
          </div>
        ) : (
          <div className='flex items-center justify-center flex-grow text-white'>
            파일을 선택하세요.
          </div>
        )}
      </div>
    </div>
  );
}
