import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Announcements from "./pages/Announcements";
import Threads from "./pages/Threads";

import ThreadDetail from "./pages/ThreadDetail";
import Community from "./pages/Community";



import Dashboard from "./pages/Dashboard";

        import JoinCommunity from "./pages/JoinCommunity";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

<Route path="/join/:inviteCode" element={<JoinCommunity />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<Community />} />
<Route path="/community" element={<Community />} />

        <Route path="/announcements" element={<Announcements />} />
<Route path="/threads" element={<Threads />} />
<Route path="/threads/:id" element={<ThreadDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
