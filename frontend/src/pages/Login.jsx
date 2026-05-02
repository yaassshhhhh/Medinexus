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

/* ─── main component ─── */
const Login = () => {
  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);

  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
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
            className="w-full rounded-2xl p-8"
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
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
                  boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
                }}
              >
                {state === "Login" ? <LogIn size={16} /> : <UserPlus size={16} />}
                {state === "Login" ? "Login" : "Create Account"}
              </button>
            </form>

            {/* divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="text-xs text-slate-500">or continue with</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-80"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Google G */}
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                  <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" fill="#FFC107"/>
                  <path d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00"/>
                  <path d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z" fill="#4CAF50"/>
                  <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C37 39.1 44 34 44 24c0-1.2-.1-2.4-.4-3.5z" fill="#1976D2"/>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-80"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Apple  */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

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
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* left */}
          <div className="flex items-center gap-3">
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
          <div className="flex items-center gap-4">
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
