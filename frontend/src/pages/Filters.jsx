import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link } from "react-router-dom";
import { Filter, Search } from "lucide-react";

export default function Filters() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("my-open"); // 'my-open', 'reported-by-me', 'all'

    useEffect(() => {
        // Fetch all projects, then fetch issues for each project
        const fetchAllIssues = async () => {
            try {
                const projectsRes = await api.get("/projects/my");
                const projects = projectsRes.data;

                const issuesPromises = projects.map(p =>
                    api.get(`/projects/${p.id}/issues`).then(res =>
                        res.data.map(issue => ({ ...issue, projectName: p.name, projectId: p.id }))
                    )
                );

                const issuesArrays = await Promise.all(issuesPromises);
                const allIssues = issuesArrays.flat();
                setIssues(allIssues);
            } catch (error) {
                console.error("Failed to fetch issues", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllIssues();
    }, []);

    // Mock user ID check (replace with actual user ID from context/auth if available)
    // For now, we'll just show all issues or filter by status for demo
    const filteredIssues = issues.filter(issue => {
        if (filterType === "my-open") return issue.status !== "DONE"; // approximated 'open'
        if (filterType === "done") return issue.status === "DONE";
        return true;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-[#172B4D]">Filters</h1>
                <button className="text-[#0052CC] font-medium hover:underline">
                    View all filters
                </button>
            </div>

            <div className="flex bg-white rounded-md border border-[#DFE1E6] shadow-sm overflow-hidden min-h-[500px]">
                {/* Sidebar for filters */}
                <div className="w-64 border-r border-[#DFE1E6] bg-gray-50 p-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Starred</h3>
                    <div className="space-y-1 mb-6">
                        <button
                            onClick={() => setFilterType("my-open")}
                            className={`w-full text-left px-2 py-1.5 rounded text-sm ${filterType === 'my-open' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            My open issues
                        </button>
                        <button
                            onClick={() => setFilterType("reported-by-me")}
                            className={`w-full text-left px-2 py-1.5 rounded text-sm ${filterType === 'reported-by-me' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            Reported by me
                        </button>
                    </div>

                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Other</h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => setFilterType("all")}
                            className={`w-full text-left px-2 py-1.5 rounded text-sm ${filterType === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            All issues
                        </button>
                        <button
                            onClick={() => setFilterType("done")}
                            className={`w-full text-left px-2 py-1.5 rounded text-sm ${filterType === 'done' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            Done issues
                        </button>
                    </div>
                </div>

                {/* Results Area */}
                <div className="flex-1 p-6">
                    <h2 className="text-lg font-medium text-[#172B4D] mb-4">
                        {filterType === "my-open" && "My open issues"}
                        {filterType === "reported-by-me" && "Reported by me"}
                        {filterType === "all" && "All issues"}
                        {filterType === "done" && "Done issues"}
                    </h2>

                    <div className="relative mb-4">
                        <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search issues"
                            className="w-full pl-8 pr-4 py-2 border border-[#DFE1E6] rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading issues...</div>
                    ) : filteredIssues.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No issues found matching this filter.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-[#172B4D]">
                                <thead className="bg-gray-50 border-b border-[#DFE1E6]">
                                    <tr>
                                        <th className="py-2 px-3 font-medium text-gray-500">Key</th>
                                        <th className="py-2 px-3 font-medium text-gray-500">Summary</th>
                                        <th className="py-2 px-3 font-medium text-gray-500">Project</th>
                                        <th className="py-2 px-3 font-medium text-gray-500">Status</th>
                                        <th className="py-2 px-3 font-medium text-gray-500">Priority</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIssues.map(issue => (
                                        <tr key={issue.id} className="border-b border-[#DFE1E6] hover:bg-gray-50">
                                            <td className="py-2 px-3 whitespace-nowrap">
                                                <Link to={`/project/${issue.projectId}/issues`} className="text-blue-600 hover:underline">
                                                    {issue.projectName.substring(0, 3).toUpperCase()}-{issue.id}
                                                </Link>
                                            </td>
                                            <td className="py-2 px-3 font-medium">
                                                <Link to={`/project/${issue.projectId}/issues`} className="hover:text-blue-600">
                                                    {issue.title}
                                                </Link>
                                            </td>
                                            <td className="py-2 px-3 text-gray-600">{issue.projectName}</td>
                                            <td className="py-2 px-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold
                                                    ${issue.status === 'DONE' ? 'bg-green-100 text-green-800' :
                                                        issue.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {issue.status}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3">
                                                <span className={`
                                                    ${issue.priority === 'High' ? 'text-red-500 font-medium' :
                                                        issue.priority === 'Medium' ? 'text-orange-500' : 'text-green-500'}`}>
                                                    {issue.priority}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
