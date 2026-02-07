import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Star, Folder, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [newProject, setNewProject] = useState({ name: "", description: "" });
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Invalid user data", e);
            }
        }
    }, []);

    const fetchProjects = () => {
        api.get("/projects/my").then((res) => {
            setProjects(res.data);
        });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/projects", newProject);
            setNewProject({ name: "", description: "" });
            setShowCreate(false);
            fetchProjects();
        } catch (err) {
            alert("Failed to create project");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-[#172B4D]">Projects</h1>
                {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="bg-[#0052CC] hover:bg-blue-700 text-white px-3 py-1.5 rounded font-medium transition flex items-center gap-1"
                    >
                        <Plus size={16} />
                        Create project
                    </button>
                )}
            </div>

            {showCreate && (
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 mb-6 max-w-2xl">
                    <h3 className="font-semibold text-gray-700 mb-4">Create Project</h3>
                    <form onSubmit={handleCreate}>
                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
                            <input
                                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newProject.name}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                            <textarea
                                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none h-20"
                                value={newProject.description}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, description: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowCreate(false)}
                                className="text-[#172B4D] font-medium px-3 py-1.5 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button className="bg-[#0052CC] text-white px-3 py-1.5 rounded font-medium hover:bg-blue-700">
                                Create Project
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {projects.length === 0 && !showCreate ? (
                <div className="text-center py-16 bg-white rounded border border-dashed border-gray-300">
                    <Folder className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">You don't have any projects yet.</p>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="mt-2 text-[#0052CC] font-medium hover:underline"
                    >
                        Create one now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => navigate(`/project/${p.id}/board`)}
                            className="bg-white p-4 rounded shadow-sm border border-[#DFE1E6] hover:shadow-md transition-all cursor-pointer group flex flex-col h-40"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-[#FF5630] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                        {p.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#172B4D] group-hover:text-[#0052CC] transition-colors truncate w-32">
                                            {p.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">Software Project</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); /* star logic */ }}
                                    className="text-gray-400 hover:bg-gray-100 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Star size={16} />
                                </button>
                            </div>

                            <p className="text-sm text-[#5E6C84] line-clamp-2 flex-grow">
                                {p.description || "No description provided."}
                            </p>

                            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                                <span>Quick links</span>
                                <div className="flex -space-x-1.5 hover:space-x-0 transition-all">
                                    {/* Mock avatars */}
                                    <div className="w-5 h-5 rounded-full bg-blue-100 ring-2 ring-white flex items-center justify-center text-[9px] text-blue-800 font-bold">JD</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
