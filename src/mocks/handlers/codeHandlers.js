import { http, HttpResponse } from 'msw';
import { codeFiles } from '../data/codes';
import { quests } from '../data/quests';

let folderIdCounter = 1;
let fileIdCounter = 1;

export const codeHandlers = [
  // 코드 목록 조회
  http.get('/code/:teamId/:questId/:userId', ({ params }) => {
    const { teamId, questId, userId } = params;
    const key = `${teamId}-${questId}-${userId}`;
    const structure = codeFiles[key] || [];

    return HttpResponse.json(structure);
  }),

  // 코드 상태 변경 (퀘스트 완료 처리)
  http.patch('/code/:teamId/:questId/:userId/status', async ({ request }) => {
    const { teamId, questId, userId, questStatus } = await request.json();
    const quest = quests.find(
      (q) => q.teamId === teamId && q.questId === questId
    );
    if (!quest)
      return HttpResponse.json({ message: '퀘스트 없음' }, { status: 404 });

    const userStatus = quest.incompletedUser.find((u) => u.userId === userId);
    if (userStatus) {
      userStatus.isOncomplete = questStatus === 'COMPLETED';
    }

    return HttpResponse.json({ success: true });
  }),

  // 코드 실행 (mock 실행기)
  http.post('/code/run', async ({ request }) => {
    const { codeContext, language } = await request.json();
    // 임시 출력값 생성
    const fakeOutput = codeContext.includes('print')
      ? 'Hello\n' + language
      : 'No output';
    return HttpResponse.json({ output: fakeOutput });
  }),

  // 폴더 추가
  http.post(
    '/code/:teamId/:questId/:userId/folder',
    async ({ params, request }) => {
      const { teamId, questId, userId } = params;
      const { folderName } = await request.json();
      const key = `${teamId}-${questId}-${userId}`;

      const folder = { folderId: folderIdCounter++, folderName, files: [] };
      if (!codeFiles[key]) codeFiles[key] = [];
      codeFiles[key].push(folder);

      return HttpResponse.json({ folderId: folder.folderId });
    }
  ),

  // 파일 추가
  http.post(
    '/code/:teamId/:questId/:userId/file',
    async ({ params, request }) => {
      const { teamId, questId, userId } = params;
      const { folderId, fileName, language } = await request.json();
      const key = `${teamId}-${questId}-${userId}`;

      const newFile = {
        fileId: fileIdCounter++,
        fileName,
        language,
        code: '',
      };

      if (!codeFiles[key]) codeFiles[key] = [];

      if (folderId == null) {
        // 루트 파일
        const rootFolder = codeFiles[key].find((f) => f.folderId === null);
        if (rootFolder) {
          rootFolder.files.push(newFile);
        } else {
          codeFiles[key].push({
            folderId: null,
            folderName: null,
            files: [newFile],
          });
        }
      } else {
        const targetFolder = codeFiles[key].find(
          (f) => f.folderId === folderId
        );
        if (targetFolder) targetFolder.files.push(newFile);
      }

      return HttpResponse.json({ fileId: newFile.fileId });
    }
  ),

  // 코드 파일 편집
  http.put('/code/:teamId/:questId/:userId', async ({ params, request }) => {
    const { teamId, questId, userId } = params;
    const { folderId, fileId, codeContent } = await request.json();
    const key = `${teamId}-${questId}-${userId}`;

    const folder = codeFiles[key]?.find((f) => f.folderId === folderId);
    const file = folder?.files.find((f) => f.fileId === fileId);
    if (file) file.code = codeContent;

    return HttpResponse.json({ success: true });
  }),
];
