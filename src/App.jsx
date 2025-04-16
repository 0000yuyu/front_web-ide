import { Routes, Route, Link, Outlet } from 'react-router-dom';
import AuthTestPage from './pages/AuthTestPage';
import TeamTestPage from './pages/TeamTestPage';
import QuestTestPage from './pages/QuestTestPage';
import CodeTestPage from './pages/CodeTestPage';
import UserTestPage from './pages/UserTestPage';
import QuestPage from './pages/QuestPage';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<AppLayout />}>
        {/* 기본 페이지 구성한거 넣으시면 돼요! */}
      </Route>

      {/* api 테스트 확인하세요 */}
      <Route path='/test' element={<TestPageLayout />}>
        <Route path='auth' element={<AuthTestPage />} />
        <Route path='team' element={<TeamTestPage />} />
        <Route path='quest' element={<QuestTestPage />} />
        <Route path='code' element={<CodeTestPage />} />
        <Route path='user' element={<UserTestPage />} />
      </Route>

      {/* 지윤 */}
      <Route path='quest2' element={<QuestPageLayout />}>
        <Route index element={<QuestPage />} />
      </Route>
    </Routes>
  );
}
function AppLayout() {
  return (
    <div>
      {/* 여기 위에 링크 하나씩 추가하고 테스트 하면 됩니다! */}
      <ui className='list-disc pl-5'>
      <li>  
      <Link to={'test'}>api 테스트 하러가기</Link>
      </li>
      {/*지윤*/}
      <li>  
      <Link to={'quest2'}>questPage TestPage 이동</Link>
      </li>
      <li>
      <Outlet></Outlet>
      </li>
      </ui>
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
//지윤 
function QuestPageLayout() {
  return (
    <div>
      <Link to={'../'}>메인으로 이동</Link>
      <Outlet />
    </div>  
  );
}