import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import Navbar from "../components/Navbar";
import IssueCard from "../components/IssueCard";

export default function ProjectIssue() {
  const { id } = useParams();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get(`/projects/${id}/issues`).then((res) => {
      setIssues(res.data);
    });
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Project Issues</h2>

        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </>
  );
}
