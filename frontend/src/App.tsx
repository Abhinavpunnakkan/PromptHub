import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Navbar from "./components/Navbar";
import SignInPage from "./pages/SignInPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route
          path="*"
          element={<div className="text-center mt-20 text-gray-500">404 – Page Not Found</div>}
        />
      </Routes>
    </>
  );
}

export default App;
