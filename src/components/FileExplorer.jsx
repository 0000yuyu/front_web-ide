import React, { useEffect, useState } from 'react';
import { FaCheck, FaFileMedical, FaFileMedicalAlt } from 'react-icons/fa';
import { FaFolderPlus } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

function FileExplorer({
  folderStructure,
  onFileSelect,
  onFolderSelect,
  onAddFile,
  onAddFolder,
  selectedFile,
  selectedFolder,
  onEditFile,
}) {
  const [expandedFolders, setExpandedFolders] = useState({});
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [addFile, setAddFile] = useState(false);
  const [addFolder, setAddFolder] = useState(false);
  const [editFile, setEditFile] = useState(false);

  useEffect(() => {
    setAddFile(false);
    setEditFile(false);
    setAddFolder(false);
  }, [selectedFile, selectedFolder]);

  const toggleFolder = (folderId) => {
    if (expandedFolders[folderId]) onFolderSelect(0);
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleAddFileClick = () => {
    if (newFileName != '') {
      if (newFileName.endsWith('.py'))
        onAddFile(selectedFolder, newFileName, 'python3');
      else if (newFileName.endsWith('.java'))
        onAddFile(selectedFolder, newFileName, 'java');
      else {
        alert('py나 java로 끝나는 파일명을 입력하세요.');
        return;
      }
    }
    setNewFileName('');
    setAddFile(false);
  };

  const handleAddFolderClick = () => {
    if (newFolderName != '') {
      onAddFolder(selectedFolder ?? 0, newFolderName);
    }
    setNewFolderName('');
    setAddFolder(false);
  };
  const handleEditFile = () => {
    if (newFileName != '') {
      if (newFileName.endsWith('.py'))
        onEditFile({ file_name: newFileName, language: 'python3' });
      else if (newFileName.endsWith('.java'))
        onEditFile({ file_name: newFileName, language: 'java' });
      else {
        alert('py나 java로 끝나는 파일명을 입력하세요.');
        return;
      }
    }
    setNewFileName('');
    editFile(false);
  };

  const renderFolder = (folder, depth = 0) => {
    const folderId = folder.folder_id ?? 0;
    const isExpanded = expandedFolders[folderId];

    return (
      <div
        key={folderId}
        className={folderId == selectedFolder && 'p-2'}
        style={{ marginLeft: depth * 16 }}
      >
        <div
          className={`flex gap-2 p-2 items-center cursor-pointer`}
          onClick={() => {
            toggleFolder(folderId);
            onFolderSelect(folderId);
          }}
        >
          {folderId != 0 && (
            <div className='flex w-full items-center justify-between'>
              <div className='flex justify-center items-center'>
                <svg
                  className={` w-4 h-4 transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                  fill='none'
                  stroke='#ABB2BF'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 5l7 7-7 7'
                  />
                </svg>
                <span>{folder.folder_name || '루트'}</span>
              </div>
              <div className='flex gap-2'>
                <button className='z-10' onClick={() => setAddFile(true)}>
                  <FaFileMedical />
                </button>
                <button onClick={() => setAddFolder(true)}>
                  <FaFolderPlus />
                </button>
              </div>
            </div>
          )}
        </div>

        {(folder.folder_id == 0 || isExpanded) && (
          <>
            {/* 파일들 */}
            {folder.files?.map((file) => (
              <div
                key={file.file_id}
                className={`cursor-pointer flex flex-col gap-2 w-full pl-10 p-2 items-start
                  ${folder.folder_id == 0 && 'pl-5'} 
                  ${
                    file.file_id === (selectedFile && selectedFile.file_id)
                      ? 'font-semibold bg-transparent3 rounded-md'
                      : ''
                  }`}
                onClick={() => onFileSelect(file)}
              >
                <div className='flex w-full gap-2 justify-between'>
                  <span className='flex outline-none items-start'>
                    {file.file_name}
                  </span>
                  <button
                    onClick={() => {
                      setEditFile(true);
                      setNewFileName('');
                    }}
                  >
                    수정
                  </button>
                </div>
                {editFile && selectedFile.file_id == file.file_id && (
                  <div className='flex items-center justify-center gap-2'>
                    <input
                      type='text'
                      placeholder='변경할 파일 이름'
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className='h-[20px] w-[100px] p-2 rounded-md'
                    />
                    <button className='z-10 flex' onClick={handleEditFile}>
                      <FaCheck />
                    </button>
                    <button onClick={() => setAddFolder(false)}>x</button>
                  </div>
                )}
              </div>
            ))}

            {/* 자식 폴더 재귀 렌더링 */}
            {folder.children?.map((child) => renderFolder(child, depth + 1))}

            {/* 새 파일 추가 */}
            <div className='mt-2 ml-6 flex items-center'>
              {addFile && !editFile && selectedFolder == folderId && (
                <div>
                  <input
                    type='text'
                    placeholder='새 파일 이름'
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className='border rounded mr-2 p-1 text-sm bg-[#3B4048] text-[#ABB2BF] border-[#383E4A]'
                  />
                  <button onClick={handleAddFileClick}>
                    <FaCheck />
                  </button>
                  <button onClick={() => setAddFile(false)}>
                    <MdClose />
                  </button>
                </div>
              )}
            </div>

            {/* 새 폴더 추가 */}
            <div className='mt-2 ml-6 flex items-center'>
              {addFolder && selectedFolder == folderId && (
                <div>
                  <input
                    type='text'
                    placeholder='새 폴더 이름'
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className='border rounded mr-2 p-1 text-sm bg-[#3B4048] text-[#ABB2BF] border-[#383E4A]'
                  />
                  <button onClick={handleAddFolderClick}>확인</button>
                  <button onClick={() => setAddFolder(false)}>취소</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className='flex min-w-[350px] h-full overflow-y-scroll  flex-col p-4 border-r bg-code text-transparent2'>
      <div className='flex justify-between'>
        <h2 className='text-lg font-semibold mb-2'>내 파일</h2>
        <div className='flex gap-2'>
          <button
            className='z-10'
            onClick={() => {
              setAddFile(true);
              onFolderSelect(0);
            }}
          >
            <FaFileMedical />
          </button>
          <button
            className='z-10'
            onClick={() => {
              setAddFolder(true);
              onFolderSelect(0);
            }}
          >
            <FaFolderPlus />
          </button>
        </div>
      </div>
      {folderStructure.map((folder) => renderFolder(folder))}
    </div>
  );
}

export default FileExplorer;
