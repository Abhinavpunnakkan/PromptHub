import { Home, Search, Bookmark, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Home", icon: <Home size={18} />, path: "/" },
  { label: "Search", icon: <Search size={18} />, path: "/search-results" },
  { label: "Saved", icon: <Bookmark size={18} />, path: "/saved" },
  { label: "Create", icon: <Plus size={18} />, path: "/create"}
];

const LeftPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="hidden md:flex flex-col w-56 h-screen border-r border-gray-200 bg-white px-4 py-6 sticky top-0">

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition 
                ${isActive ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default LeftPanel;
