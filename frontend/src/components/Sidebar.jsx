import React, { useState } from "react";
import { Kanban, ListTodo, Settings } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();
    const { id } = useParams();
    const [user, setUser] = useState(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Invalid user data", e);
            }
        }
    }, []);

    const isActive = (path) => {
        return location.pathname.includes(path)
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600 hover:bg-gray-200";
    };

    if (!id) {
        // Global Sidebar (or empty/different for global pages)
        return (
            <aside className="w-64 bg-surface border-r border-border h-[calc(100vh-56px)] fixed left-0 top-14 overflow-y-auto hidden md:block">
                <div className="p-4">
                    <nav className="space-y-1">
                        <Link
                            to="/projects"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/projects")}`}
                        >
                            <Kanban size={18} />
                            Projects
                        </Link>
                        <Link
                            to="/filters"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/filters")}`}
                        >
                            <ListTodo size={18} />
                            Filters
                        </Link>
                        <Link
                            to="/dashboards"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/dashboards")}`}
                        >
                            <Settings size={18} /> {/* Placeholder icon */}
                            Dashboards
                        </Link>
                    </nav>
                </div>
            </aside>
        );
    }

    // Project Specific Sidebar
    return (
        <aside className="w-64 bg-surface border-r border-border h-[calc(100vh-56px)] fixed left-0 top-14 overflow-y-auto hidden md:block">
            <div className="p-4">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="w-8 h-8 bg-[#FF5630] rounded flex items-center justify-center text-white font-bold text-sm">
                        P{id}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-text-main leading-tight">
                            Project {id}
                        </h3>
                        <p className="text-[11px] text-gray-500">Software Project</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    <Link
                        to={`/project/${id}/board`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                            `/project/${id}/board`
                        )}`}
                    >
                        <Kanban size={18} />
                        Board
                    </Link>
                    <Link
                        to={`/project/${id}/issues`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                            `/project/${id}/issues`
                        )}`}
                    >
                        <ListTodo size={18} />
                        Issues
                    </Link>
                    {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                        <>
                            <div className="my-2 border-t border-gray-300 mx-2"></div>
                            <Link
                                to={`/project/${id}/settings`}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                                    `/project/${id}/settings`
                                )}`}
                            >
                                <Settings size={18} />
                                Project Settings
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </aside>
    );
}
