import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { api } from "../api/api";
import IssueCard from "../components/IssueCard";
import { Plus, Search, Filter } from "lucide-react";

export default function ProjectBoard({ openCreateModal }) {
    const { id } = useParams();

    // Debug log
    useEffect(() => {
        console.log("ProjectBoard: openCreateModal prop is:", openCreateModal);
    }, [openCreateModal]);

    // For now, let's just use local state for search and basic mapping fix.

    const [issues, setIssues] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [columns, setColumns] = useState({
        "OPEN": [],
        "IN_PROGRESS": [],
        "DONE": [],
    });

    const COLUMN_NAMES = {
        "OPEN": "To Do",
        "IN_PROGRESS": "In Progress",
        "DONE": "Done"
    };

    useEffect(() => {
        api.get(`/projects/${id}/issues`).then((res) => {
            setIssues(res.data);
        });
    }, [id]);

    useEffect(() => {
        // Group by status with Filter
        const newColumns = {
            "OPEN": [],
            "IN_PROGRESS": [],
            "DONE": [],
        };

        issues.filter(issue =>
            issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ).forEach(issue => {
            // Map backend status to column key. 
            // Backend sends 'OPEN', 'IN_PROGRESS', 'DONE'.
            // If unknown, fallback to OPEN.
            const statusKey = newColumns[issue.status] ? issue.status : "OPEN";
            newColumns[statusKey].push(issue);
        });
        setColumns(newColumns);
    }, [issues, searchQuery]);

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const startCol = columns[source.droppableId];
        const finishCol = columns[destination.droppableId];

        if (startCol === finishCol) {
            // Reorder within same column
            const newCol = Array.from(startCol);
            const [movedIssue] = newCol.splice(source.index, 1);
            newCol.splice(destination.index, 0, movedIssue);

            setColumns({
                ...columns,
                [source.droppableId]: newCol
            });
        } else {
            // Move to different column
            const startIssues = Array.from(startCol);
            const finishIssues = Array.from(finishCol);
            const [movedIssue] = startIssues.splice(source.index, 1);

            // Update local status
            movedIssue.status = destination.droppableId;
            finishIssues.splice(destination.index, 0, movedIssue);

            setColumns({
                ...columns,
                [source.droppableId]: startIssues,
                [destination.droppableId]: finishIssues
            });

            // API Call to update status
            try {
                // Backend expects enum strings like "IN_PROGRESS"
                await api.put(`/issues/${movedIssue.id}`, {
                    status: destination.droppableId,
                    // If backend requires or supports other fields like priority, include them, 
                    // otherwise send only what's changing or what's required.
                    // Assuming UpdateIssueRequest takes nullable status/priority.
                    priority: movedIssue.priority
                });
            } catch (err) {
                console.error("Failed to update status", err);
            }
        }
    };

    return (
        <div className="h-full flex flex-col bg-background text-text-main">
            {/* Board Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-text-main">Kanban Board</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-2 top-2 text-text-secondary w-4 h-4" />
                        <input
                            className="pl-8 pr-3 py-1.5 bg-surface border border-border rounded text-sm w-48 focus:ring-2 focus:ring-primary outline-none text-text-main placeholder-text-secondary"
                            placeholder="Search issues"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex -space-x-1">
                        <div className="w-8 h-8 rounded-full bg-red-900 flex items-center justify-center text-xs font-bold text-red-200 border-2 border-surface">AS</div>
                        <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-200 border-2 border-surface">JD</div>
                    </div>
                    <button className="text-text-secondary hover:bg-surface p-2 rounded transition-colors">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 h-full overflow-x-auto pb-4">
                    {Object.entries(columns).map(([columnId, columnIssues]) => (
                        <div key={columnId} className="w-80 min-w-[320px] flex flex-col bg-surface rounded-lg p-2 max-h-full border border-border">
                            <h2 className="text-xs font-semibold text-text-secondary uppercase mb-3 px-2 flex justify-between items-center">
                                {COLUMN_NAMES[columnId]}
                                <span className="bg-background text-text-secondary px-2 py-0.5 rounded-full text-[10px]">{columnIssues.length}</span>
                            </h2>

                            <Droppable droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`flex-1 overflow-y-auto px-1 min-h-[100px] transition-colors ${snapshot.isDraggingOver ? 'bg-secondary' : ''}`}
                                    >
                                        {columnIssues.map((issue, index) => (
                                            <Draggable key={issue.id.toString()} draggableId={issue.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{ ...provided.draggableProps.style }}
                                                        className="mb-2"
                                                    >
                                                        <IssueCard
                                                            issue={issue}
                                                            onDelete={async (issueId) => {
                                                                try {
                                                                    await api.delete(`/issues/${issueId}`);
                                                                    // Refresh local state
                                                                    window.location.reload(); // Simple refresh for now
                                                                } catch (err) {
                                                                    console.error("Failed to delete", err);
                                                                    alert("Failed to delete issue");
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        {/* Inline Create Button - Only opens main modal for now as simple fix */}
                                        <button
                                            // Trigger modal from props if passed, or just use window/global event if needed?
                                            // Since I haven't confirmed prop passing works yet, let's try calling a window event or just fail gracefully.
                                            // BETTER: Let's assume the prop `openCreateModal` is passed if I fix App.js
                                            onClick={() => window.dispatchEvent(new Event('open-create-issue-modal'))}
                                            className="w-full text-left p-2 hover:bg-background rounded text-sm text-text-secondary flex items-center gap-1 mt-1 transition-colors"
                                        >
                                            <Plus size={14} />
                                            Create issue
                                        </button>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
