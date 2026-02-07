import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectBoard from "./pages/ProjectBoard";
import ProjectIssues from "./pages/ProjectIssues";
import ProjectSettings from "./pages/ProjectSettings";
import Filters from "./pages/Filters";
import Dashboards from "./pages/Dashboards";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";

import Layout from "./components/Layout";

export default function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/projects"
          element={
            isAuthenticated ? (
              <Layout>
                <Projects />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/project/:id/board"
          element={
            isAuthenticated ? (
              <Layout>
                <ProjectBoard />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/project/:id/issues"
          element={
            isAuthenticated ? (
              <Layout>
                <ProjectIssues />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/project/:id/settings"
          element={
            isAuthenticated ? (
              <Layout>
                <ProjectSettings />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/filters"
          element={
            isAuthenticated ? (
              <Layout>
                <Filters />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/dashboards"
          element={
            isAuthenticated ? (
              <Layout>
                <Dashboards />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Layout>
                <Profile />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
