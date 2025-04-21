import { Routes, Route, Link, Outlet } from 'react-router-dom';
import AuthTestPage from './pages/test/AuthTestPage';
import TeamTestPage from './pages/test/TeamTestPage';
import QuestTestPage from './pages/test/QuestTestPage';
import CodeTestPage from './pages/test/CodeTestPage';
import UserTestPage from './pages/test/UserTestPage';

import IntroPage from './pages/IntroPage';
import GroupPage from './pages/GroupPage';
import QuestPage from './pages/QuestPage';
import TeamPage from './pages/TeamPage';
import Header from './components/Header';
import { isLoggedIn } from './utils/auth';
import LoginPage from './pages/LoginPage';
import FindIdPage from './pages/FindIdPage';
import FindPasswordPage from './pages/FindPasswordPage';
import MembershipPage from './pages/MembershipPage';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<AppLayout />}>
        <Route index element={<IndexPage />} />
        <Route
          path='intro'
          element={isLoggedIn() ? <GroupPage /> : <IntroPage />}
        />
        <Route path='group' element={<GroupPage />} />
        <Route path='quest' element={<QuestPage />} />
        <Route path='team' element={<TeamPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='membership' element={<MembershipPage />} />
        <Route path='find-id' element={<FindIdPage />} />
        <Route path='find-password' element={<FindPasswordPage />} />
      </Route>

      {/* api 테스트 확인하세요 */}
      <Route path='/test' element={<TestPageLayout />}>
        <Route path='auth' element={<AuthTestPage />} />
        <Route path='team' element={<TeamTestPage />} />
        <Route path='quest' element={<QuestTestPage />} />
        <Route path='code' element={<CodeTestPage />} />
        <Route path='user' element={<UserTestPage />} />
      </Route>
    </Routes>
  );
}
function AppLayout() {
  return (
    <div>
      <Header />
      <Outlet></Outlet>
    </div>
  );
}
function IndexPage() {
  return (
    <div className='flex flex-col p-2'>
      <Link to={'intro'}>intro</Link>
      <Link to={'group'}>group</Link>
      <Link to={'quest'}>quest</Link>
      <Link to={'team'}>team</Link>
      <Link to={'test'}>api 테스트 하러가기</Link>
    </div>
  );
}
function TestPageLayout() {
  return (
    <div>
      <Link to={'../'}>메인으로 이동</Link>
      <ul className='list-disc pl-5'>
        <li>
          <Link to={'auth'}>Auth TestPage 이동</Link>
        </li>
        <li>
          <Link to={'team'}>TeamTestPage 이동</Link>
        </li>
        <li>
          <Link to={'quest'}>QuestTestPage 이동</Link>
        </li>
        <li>
          <Link to={'code'}>Code TestPage 이동</Link>
        </li>
        <li>
          <Link to={'user'}>User TestPage 이동</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
