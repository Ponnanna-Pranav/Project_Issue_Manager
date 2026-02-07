import { useState } from "react";
import { api } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "DEVELOPER"
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Registration failed. Email might already be taken.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] px-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 text-[#172B4D]">
        <Layout className="w-8 h-8 text-[#0052CC]" />
        <span className="text-2xl font-bold tracking-tight">JiraClone</span>
      </div>

      <div className="bg-white p-8 rounded shadow-md w-full max-w-[400px] border border-[#DFE1E6]">
        <h2 className="text-base font-semibold text-[#5E6C84] text-center mb-6">Sign up for your account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              className="w-full bg-[#FAFBFC] border border-[#DFE1E6] focus:bg-white focus:border-[#4C9AFF] focus:ring-2 focus:ring-blue-100 rounded px-3 py-2 outline-none text-sm transition-all"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="w-full bg-[#FAFBFC] border border-[#DFE1E6] focus:bg-white focus:border-[#4C9AFF] focus:ring-2 focus:ring-blue-100 rounded px-3 py-2 outline-none text-sm transition-all"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full bg-[#FAFBFC] border border-[#DFE1E6] focus:bg-white focus:border-[#4C9AFF] focus:ring-2 focus:ring-blue-100 rounded px-3 py-2 outline-none text-sm transition-all"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <select
              name="role"
              className="w-full bg-[#FAFBFC] border border-[#DFE1E6] focus:bg-white focus:border-[#4C9AFF] focus:ring-2 focus:ring-blue-100 rounded px-3 py-2 outline-none text-sm transition-all cursor-pointer"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="DEVELOPER">Developer</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button className="w-full bg-[#0052CC] hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors text-sm">
            Sign up
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#DFE1E6] text-center text-sm text-[#5E6C84]">
          <Link to="/" className="text-[#0052CC] hover:underline">Already have an account? Log in</Link>
        </div>
      </div>
    </div>
  );
}
