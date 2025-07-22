import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useUser,
  SignOutButton,
  SignInButton,
  useClerk,
} from "@clerk/clerk-react";
import { Search, User, Menu } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();

  const navigationItems = [
    { label: "Home", path: "/home" },
    { label: "Search", path: "/search" },
    { label: "Profile", path: "/profile" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
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
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-xl font-semibold text-gray-900" onClick={() => navigate("/")}>
              PromptNow
            </span>
          </div>

          {/* Desktop - Right Side */}
          <div className="hidden md:flex items-center space-x-4 relative profile-dropdown">
            {isSignedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-md z-50">
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
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          signOut().then(() => navigate("/home"));
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="text-sm px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition"
              >
                Sign In
              </button>
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
                      : "text-gray-700 hover:bg-purple-50"
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
                    <button
                      onClick={async () => {
                        setIsProfileDropdownOpen(false);
                        await signOut();
                        navigate("/home");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </SignOutButton>
                </>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="text-left px-3 py-2 text-sm border border-purple-600 text-purple-600 rounded-md mx-3 hover:bg-purple-50"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
