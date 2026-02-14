import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Announcements from "./pages/Announcements";
import Threads from "./pages/Threads";

import ThreadDetail from "./pages/ThreadDetail";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/announcements" element={<Announcements />} />
<Route path="/threads" element={<Threads />} />
<Route path="/threads/:id" element={<ThreadDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
