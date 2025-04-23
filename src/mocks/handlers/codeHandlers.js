import { http, HttpResponse } from 'msw';
import { quests } from '../data/quests';

let folder_id_counter = 1000;
let file_id_counter = 1000;

const getCodeFiles = () => {
  return JSON.parse(localStorage.getItem('code_files') || '{}') || {};
};

const setCodeFiles = (list) => {
  return localStorage.setItem('code_files', JSON.stringify(list, null, 2));
};

export const codeHandlers = [
  // 코드 목록 조회
  http.get('/code/:team_id/:quest_id/:user_id', ({ params }) => {
    const code_files = getCodeFiles();
    const { team_id, quest_id, user_id } = params;
    const key = `${team_id}-${quest_id}-${user_id}`;
    const structure = code_files[key] || [];

    return HttpResponse.json(structure);
  }),

  // 코드 상태 변경 (퀘스트 완료 처리)
  http.patch('/code/status', async ({ request }) => {
    const { team_id, quest_id, quest_status } = await request.json();
    console.log(team_id, quest_id, quest_status);
    const user_id = localStorage.getItem('id');
    const quest = quests.find(
      (q) => q.team_id == team_id && q.quest_id == quest_id
    );
    if (!quest)
      return HttpResponse.json({ message: '퀘스트 없음' }, { status: 404 });

    const userQuest = quest.quest_user_list.find(
      (user) => user.user_id == user_id
    );
    if (userQuest) userQuest.status = quest_status;
    return HttpResponse.json({ success: true });
  }),

  // 코드 실행 (mock 실행기)
  http.post('/code/run', async ({ request }) => {
    const { code_context, language } = await request.json();
    const fake_output = code_context.includes('print')
      ? 'Hello ' + language
      : 'hi  ' + language;
    return HttpResponse.json({ output: fake_output });
  }),

  // 폴더 추가
  http.post('/code/folder', async ({ request }) => {
    const { team_id, quest_id, parent_id, folder_name } = await request.json();
    const user_id = localStorage.getItem('id');
    const key = `${team_id}-${quest_id}-${user_id}`;

    const code_files = getCodeFiles();

    const folder = {
      folder_id: folder_id_counter++,
      parent_id: parent_id ?? null,
      folder_name,
      files: [],
    };

    if (!code_files[key]) code_files[key] = [];
    code_files[key].push(folder);
    console.log(code_files);

    setCodeFiles(code_files);
    localStorage.setItem('test', JSON.stringify(['2']));
    console.log(code_files);
    localStorage.setItem('code_files', JSON.stringify(code_files));
    return HttpResponse.json({ folder_id: folder.folder_id });
  }),

  // 파일 추가
  http.post('/code/file', async ({ request }) => {
    const { team_id, quest_id, folder_id, language, file_name } =
      await request.json();
    const user_id = localStorage.getItem('id');
    const key = `${team_id}-${quest_id}-${user_id}`;
    const code_files = getCodeFiles();

    const new_file = {
      file_id: file_id_counter++,
      file_name,
      language,
      code: '',
    };
    console.log(file_id_counter);

    if (!code_files[key]) code_files[key] = [];

    let folder = code_files[key].find((f) => f.folder_id === folder_id);

    // fallback to a default folder if not found
    if (!folder) {
      folder = {
        folder_id,
        parent_id: null,
        folder_name: 'Untitled',
        files: [],
      };
      code_files[key].push(folder);
    }
    folder.files.push(new_file);
    setCodeFiles(code_files);

    return HttpResponse.json({ file_id: new_file.file_id });
  }),

  // 코드 파일 편집
  http.put('/code', async ({ request }) => {
    const {
      team_id,
      quest_id,
      folder_id,
      file_name,
      file_id,
      code_content,
      language,
    } = await request.json();
    const user_id = localStorage.getItem('id');
    const code_files = getCodeFiles();
    const key = `${team_id}-${quest_id}-${user_id}`;
    console.log(code_files);
    console.log(code_files[key]);
    console.log(folder_id);

    const folder = code_files[key]?.find((f) => f.folder_id === folder_id);
    console.log(folder);
    const file = folder?.files.find((f) => f.file_id === file_id);

    if (file) {
      file.file_name = file_name;
      file.code = code_content;
      file.language = language;
    }
    console.log(file);
    setCodeFiles(code_files);

    return HttpResponse.json({ success: true });
  }),
];
