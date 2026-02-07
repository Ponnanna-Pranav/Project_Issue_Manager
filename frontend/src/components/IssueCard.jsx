import { CheckSquare, MoreHorizontal, ArrowUp } from "lucide-react";
import React, { useState } from "react";

export default function IssueCard({ issue, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = React.useRef(null);

  const getPriorityColor = (p) => {
    if (p === "High" || p === "HIGH") return "text-red-500";
    if (p === "Medium" || p === "MEDIUM") return "text-orange-400";
    return "text-green-500";
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card click/drag
    if (window.confirm("Are you sure you want to delete this issue?")) {
      // Call parent delete handler if provided, or API directly? 
      // Better to pass callback. For now let's try direct API if prop missing, or just alert.
      // Actually, ProjectBoard should handle delete to update state.
      if (onDelete) onDelete(issue.id);
    }
    setShowMenu(false);
  };

  return (
    <div className="bg-card p-3 rounded shadow-card border border-border hover:bg-surface group cursor-grab active:cursor-grabbing relative transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="text-text-main text-sm font-medium line-clamp-2 leading-snug">
          {issue.title}
        </span>
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="text-text-secondary opacity-0 group-hover:opacity-100 hover:bg-background rounded p-0.5 transition-all"
          >
            <MoreHorizontal size={14} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-6 w-32 bg-card shadow-lg rounded border border-border z-10 py-1">
              <button
                onClick={handleDelete}
                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-surface"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <CheckSquare size={14} className="text-[#4BADE8]" />
          <span className="text-xs text-text-secondary font-medium">{issue.key || `ISS-${issue.id}`}</span>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUp size={14} className={getPriorityColor(issue.priority)} />
          <div className="w-5 h-5 bg-purple-900 rounded-full flex items-center justify-center text-[9px] text-white font-bold ring-2 ring-card">
            {issue.assignee ? issue.assignee.charAt(0) : "U"}
          </div>
        </div>
      </div>
    </div>
  );
}
