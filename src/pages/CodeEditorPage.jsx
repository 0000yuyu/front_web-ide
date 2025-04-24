import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  addFile,
  addFolder,
  getCodeList,
  runCode,
  editFile,
} from '@/utils/codeManage';
import CodeEditor from '@/components/CodeEidtor';
import FileExplorer from '@/components/FileExplorer';
import OutputConsole from '@/components/OutputConsole';
import { getQuest } from '@/utils/questDetailManage';

export default function CodeEditorPage() {
  const { team_id, quest_id, user_id } = useParams();
  const [folderStructure, setFolderStructure] = useState([]);
  const [fetchUpdate, setFetchUpdate] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExcute, setExcute] = useState(false);
  const [output, setOutput] = useState('');
  const [quest, setQuest] = useState(null);
  const [root_folder, setRootFolder] = useState({});
  const editRef = useRef(null);

  useEffect(() => {
    fetchQuest();
    fetchFolderStructure();
  }, [fetchUpdate]);

  async function fetchQuest() {
    try {
      const questData = await getQuest(team_id, quest_id);
      console.log(questData); // 가져온 데이터를 콘솔에 로그로 출력합니다.
      setQuest(questData); // 가져온 데이터를 상태에 저장합니다.
    } catch (error) {
      console.log(error); // 오류가 발생하면 콘솔에 로그로 출력합니다.
    }
  }
  // 폴더 구조를 가져와서 트리 구조로 변환
  async function fetchFolderStructure() {
    try {
      const flatStructure = await getCodeList(quest_id, user_id);
      const root_folder = flatStructure.find(
        (folder) => folder.folder_name == 'root-' + user_id
      );
      console.log(flatStructure);
      if (root_folder) {
        const nestedStructure = buildNestedStructure(flatStructure);
        setRootFolder(root_folder);
        setFolderStructure(nestedStructure);
      } else {
        const { folder_id } = await handleAddFolder(null, 'root-' + user_id);
        console.log(folder_id);
        await handleAddFile(folder_id, 'answer.py', 'python3');
      }
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
  const handleAddFolder = async (parent_id = null, folder_name) => {
    try {
      const response = await addFolder(
        team_id,
        quest_id,
        parent_id,
        folder_name
      );
      console.log(response);
      if (response.status === 200) {
        return response;
      } else {
        console.error('폴더 추가 실패');
      }
    } catch (error) {
      console.error('폴더 추가 중 오류 발생:', error);
    }
  };

  // 파일 추가 함수
  const handleAddFile = async (folderId, file_name, language) => {
    console.log(folderId, file_name, language);
    try {
      const { status } = await addFile(
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
      const success = await updateQuestState(team_id, quest_id, true);
      console.log(success);
    } catch (error) {}
  };

  // 파일 내용 수정 함수
  const handleEditFile = async ({
    code_context = selectedFile.code,
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
      code_context = editRef.current.getValue();
      language = editRef.current.getLanguage();
    }
    console.log(code_context, language);

    const { status } = await editFile(
      team_id,
      quest_id,
      selectedFolder,
      file_name,
      language,
      selectedFile.file_id,
      code_context
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
        <span className='text-xl'>문제 : {quest?.quest_name}</span>
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
            root_folder={root_folder}
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
