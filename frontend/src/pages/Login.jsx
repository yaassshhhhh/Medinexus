import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";

const Field = ({ label, icon: Icon, type, value, onChange, placeholder, darkMode }) => (
  <div className="w-full">
    <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</label>
    <div className="relative">
      <Icon size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
          darkMode ? "bg-gray-700/60 border-gray-600 text-gray-100 placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 hover:border-gray-300"
        }`}
      />
    </div>
  </div>
);

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);

  const { backendUrl, token, setToken, darkMode } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", { name, password, email });
        if (data.success) { localStorage.setItem("token", data.token); setToken(data.token); toast.success("Account created!"); }
        else toast.error(data.message);
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", { email, password });
        if (data.success) { localStorage.setItem("token", data.token); setToken(data.token); toast.success("Welcome back!"); }
        else toast.error(data.message);
      }
    } catch (error) { toast.error(error.message); }
  };

  useEffect(() => { if (token) navigate("/"); }, [token, navigate]);

  return (
    <div className={`min-h-[88vh] flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-300/30">
            <Shield size={26} className="text-white" />
          </div>
        </motion.div>

        <motion.form
          onSubmit={onSubmitHandler}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`rounded-2xl border p-8 shadow-2xl ${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white border-gray-100"}`}
        >
          {/* Tab switcher */}
          <div className={`flex rounded-xl p-1 mb-8 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            {["Sign Up", "Login"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setState(tab)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  state === tab
                    ? "bg-primary text-white shadow-md shadow-indigo-200/50"
                    : darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
              {state === "Sign Up" ? "Create your account" : "Welcome back"}
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {state === "Sign Up" ? "Join thousands of patients on MediNexus" : "Sign in to manage your appointments"}
            </p>
          </div>

          <div className="space-y-4">
            {state === "Sign Up" && (
              <Field label="Full Name" icon={User} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. John Doe" darkMode={darkMode} />
            )}
            <Field label="Email Address" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" darkMode={darkMode} />

            {/* Password with toggle */}
            <div className="w-full">
              <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Password</label>
              <div className="relative">
                <Lock size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                    darkMode ? "bg-gray-700/60 border-gray-600 text-gray-100 placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 hover:border-gray-300"
                  }`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Forgot Password Link */}
          {state === "Login" && (
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className={`text-xs font-semibold hover:underline ${darkMode ? 'text-indigo-400' : 'text-primary'}`}
              >
                Forgot password?
              </button>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-primary to-indigo-600 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-300/40 hover:shadow-indigo-400/50 transition-all flex items-center justify-center gap-2 group"
          >
            {state === "Sign Up" ? "Create Account" : "Sign In"}
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          <p className={`text-center text-sm mt-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {state === "Sign Up" ? "Already have an account? " : "Don't have an account? "}
            <button type="button" onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")} className="text-primary font-semibold hover:underline">
              {state === "Sign Up" ? "Sign in" : "Sign up free"}
            </button>
          </p>
        </motion.form>

        <p className={`text-center text-xs mt-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
          By continuing, you agree to our Terms of Service & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
