import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Calendar,
  Video,
  Shield,
  UserPlus,
  User,
  ArrowRight,
} from "lucide-react";

/* ─── tiny animated floating particles ─── */
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(18)].map((_, i) => (
      <span
        key={i}
        className="absolute rounded-full opacity-20"
        style={{
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          background: i % 2 === 0 ? "#6366f1" : "#818cf8",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 4}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        33% { transform: translateY(-18px) translateX(8px); }
        66% { transform: translateY(8px) translateX(-12px); }
      }
    `}</style>
  </div>
);

/* ─── glowing shield illustration ─── */
const ShieldIllustration = () => (
  <div className="relative flex items-center justify-center mt-6">
    {/* outer glow rings */}
    <div className="absolute w-52 h-52 rounded-full border border-indigo-500/20 animate-ping" style={{ animationDuration: "3s" }} />
    <div className="absolute w-40 h-40 rounded-full border border-indigo-400/30" />
    <div className="absolute w-28 h-28 rounded-full bg-indigo-600/10 blur-xl" />
    {/* platform glow */}
    <div className="absolute bottom-0 w-32 h-4 bg-indigo-500/30 blur-xl rounded-full" />
    {/* shield */}
    <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 100%)",
        border: "1.5px solid rgba(99,102,241,0.5)",
        boxShadow: "0 0 40px rgba(99,102,241,0.4), inset 0 0 20px rgba(99,102,241,0.1)",
      }}
    >
      <Shield size={44} className="text-indigo-400" strokeWidth={1.5} />
    </div>
    {/* small plus decorations */}
    {[
      { top: "10%", left: "15%", size: 14 },
      { top: "20%", right: "12%", size: 10 },
      { bottom: "18%", left: "20%", size: 10 },
    ].map((pos, i) => (
      <span
        key={i}
        className="absolute text-indigo-400/40 font-light select-none"
        style={{ ...pos, fontSize: pos.size }}
      >
        +
      </span>
    ))}
  </div>
);

/* ─── feature row ─── */
const Feature = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
      style={{
        background: "rgba(99,102,241,0.15)",
        border: "1px solid rgba(99,102,241,0.3)",
      }}
    >
      <Icon size={18} className="text-indigo-400" />
    </div>
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </div>
);

/* ─── password strength ─── */
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { label: '', color: '' },
    { label: 'Weak', color: '#ef4444' },
    { label: 'Fair', color: '#f59e0b' },
    { label: 'Good', color: '#3b82f6' },
    { label: 'Strong', color: '#22c55e' },
  ]
  return { score, ...map[score] }
}

/* ─── main component ─── */
const Login = () => {
  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", { name, password, email });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Account created!");
        } else toast.error(data.message);
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", { email, password });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Welcome back!");
        } else toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const inputBase =
    "w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-indigo-500/50";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  return (
    /* full-page dark background */
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #060b18 0%, #0d1230 50%, #060b18 100%)" }}
    >
      {/* ── main content ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* ── LEFT PANEL ── */}
          <div className="hidden lg:flex flex-col gap-8 relative">
            <Particles />
            <div>
              <h1 className="text-4xl font-bold text-white leading-tight">
                Welcome Back!
              </h1>
              <h2 className="text-4xl font-bold leading-tight mt-1">
                Glad to{" "}
                <span
                  className="font-bold"
                  style={{
                    background: "linear-gradient(90deg, #6366f1, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  see you again
                </span>
              </h2>
              <p className="text-slate-400 text-sm mt-4 leading-relaxed max-w-xs">
                Login to your account to book appointments, consult doctors and manage your health.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <Feature
                icon={Calendar}
                title="Easy Appointments"
                desc="Book and manage your appointments with ease."
              />
              <Feature
                icon={Video}
                title="Video Consultation"
                desc="Consult with experienced doctors from the comfort of your home."
              />
              <Feature
                icon={Shield}
                title="Secure & Private"
                desc="Your data is protected with advanced security and privacy."
              />
            </div>

            <ShieldIllustration />
          </div>

          {/* ── RIGHT PANEL — login card ── */}
          <div
            className="w-full rounded-2xl p-6 sm:p-8"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* heading */}
            <div className="text-center mb-7">
              <h3 className="text-2xl font-bold text-white">
                {state === "Login" ? "Login to Your Account" : "Create Your Account"}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                {state === "Login"
                  ? "Enter your credentials to continue"
                  : "Fill in the details to get started"}
              </p>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-5">
              {/* Name field — sign up only */}
              {state === "Sign Up" && (
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                      className={inputBase}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className={inputBase}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className={`${inputBase} pr-11`}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password strength — sign up only */}
                {state === "Sign Up" && password && (() => {
                  const { score, label, color } = getStrength(password)
                  return (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map(i => (
                          <div
                            key={i}
                            className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{ background: i <= score ? color : 'rgba(255,255,255,0.1)' }}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium" style={{ color }}>{label}</p>
                    </div>
                  )
                })()}

                {/* Forgot password */}
                {state === "Login" && (
                  <div className="text-right mt-2">
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
                style={{
                  background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
                  boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
                }}
              >
                {submitting ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : state === "Login" ? <LogIn size={16} /> : <UserPlus size={16} />}
                {submitting ? 'Please wait...' : state === "Login" ? "Login" : "Create Account"}
              </button>
            </form>

            {/* switch mode */}
            <p className="text-center text-sm text-slate-400 mt-6">
              {state === "Login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setState(state === "Login" ? "Sign Up" : "Login")}
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
              >
                {state === "Login" ? "Create Account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div
        className="w-full px-6 py-4"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col gap-4 text-center sm:text-left">
          {/* left */}
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(99,102,241,0.2)",
                border: "1px solid rgba(99,102,241,0.3)",
              }}
            >
              <Shield size={16} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Your Health, Our Priority</p>
              <p className="text-xs text-slate-500">
                We're here to provide you with the best medical care and support.
              </p>
            </div>
          </div>

          {/* right */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(99,102,241,0.2)",
                  border: "1px solid rgba(99,102,241,0.3)",
                }}
              >
                {/* headset icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
                  <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Need Help?</p>
                <p className="text-xs text-slate-500">Our support team is always here to help you.</p>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-300 transition-all hover:opacity-80 whitespace-nowrap"
              style={{
                border: "1px solid rgba(99,102,241,0.5)",
                background: "rgba(99,102,241,0.1)",
              }}
            >
              Contact Support
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
