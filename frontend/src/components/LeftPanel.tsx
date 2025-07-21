import { Home, Search, Bookmark, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const navItems = [
  { label: "Home", icon: <Home size={18} />, path: "/home", protected: false },
  { label: "Search", icon: <Search size={18} />, path: "/search", protected: false },
  { label: "Saved", icon: <Bookmark size={18} />, path: "/saved", protected: true },
  { label: "Create", icon: <Plus size={18} />, path: "/create", protected: true },
];

const LeftPanel = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (item: typeof navItems[number]) => {
    if (item.protected && !isSignedIn) {
      alert("Please sign in to access this feature.");
      navigate("/auth");
      return;
    }
    navigate(item.path);
  };

  return (
    <div className="hidden md:flex flex-col w-56 h-screen border-r border-gray-200 bg-white px-4 py-6 sticky top-0">

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition 
                ${isActive ? "bg-purple-100 text-purple-700 hover:cursor-pointer" : "text-gray-700 hover:bg-gray-100 cursor-pointer"}`}
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
