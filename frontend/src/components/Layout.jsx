import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CreateIssueModal from "./CreateIssueModal";
import React, { useState } from "react";

export default function Layout({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F4F5F7]">
            <Navbar onCreateClick={() => setIsModalOpen(true)} />
            <Sidebar />
            <main className="pt-14 md:pl-64 transition-all duration-300 min-h-screen">
                <div className="p-8 max-w-[1600px] mx-auto">
                    {/* Pass modal control to children */}
                    {React.cloneElement(children, {
                        openCreateModal: () => setIsModalOpen(true)
                    })}
                </div>
            </main>
            <CreateIssueModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onIssueCreated={() => window.location.reload()}
            />

        </div>
    );
}
