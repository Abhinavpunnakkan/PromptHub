import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import PromptPage from "./pages/PromptPage";
import Search from "./pages/Search";
import SavedPrompts from "./pages/Saved";
import Landing from "./pages/Landing";

import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/auth";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/search" element={<Search />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/saved" element={<SavedPrompts />} />
        <Route
          path="*"
          element={<div className="text-center mt-20 text-gray-500">404 – Page Not Found</div>}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/prompt/:id" element={<PromptPage />} />
      </Routes>
    </>
  );
}

export default App;
