import { Routes, Route, Link, Outlet } from "react-router-dom";
import AuthTestPage from "./pages/AuthTestPage";
import TeamTestPage from "./pages/TeamTestPage";
import QuestTestPage from "./pages/QuestTestPage";
import CodeTestPage from "./pages/CodeTestPage";
import UserTestPage from "./pages/UserTestPage";
import QuestPage from "./pages/QuestPage";
import TeamPage from "./pages/TeamPage";
import GroupPage from "./pages/GroupPage";
import IntroPage from "./pages/IntroPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* 기본 페이지 구성한거 넣으시면 돼요! */}
      </Route>

      {/* api 테스트 확인하세요 */}
      <Route path="/test" element={<TestPageLayout />}>
        <Route path="auth" element={<AuthTestPage />} />
        <Route path="team" element={<TeamTestPage />} />
        <Route path="quest" element={<QuestTestPage />} />
        <Route path="code" element={<CodeTestPage />} />
        <Route path="user" element={<UserTestPage />} />
      </Route>

      <Route path="quest2" element={<QuestPageLayout />}>
        <Route index element={<QuestPage />} />
      </Route>

      <Route path="team2" element={<TeamPageLayout />}>
        <Route index element={<TeamPage />} />
      </Route>

      <Route path="group" element={<GroupPageLayout />}>
        <Route index element={<GroupPage />} />
      </Route>

      <Route path="Intro" element={<IntroPageLayout />}>
        <Route index element={<IntroPage />} />
      </Route>
    </Routes>
  );
}
function AppLayout() {
  return (
    <div>
      {/* 여기 위에 링크 하나씩 추가하고 테스트 하면 됩니다! */}
      <ul>
        <li>
          <Link to={"test"}>api 테스트 하러가기</Link>
        </li>
        <li>
          <Link to={"quest2"}>questPage 이동</Link>
        </li>
        <li>
          <Link to={"team2"}>teamPage 이동</Link>
        </li>
        <li>
          <Link to={"group"}>GroupPage 이동</Link>
        </li>
        <li>
          <Link to={"Intro"}>IntroPage 이동</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}
function TestPageLayout() {
  return (
    <div>
      <Link to={"../"}>메인으로 이동</Link>
      <ul className="list-disc pl-5">
        <li>
          <Link to={"auth"}>Auth TestPage 이동</Link>
        </li>
        <li>
          <Link to={"team"}>TeamTestPage 이동</Link>
        </li>
        <li>
          <Link to={"quest"}>QuestTestPage 이동</Link>
        </li>
        <li>
          <Link to={"code"}>Code TestPage 이동</Link>
        </li>
        <li>
          <Link to={"user"}>User TestPage 이동</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

function QuestPageLayout() {
  return (
    <div>
      <Link to={"../"}>메인으로 이동</Link>
      <Outlet />
    </div>
  );
}
function TeamPageLayout() {
  return (
    <div>
      <Link to={"../"}>메인으로 이동</Link>
      <Outlet />
    </div>
  );
}
function GroupPageLayout() {
  return (
    <div>
      <Link to={"../"}>메인으로 이동</Link>
      <Outlet />
    </div>
  );
}
function IntroPageLayout() {
  return (
    <div>
      <Link to={"../"}>메인으로 이동</Link>
      <Outlet />
    </div>
  );
}
