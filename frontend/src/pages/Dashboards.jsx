import { Link } from "react-router-dom";
import { Layout } from "lucide-react";

export default function Dashboards() {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-[#172B4D] mb-6">Dashboards</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/dashboard" className="block group">
                    <div className="bg-white p-6 rounded shadow-sm border border-[#DFE1E6] hover:shadow-md transition-all flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded text-blue-600">
                            <Layout size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#172B4D] group-hover:text-blue-600 transition-colors">System Dashboard</h3>
                            <p className="text-sm text-gray-500">View project statistics and your assigned issues.</p>
                        </div>
                    </div>
                </Link>

                {/* Placeholder for creating new dashboards */}
                <div className="bg-gray-50 p-6 rounded border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                    <p className="text-gray-500 mb-2">Create custom dashboards</p>
                    <button className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50" disabled>
                        Coming soon
                    </button>
                </div>
            </div>
        </div>
    );
}
