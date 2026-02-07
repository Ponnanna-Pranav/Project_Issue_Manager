import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";
import { CheckSquare, Bookmark, AlertCircle } from "lucide-react";

export default function ProjectIssues() {
    const { id } = useParams();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/projects/${id}/issues`)
            .then((res) => {
                setIssues(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch issues", err);
                setLoading(false);
            });
    }, [id]);

    const getIcon = (type) => {
        switch (type) {
            case "Task": return <CheckSquare size={16} className="text-[#4BADE8]" />;
            case "Story": return <Bookmark size={16} className="text-[#65BA43]" />;
            case "Bug": return <AlertCircle size={16} className="text-[#E13C3C]" />;
            default: return <CheckSquare size={16} />;
        }
    };

    if (loading) return <div className="p-8">Loading issues...</div>;

    return (
        <div>
            <h1 className="text-2xl font-semibold text-[#172B4D] mb-6">Issues</h1>
            <div className="bg-white border border-[#DFE1E6] rounded-md overflow-hidden">
                <table className="w-full text-sm text-left text-[#172B4D]">
                    <thead className="bg-[#F4F5F7] text-[#5E6C84] font-semibold border-b border-[#DFE1E6]">
                        <tr>
                            <th className="px-4 py-3 w-10">T</th>
                            <th className="px-4 py-3">Key</th>
                            <th className="px-4 py-3">Summary</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Priority</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DFE1E6]">
                        {issues.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                    No issues found in this project.
                                </td>
                            </tr>
                        ) : (
                            issues.map(issue => (
                                <tr key={issue.id} className="hover:bg-[#FAFBFC] transition-colors">
                                    <td className="px-4 py-3">{getIcon(issue.type)}</td>
                                    <td className="px-4 py-3 text-gray-500 font-medium">#{issue.id}</td>
                                    <td className="px-4 py-3 font-medium hover:text-[#0052CC] cursor-pointer hover:underline">
                                        {issue.title}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="bg-[#DFE1E6] text-[#42526E] font-bold text-[11px] px-1.5 py-0.5 rounded uppercase">
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {issue.priority}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
