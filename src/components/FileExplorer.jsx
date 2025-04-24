import React, { useEffect, useState } from 'react';
import { FaCheck, FaFileMedical } from 'react-icons/fa';
import { FaFolderPlus } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import FolderTreeView from './FolderTreeView';

function FileExplorer({
  root_folder,
  folderStructure,
  onFileSelect,
  onFolderSelect,
  onAddFile,
  onAddFolder,
  selectedFile,
  selectedFolder,
  onFolderSave,
  onFileSave,
  accessible,
}) {
  const [expandedFolders, setExpandedFolders] = useState({});
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [addFile, setAddFile] = useState(false);
  const [addFolder, setAddFolder] = useState(false);

  useEffect(() => {
    setAddFile(false);
    setAddFolder(false);
  }, [selectedFolder, selectedFolder]);

  const handleAddFileClick = () => {
    if (newFileName.endsWith('.py'))
      onAddFile(selectedFolder.folder_id, newFileName, 'python3');
    else if (newFileName.endsWith('.java'))
      onAddFile(selectedFolder.folder_id, newFileName, 'java');
    else {
      alert('py나 java로 끝나는 파일명을 입력하세요.');
      return;
    }
    setNewFileName('');
    setAddFile(false);
  };

  const handleAddFolderClick = () => {
    if (newFolderName !== '') {
      onAddFolder(selectedFolder.folder_id ?? null, newFolderName);
      setNewFolderName('');
      setAddFolder(false);
    }
  };

  return (
    <div
      className='flex flex-col min-w-[350px] p-4 bg-code border-r h-full cursor-pointer 
    overflow-y-auto text-transparent2'
      onClick={(e) => {
        if (e.target == e.currentTarget) onFolderSelect(root_folder);
      }}
    >
      <div className='flex justify-between'>
        <h2 className='text-lg font-semibold'>내 파일</h2>
        <div className='flex gap-2'>
          <button
            className='w-[30px]'
            onClick={(e) => {
              console.log('클릭함');
              e.stopPropagation();
              if (accessible) setAddFile(true);
            }}
          >
            <FaFileMedical size={20} />
          </button>
          <button
            className='w-[30px]'
            onClick={(e) => {
              e.stopPropagation();
              if (accessible) setAddFolder(true);
            }}
          >
            <FaFolderPlus size={20} />
          </button>
        </div>
      </div>

      <FolderTreeView
        onFolderSave={onFolderSave}
        onFileSave={onFileSave}
        folderStructure={folderStructure}
        expandedFolders={expandedFolders}
        selectedFileId={selectedFile?.file_id}
        selectedFolderId={selectedFolder?.folder_id}
        onToggleFolder={(id) =>
          setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }))
        }
        onFileSelect={onFileSelect}
        onFolderSelect={onFolderSelect}
        getChildrenForFolder={(folder) => {
          return (
            <>
              {addFile && selectedFolder?.folder_id === folder.folder_id && (
                <div className='flex items-center mt-2 ml-6'>
                  <input
                    type='text'
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder='새 파일 이름'
                    className='p-1 mr-2 bg-[#3B4048] text-[#ABB2BF] border border-[#383E4A] rounded text-sm'
                  />
                  <button onClick={handleAddFileClick}>
                    <FaCheck />
                  </button>
                  <button onClick={() => setAddFile(false)}>
                    <MdClose />
                  </button>
                </div>
              )}
              {addFolder && selectedFolder?.folder_id === folder.folder_id && (
                <div className='flex items-center mt-2 ml-6'>
                  <input
                    type='text'
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder='새 폴더 이름'
                    className='p-1 mr-2 bg-[#3B4048] text-[#ABB2BF] border border-[#383E4A] rounded text-sm'
                  />
                  <button onClick={handleAddFolderClick}>확인</button>
                  <button onClick={() => setAddFolder(false)}>취소</button>
                </div>
              )}
            </>
          );
        }}
      />
    </div>
  );
}

export default FileExplorer;
