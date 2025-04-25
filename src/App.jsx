import { Routes, Route, Link, Outlet, Navigate } from "react-router-dom";
import AuthTestPage from "./pages/test/AuthTestPage";
import TeamTestPage from "./pages/test/TeamTestPage";
import QuestTestPage from "./pages/test/QuestTestPage";
import CodeTestPage from "./pages/test/CodeTestPage";
import UserTestPage from "./pages/test/UserTestPage";

import IntroPage from "./pages/IntroPage";
import Header from "./components/Header";
import { isLoggedIn, removeToken } from "./utils/auth";
import LoginPage from "./pages/LoginPage";
import FindIdPage from "./pages/FindIdPage";
import FindPasswordPage from "./pages/FindPasswordPage";
import MembershipPage from "./pages/MembershipPage";
import { userDataStore } from "./store/userDataStore";
import CodeEditorPage from "./pages/CodeEditorPage";
import TeamListPage from "./pages/TeamListPage";
import TeamMainPage from "./pages/TeamMainPage";
import QuestPage from "./pages/QuestPage";
import SideBar from "./components/SideBar";

export default function App() {
  const { team_id } = userDataStore();
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route
          index
          element={
            isLoggedIn() ? (
              <Navigate to={`/team/${team_id}`} replace />
            ) : (
              <IntroPage />
            )
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="membership" element={<MembershipPage />} />
        <Route path="find-id" element={<FindIdPage />} />
        <Route path="find-password" element={<FindPasswordPage />} />
        <Route path="intro" element={<IntroPage />} />
        <Route path="groups" element={<TeamListPage />} />
        <Route path="team/:team_id" element={<TeamMainPage />} />
        <Route path="quest/:team_id/:quest_id" element={<QuestPage />} />
        <Route
          path="code/:team_id/:quest_id/:user_id"
          element={<CodeEditorPage />}
        />
      </Route>

      {/* api 테스트 확인하세요 */}
      <Route path="/test" element={<TestPageLayout />}>
        <Route path="auth" element={<AuthTestPage />} />
        <Route path="teams" element={<TeamTestPage />} />
        <Route path="quest" element={<QuestTestPage />} />
        <Route path="code" element={<CodeTestPage />} />
        <Route path="user" element={<UserTestPage />} />
      </Route>
    </Routes>
  );
}
function AppLayout() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <Header />
      <Outlet></Outlet>
    </div>
  );
}
function IndexPage() {
  return (
    <div className="flex flex-col p-2">
      <Link to={"intro"}>intro</Link>
      <Link to={"groups"}>group</Link>
      <Link to={"team"}>team</Link>
      <Link to={"test"}>api 테스트 하러가기</Link>
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
          <Link to={"teams"}>TeamTestPage 이동</Link>
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
