import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser, SignOutButton, SignInButton } from "@clerk/clerk-react";
import { Search, User } from "lucide-react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { label: "Home", path: "/" },
    { label: "Search", path: "/search" },
    { label: "Create", path: "/create" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(`Searching for: ${searchQuery}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">PromptHub</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Search + Auth */}
          <div className="hidden md:flex items-center space-x-4 relative profile-dropdown">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                placeholder="Search for prompts..."
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Auth Dropdown */}
            {isSignedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <User className="w-5 h-5 text-white" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-50">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Edit Profile
                    </button>
                    <SignOutButton>
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600">
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                )}
              </div>
            ) : (
              <SignInButton>
                <button className="text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>

          {/* Mobile controls (optional) */}
          {/* You can update this part later if needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
