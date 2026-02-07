import React, { useState, useEffect } from "react";
import { X, ChevronDown, CheckSquare, Bookmark, AlertCircle } from "lucide-react";
import { api } from "../api/api";

export default function CreateIssueModal({ isOpen, onClose, onIssueCreated }) {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        projectId: "",
        title: "",
        description: "",
        type: "Task",
        priority: "Medium",
        assigneeId: "",
    });

    useEffect(() => {
        if (isOpen) {
            api.get("/projects/my").then((res) => {
                setProjects(res.data);
                if (res.data.length > 0) {
                    setFormData((prev) => ({ ...prev, projectId: res.data[0].id }));
                }
            });
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/projects/${formData.projectId}/issues`, {
                title: formData.title,
                description: formData.description,
                priority: formData.priority.toUpperCase(),
                // 'type' and 'assigneeId' are not supported by backend Issue model yet
            });
            onIssueCreated?.();
            onClose();
        } catch (err) {
            alert("Failed to create issue");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-medium text-[#172B4D]">Create issue</h2>
                    <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-1 rounded transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="create-issue-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Project Select */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Project</label>
                            {projects.length === 0 ? (
                                <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded">
                                    You have no projects. Please create a project first.
                                </div>
                            ) : (
                                <div className="relative">
                                    <select
                                        className="w-full bg-[#F4F5F7] border border-[#DFE1E6] text-[#172B4D] text-sm rounded px-3 py-2 pr-8 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer hover:bg-[#EBECF0]"
                                        value={formData.projectId}
                                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Select a project</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none w-4 h-4" />
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-gray-200" />

                        {/* Issue Type */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Issue Type</label>
                            <div className="relative w-1/2">
                                <div className="absolute left-3 top-2.5 pointer-events-none">
                                    {formData.type === 'Task' && <CheckSquare size={16} className="text-[#4BADE8]" />}
                                    {formData.type === 'Story' && <Bookmark size={16} className="text-[#65BA43]" />}
                                    {formData.type === 'Bug' && <AlertCircle size={16} className="text-[#E13C3C]" />}
                                </div>
                                <select
                                    className="w-full bg-[#F4F5F7] border border-[#DFE1E6] text-[#172B4D] text-sm rounded pl-9 pr-8 py-2 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer hover:bg-[#EBECF0]"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Task">Task</option>
                                    <option value="Story">Story</option>
                                    <option value="Bug">Bug</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none w-4 h-4" />
                            </div>
                        </div>

                        <div className="h-px bg-gray-200" />

                        {/* Summary */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Summary</label>
                            <input
                                className="w-full border border-[#DFE1E6] p-2 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <p className="text-[11px] text-gray-500 mt-1">Concisely summarize the issue.</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Description</label>
                            <textarea
                                className="w-full border border-[#DFE1E6] p-2 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all h-32 resize-y"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Priority & Assignee (Grid) */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Priority</label>
                                <select
                                    className="w-full bg-[#F4F5F7] border border-[#DFE1E6] text-[#172B4D] text-sm rounded px-3 py-2 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-[#EBECF0]"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Assignee</label>
                                <select
                                    className="w-full bg-[#F4F5F7] border border-[#DFE1E6] text-[#172B4D] text-sm rounded px-3 py-2 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-[#EBECF0]"
                                    value={formData.assigneeId}
                                    onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                                >
                                    <option value="">Unassigned</option>
                                    <option value="1">Jane Doe</option>
                                    {/* Populate real users later */}
                                </select>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[#172B4D] font-medium px-4 py-2 rounded hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="create-issue-form"
                        disabled={!formData.projectId}
                        className={`font-medium px-6 py-2 rounded transition shadow-sm ${!formData.projectId ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#0052CC] text-white hover:bg-blue-700'}`}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
