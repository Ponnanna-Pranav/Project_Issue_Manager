import { useEffect, useState } from "react";
import {Mail, Shield, Briefcase } from "lucide-react";

export default function Profile() {
    const [user, setUser] = useState(null);

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

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-[#172B4D] mb-8">Your Profile</h1>

            <div className="bg-white rounded-lg border border-[#DFE1E6] shadow-sm overflow-hidden">
                {/* Header Cover */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>

                {/* Profile Info */}
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                                <div className="w-full h-full rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white">
                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </div>
                            </div>
                            <div className="mb-1">
                                <h2 className="text-2xl font-bold text-[#172B4D]">{user.name}</h2>
                                <p className="text-gray-500">{user.role || "Team Member"}</p>
                            </div>
                        </div>
                        <button className="bg-gray-100 hover:bg-gray-200 text-[#172B4D] font-medium px-4 py-2 rounded transition">
                            Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Contact Information</h3>
                                <div className="flex items-center gap-3 text-[#172B4D] mb-2">
                                    <Mail className="text-gray-400" size={18} />
                                    <span>{user.email}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Role & Permissions</h3>
                                <div className="flex items-center gap-3 text-[#172B4D] mb-2">
                                    <Shield className="text-gray-400" size={18} />
                                    <span className="capitalize">{user.role ? user.role.toLowerCase() : "Member"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[#172B4D]">
                                    <Briefcase className="text-gray-400" size={18} />
                                    <span>Software Department</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Activity</h3>
                            <div className="bg-gray-50 rounded p-4 text-center text-gray-500 text-sm">
                                No recent activity to show.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
