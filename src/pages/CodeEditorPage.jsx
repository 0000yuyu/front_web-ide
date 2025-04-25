import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  editFile,
  getCodeList,
  addFolder,
  addFile,
  runCode,
  accessCode,
} from '@/utils/codeManage';
import CodeEditor from '@/components/CodeEidtor';
import FileExplorer from '@/components/FileExplorer';
import OutputConsole from '@/components/OutputConsole';
import { getQuest } from '@/utils/questDetailManage';

export default function CodeEditorPage() {
  const { team_id, quest_id, user_id } = useParams();
  const [root_folder, set_root_folder] = useState(null);
  const [folder_structure, set_folder_structure] = useState([]);
  const [fetch_update, set_fetch_update] = useState(false);
  const [selected_folder, set_selected_folder] = useState(null);
  const [selected_file, set_selected_file] = useState(null);
  const [is_execute, set_execute] = useState(false);
  const [output, set_output] = useState('');
  const [quest, set_quest] = useState(null);
  const edit_ref = useRef(null);
  const [accessible, set_accessible] = useState(false);

  const [pending_structures, set_pending_structures] = useState([]);

  const generate_temp_id = () => `${user_id}-${Date.now()}`;

  useEffect(() => {
    fetch_quest();
    fetch_folder_structure();
  }, [fetch_update]);

  useEffect(() => {
    console.log(folder_structure, pending_structures);
  }, [folder_structure, pending_structures]);

  useEffect(() => {
    const fetch_access = async () => {
      try {
        const accessible = await accessCode(team_id, quest_id, user_id);
        set_accessible(accessible);
      } catch (error) {
        console.log(error);
      }
    };
    fetch_access();
  });

  async function fetch_quest() {
    try {
      const quest_data = await getQuest(team_id, quest_id);
      set_quest(quest_data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetch_folder_structure() {
    try {
      const folders = await getCodeList(quest_id, user_id);
      if (!folders.length) {
        await handleFileSave({
          team_id,
          quest_id,
          file_name: 'answer.py',
          language: 'python3',
          folder_id: null,
        });
        return;
      }

      const root = folders.find((folder) => folder.folder_id == -1);
      set_root_folder(root);
      set_folder_structure(folders);
      console.log(folders);
    } catch (error) {
      console.error('폴더 구조를 가져오는 데 실패했습니다:', error);
    }
  }

  const handle_file_select = (file) => {
    set_selected_file(file);
  };

  const handle_editor_mount = (editor) => {
    edit_ref.current = editor;
  };

  const handle_run_code = async () => {
    if (!selected_file || !edit_ref.current) return;
    const code_context = edit_ref.current.getValue();
    try {
      const result = await runCode(code_context, selected_file.language);
      set_output(result.output || '실행 오류!');
    } catch (error) {
      console.error('코드 실행 중 오류 발생:', error);
      set_output('실행 오류!');
    }
    set_fetch_update(!fetch_update);
  };

  const handle_add_folder = async (parent_id = null, folder_name) => {
    console.log('폴더추가 실행 임시');
    const temp_id = generate_temp_id();

    const new_folder = {
      team_id,
      quest_id,
      folder_id: temp_id,
      parent_id,
      folder_name,
      files: [],
      is_temp: true,
    };
    console.log(new_folder);
    set_pending_structures((prev) => [...prev, new_folder]);
    set_folder_structure((prev) => [...prev, new_folder]);
  };

  const handle_add_file = async (folder_id, file_name, language) => {
    const temp_id = generate_temp_id();
    console.log('파일 추가 실행 임시' + temp_id);
    const new_file = {
      team_id,
      quest_id,
      file_id: temp_id,
      file_name,
      language,
      folder_id,
      is_temp: true,
      code_context: null,
    };

    set_pending_structures((prev) => {
      const updated_structure = [...prev];
      const index = updated_structure.findIndex(
        (f) => f.folder_id === folder_id
      );
      if (index !== -1) {
        const folder = updated_structure[index];
        const updated_folder = {
          ...folder,
          files: [...folder.files, new_file],
        };
        updated_structure[index] = updated_folder; // 이게 중요!!
      }
      return updated_structure;
    });
    set_folder_structure((prev) => {
      const updated_structure = [...prev];
      const folder = updated_structure.find((f) => f.folder_id === folder_id);
      if (folder) {
        folder.files.push(new_file);
      }
      return updated_structure;
    });
  };
  const handleAllSave = async () => {
    console.log('클릭완룐');
    for (const folder of folder_structure)
      if (folder.is_temp) await addFolder(folder);
      else {
        for (const file of folder.files) {
          if (file.is_temp) await addFile(file);
        }
      }
    set_pending_structures([]);
  };

  // 임시로 저장된거 서버로 전송해야 될 때 -> 완료 버튼 누르면
  const handleFolderSave = async (folder) => {
    try {
      console.log('폴더 추가', folder);
      const { folder_id } = await addFolder(folder);

      for (const file of folder.files) {
        await handleFileSave({ ...file, folder_id: folder_id });
      }
    } catch (error) {
      console.log(error);
    }
    set_folder_structure([]);
    set_fetch_update(!fetch_update);
  };
  const handleFileSave = async (file) => {
    console.log('파일 추가', file);

    try {
      await addFile(file);
    } catch (error) {
      console.log(error);
    }
  };
  const getCustomLanguageId = () => {
    const model = edit_ref.current?.getModel();
    const monacoLang = model ? model.getLanguageId() : 'unknown';

    console.log(monacoLang);

    // Monaco에서 받아온 언어 ID → 시스템에 맞게 변환
    const langMap = {
      python: 'python3',
      java: 'java',
    };

    return langMap[monacoLang] || monacoLang;
  };

  const handle_edit_file = async ({
    code_context = selected_file?.code_context ?? '',
    file_name = selected_file?.file_name ?? '',
    language = selected_file?.language ?? 'python3',
  } = {}) => {
    if (selected_file.is_temp) {
      alert('파일 먼저 저장해주세요!');
      return;
    }
    if (!selected_file) return;
    //  경로명에 없는 경우 추가
    if (language === 'java' && !file_name.endsWith('.java')) {
      file_name = file_name + '.java';
    }
    if (language === 'python3' && !file_name.endsWith('.py')) {
      file_name = file_name + '.py';
    }
    if (edit_ref.current) {
      code_context = edit_ref.current.getValue();
      language = getCustomLanguageId();
    }
    console.log(selected_folder);

    const { status } = await editFile({
      team_id,
      quest_id,
      folder_id:
        selected_folder.folder_id == -1 ? null : selected_folder.folder_id,
      file_name,
      language,
      file_id: selected_file.file_id,
      code_context,
    });
    if (status === 200) {
      set_fetch_update(!fetch_update);
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
          onClick={handleAllSave}
        >
          완료
        </button>
      </div>
      <div className='flex w-full h-full'>
        <div className='flex w-[350px] overflow-y-auto'>
          <FileExplorer
            onFolderSave={handleFolderSave}
            onFileSave={handleFileSave}
            root_folder={root_folder}
            folderStructure={folder_structure}
            onFileSelect={handle_file_select}
            onFolderSelect={set_selected_folder}
            onAddFile={handle_add_file}
            onAddFolder={handle_add_folder}
            selectedFile={selected_file}
            selectedFolder={selected_folder}
            onEditFile={handle_edit_file}
            accessible={accessible}
          />
        </div>

        {selected_file ? (
          <div className='flex-col flex-1 min-w-0 overflow-hidden'>
            <CodeEditor
              selectedFile={selected_file}
              onEditorMount={handle_editor_mount}
              onRunCode={handle_run_code}
              onEditFile={handle_edit_file}
              onExcuteFile={set_execute}
              accessible={accessible}
            />
            {is_execute && (
              <OutputConsole
                folderStructure={folder_structure}
                selectedFile={selected_file}
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
