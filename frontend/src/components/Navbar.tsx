import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser, SignOutButton, SignInButton } from "@clerk/clerk-react";
import { Search, User, Menu } from "lucide-react";
import { debounce } from "lodash";
import { useCallback } from "react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showSearchTips, setShowSearchTips] = useState(false);
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }, 500),
    []
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchTips(value.trim() === "");
    debouncedSearch(value);
  };

  const handleSearchSubmit = () => {
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const navigationItems = [
    { label: "Home", path: "/" },
    { label: "Search", path: "/search" },
    { label: "Profile", path: "/profile" },
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
            <span className="text-xl font-semibold text-gray-900">
              PromptHub
            </span>
          </div>

          {/* Desktop Nav */}
          {/* <div className="hidden md:flex items-center space-x-8">
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
          </div> */}

          {/* Search + Auth - Desktop */}
          <div className="hidden md:flex items-center space-x-4 relative profile-dropdown">
            {/* Search
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchTips(true)}
                onKeyDown={handleKeyPress}
                className="pl-8 pr-10 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
              <button
                onClick={handleSearchSubmit}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {showSearchTips && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 shadow-md rounded-md z-50 text-sm p-3 space-y-1 text-gray-600">
                  <p>
                    <strong>[tag]</strong> – Search within a tag
                  </p>
                  <p>
                    <strong>user:1234</strong> – Search by author
                  </p>
                  <p>
                    <strong>"exact phrase"</strong> – Exact match
                  </p>
                  <p>
                    <strong>collective:"Name"</strong> – Search by collection
                  </p>
                </div>
              )}
            </div> */}

            {/* Profile Dropdown */}
            {isSignedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <img
                    src={user.imageUrl}
                    alt="Profile Pic"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      Signed in as
                      <div className="font-medium">
                        {user?.fullName ||
                          user?.primaryEmailAddress?.emailAddress}
                      </div>
                    </div>
                    <div className="border-t border-gray-200" />
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/edit-profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Edit Profile
                    </button>
                    <SignOutButton>
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                )}
              </div>
            ) : (
              <SignInButton>
                <button className="text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className={`text-left px-3 py-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-700 hover:bg-purple-600 hover:bg-opacity-10"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {isSignedIn ? (
                <>
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                  <SignOutButton>
                    <button className="text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Sign Out
                    </button>
                  </SignOutButton>
                </>
              ) : (
                <SignInButton>
                  <button className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
