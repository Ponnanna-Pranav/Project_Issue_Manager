import { Search, Bell, HelpCircle, LogOut, User as UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Navbar({ onCreateClick }) {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null); // 'notifications', 'help', 'profile'
  const navigate = useNavigate();

  const notificationRef = useRef(null);
  const helpRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Invalid user data in localStorage", e);
        localStorage.removeItem("user");
      }
    }

    const handleClickOutside = (event) => {
      // If click is outside of all menus, close active menu
      if (
        notificationRef.current && !notificationRef.current.contains(event.target) &&
        helpRef.current && !helpRef.current.contains(event.target) &&
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <header className="h-14 bg-surface border-b border-border fixed top-0 left-0 right-0 z-50 px-4 flex items-center justify-between">
      {/* Left Section: Logo & Nav */}
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[#172B4D] font-bold text-xl tracking-tight">
            Project Ticket Manager
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-text-main">
          <Link to="/dashboard" className="hover:bg-gray-100 px-3 py-1.5 rounded transition">
            Your Work
          </Link>
          <Link to="/projects" className="hover:bg-gray-100 px-3 py-1.5 rounded transition">
            Projects
          </Link>
          <Link to="/filters" className="hover:bg-gray-100 px-3 py-1.5 rounded transition">
            Filters
          </Link>
          <Link to="/dashboards" className="hover:bg-gray-100 px-3 py-1.5 rounded transition">
            Dashboards
          </Link>

          <button
            onClick={onCreateClick}
            className="bg-[#0052CC] hover:bg-blue-700 text-white px-3 py-1.5 rounded font-medium transition flex items-center gap-1"
          >
            Create
          </button>
        </nav>
      </div>

      {/* Right Section: Search & Actions */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2 top-2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-2 py-1.5 bg-background border border-border rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-48 transition-all text-text-main placeholder-text-secondary"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => toggleMenu('notifications')}
            className={`p-1.5 rounded-full transition ${activeMenu === 'notifications' ? 'bg-secondary text-primary' : 'text-text-main hover:bg-secondary'}`}
          >
            <Bell className="w-5 h-5" />
          </button>
          {activeMenu === 'notifications' && (
            <div className="absolute right-0 mt-2 w-80 bg-surface rounded-md shadow-card border border-border py-0 z-50 text-text-main overflow-hidden">
              <div className="px-4 py-3 border-b border-border font-semibold text-sm">
                Notifications
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 text-center text-sm text-text-secondary">
                  <p>You have no new notifications.</p>
                </div>
                {/* Example Notification Item
                        <div className="px-4 py-3 hover:bg-secondary cursor-pointer border-b border-border last:border-0">
                            <p className="text-sm"><strong>John Doe</strong> updated issue <span className="text-primary">PROJ-123</span></p>
                            <p className="text-xs text-text-secondary mt-1">2 hours ago</p>
                        </div>
                        */}
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => toggleMenu('help')}
            className={`p-1.5 rounded-full transition ${activeMenu === 'help' ? 'bg-secondary text-primary' : 'text-text-main hover:bg-secondary'}`}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          {activeMenu === 'help' && (
            <div className="absolute right-0 mt-2 w-56 bg-surface rounded-md shadow-card border border-border py-1 z-50 text-text-main">
              <div className="px-4 py-2 text-xs font-bold text-text-secondary uppercase">
                Help
              </div>
              <a href="https://support.atlassian.com/jira-software-cloud/" target="_blank" rel="noreferrer" className="block px-4 py-2 text-sm hover:bg-secondary">
                Documentation
              </a>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-secondary">
                Keyboard Shortcuts
              </button>
              <div className="my-1 border-t border-border"></div>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-secondary">
                About Project Ticket Manager
              </button>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => toggleMenu('profile')}
            className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-surface cursor-pointer hover:opacity-90 transition-opacity"
          >
            {getInitials(user?.name)}
          </div>

          {activeMenu === 'profile' && (
            <div className="absolute right-0 mt-2 w-56 bg-surface rounded-md shadow-card border border-border py-1 z-50 text-text-main">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold">{user?.name || "User"}</p>
                <p className="text-xs text-text-secondary">{user?.role || "Team Member"}</p>
                <p className="text-xs text-text-secondary mt-0.5">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary">
                  <UserIcon size={16} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-secondary"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
