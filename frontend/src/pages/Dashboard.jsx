import { useEffect, useState } from "react";
import { api } from "../api/api";
import { PieChart, List, Activity, Layout } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalIssues: 0,
    assignedToMe: 0,
    doneIssues: 0,
  });
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

        // Calculate stats
        // Calculate stats
        // Fix: Backend returns uppercase "DONE"
        const myIssues = allIssues.filter(i => i.status !== "DONE"); // Mock "assigned to me" as "not done"
        const done = allIssues.filter(i => i.status === "DONE");

        setStats({
          totalProjects: projects.length,
          totalIssues: allIssues.length,
          assignedToMe: myIssues.length,
          doneIssues: done.length,
        });
        setAssignedIssues(myIssues.slice(0, 5)); // Top 5
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#172B4D] mb-6">System Dashboard</h1>

      {loading ? (
        <div className="text-center py-10">Loading dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white p-4 rounded shadow-sm border border-[#DFE1E6]">
            <div className="flex items-center gap-3 mb-2">
              <Layout className="text-blue-500" />
              <h3 className="font-semibold text-gray-700">Total Projects</h3>
            </div>
            <div className="text-3xl font-bold text-[#172B4D]">{stats.totalProjects}</div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm border border-[#DFE1E6]">
            <div className="flex items-center gap-3 mb-2">
              <List className="text-orange-500" />
              <h3 className="font-semibold text-gray-700">Total Issues</h3>
            </div>
            <div className="text-3xl font-bold text-[#172B4D]">{stats.totalIssues}</div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm border border-[#DFE1E6]">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="text-green-500" />
              <h3 className="font-semibold text-gray-700">Done Issues</h3>
            </div>
            <div className="text-3xl font-bold text-[#172B4D]">{stats.doneIssues}</div>
          </div>

          {/* Assigned to Me Gadget */}
          <div className="bg-white p-4 rounded shadow-sm border border-[#DFE1E6] md:col-span-2">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Activity size={18} />
              Assigned to Me
            </h3>
            {assignedIssues.length === 0 ? (
              <p className="text-gray-500 text-sm">No active issues assigned to you.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-[#DFE1E6]">
                      <th className="pb-2 font-medium">Key</th>
                      <th className="pb-2 font-medium">Summary</th>
                      <th className="pb-2 font-medium">Priority</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedIssues.map(issue => (
                      <tr key={issue.id} className="border-b border-[#DFE1E6] last:border-0 hover:bg-gray-50">
                        <td className="py-2">
                          <Link to={`/project/${issue.projectId}/issues`} className="text-blue-600 hover:underline">
                            {issue.projectName.substring(0, 2).toUpperCase()}-{issue.id}
                          </Link>
                        </td>
                        <td className="py-2 text-[#172B4D]">{issue.title}</td>
                        <td className="py-2">
                          <span className={`${issue.priority === 'High' ? 'text-red-500' : 'text-gray-500'}`}>
                            {issue.priority}
                          </span>
                        </td>
                        <td className="py-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-bold">
                            {issue.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-right">
              <Link to="/filters" className="text-sm text-blue-600 hover:underline">View all my issues</Link>
            </div>
          </div>

          {/* Activity Stream Placeholder */}
          <div className="bg-white p-4 rounded shadow-sm border border-[#DFE1E6]">
            <h3 className="font-semibold text-gray-700 mb-4">Activity Stream</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-600">JD</div>
                <div>
                  <p className="text-sm text-[#172B4D]"><span className="font-semibold">John Doe</span> updated an issue</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-green-600">AB</div>
                <div>
                  <p className="text-sm text-[#172B4D]"><span className="font-semibold">Alice B</span> created a project</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
