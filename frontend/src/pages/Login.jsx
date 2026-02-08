import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "lucide-react"; // Using Layout icon as makeshift logo

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
  
      localStorage.setItem("token", res.data.token);
  
      alert("Login successful!");
      navigate("/dashboard");
  
    } catch (err) {
      console.log(err.response?.data);
      alert("Invalid credentials");
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] px-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 text-[#172B4D]">
        <Layout className="w-8 h-8 text-[#0052CC]" />
        <span className="text-2xl font-bold tracking-tight">Project Issue Manager</span>
      </div>

      <div className="bg-white p-8 rounded shadow-md w-full max-w-[400px] border border-[#DFE1E6]">
        <h2 className="text-base font-semibold text-[#5E6C84] text-center mb-6">Log in to your account</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full bg-[#FAFBFC] border border-[#DFE1E6] focus:bg-white focus:border-[#4C9AFF] focus:ring-2 focus:ring-blue-100 rounded px-3 py-2 outline-none text-sm transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full bg-[#FAFBFC] border border-[#DFE1E6] focus:bg-white focus:border-[#4C9AFF] focus:ring-2 focus:ring-blue-100 rounded px-3 py-2 outline-none text-sm transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-[#0052CC] hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors text-sm">
            Log in
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#DFE1E6] text-center text-sm text-[#5E6C84]">
          <Link to="/register" className="text-[#0052CC] hover:underline">Sign up for an account</Link>
        </div>
      </div>

      <footer className="mt-8 text-xs text-[#5E6C84]">
        <p>JiraClone • <span className="hover:underline cursor-pointer">Privacy Policy</span> • <span className="hover:underline cursor-pointer">User Notice</span></p>
      </footer>
    </div>
  );
}
