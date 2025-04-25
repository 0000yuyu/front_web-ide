import React, { useEffect, useState } from 'react';

function FolderTreeView({
  folderStructure,
  expandedFolders,
  selectedFileId,
  onToggleFolder,
  onFileSelect,
  onFolderSelect,
  getChildrenForFolder,
  onEditFile,
  onFolderSave,
  onFileSave,
}) {
  const [renderFolderStructure, setRenderFolderStructure] = useState([]);

  useEffect(() => {
    setRenderFolderStructure(buildNestedStructure(folderStructure));
  }, [folderStructure]);
  function buildNestedStructure(flat_folders) {
    const folder_map = {};
    const root_folders = [];

    folderStructure.forEach((folder) => {
      folder.children = [];
      folder_map[folder.folder_id] = folder;
    });

    flat_folders.forEach((folder) => {
      if (folder.parent_id !== null && folder_map[folder.parent_id]) {
        folder_map[folder.parent_id].children.push(folder);
      } else {
        root_folders.push(folder);
      }
    });

    return root_folders;
  }
  const renderFolder = (folder, depth = 0) => {
    const isExpanded = expandedFolders[folder.folder_id];

    return (
      <div key={folder.folder_id} style={{ marginLeft: depth * 16 }}>
        {folder.folder_id != -1 && (
          <div
            className='flex gap-2 p-2 items-center cursor-pointer w-full'
            onClick={() => {
              console.log('선택됨');
              onToggleFolder(folder.folder_id);
              onFolderSelect(folder);
              onFileSelect(null);
            }}
          >
            <svg
              className={`w-4 h-4 transition-transform ${
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
            <div className='flex justify-between w-full'>
              <span>{folder.folder_name || '루트'}</span>

              {folder.is_temp && (
                <div className='flex gap-2'>
                  <div className='bg-transparent2  text-black px-2  rounded-lg text-center'>
                    unsaved : {folder.files?.length}
                  </div>
                  <button
                    className='border rounded-md px-2'
                    onClick={() => onFolderSave(folder)}
                  >
                    저장
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {(folder.folder_id == -1 || isExpanded) && (
          <>
            {folder.files?.map((file) => (
              <div
                key={file.file_id}
                className={`cursor-pointer pl-10 pr-5 p-1 flex justify-between ${
                  file.file_id === selectedFileId
                    ? 'bg-transparent3 rounded-md'
                    : ''
                } ${folder.folder_id == -1 && 'pl-5'}`}
                onClick={() => {
                  console.log('선택됨 - 일반');
                  onFolderSelect(folder);
                  onFileSelect(file);
                }}
              >
                <span>{file.file_name}</span>
                {!folder.is_temp && file.is_temp && (
                  <button
                    className='border rounded-md px-2'
                    onClick={() => {
                      onFileSave(file);
                      file.is_temp = false;
                    }}
                  >
                    저장
                  </button>
                )}
              </div>
            ))}
            {folder.children?.map((child) => renderFolder(child, depth + 1))}
            {getChildrenForFolder && getChildrenForFolder(folder)}
          </>
        )}
      </div>
    );
  };

  return <>{renderFolderStructure.map((folder) => renderFolder(folder))}</>;
}

export default FolderTreeView;
