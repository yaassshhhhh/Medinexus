import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Shield, Check } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, darkMode } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      if (data.success) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-reset-otp`, { email, otp });
      if (data.success) {
        toast.success("OTP verified!");
        setStep(3);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, { email, otp, newPassword });
      if (data.success) {
        toast.success("Password reset successful!");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-300/30">
            <Shield size={26} className="text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-8 shadow-2xl ${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white border-gray-100"}`}
        >
          {/* Back button */}
          <button
            onClick={() => navigate("/login")}
            className={`flex items-center gap-2 text-sm font-medium mb-6 ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          >
            <ArrowLeft size={16} /> Back to Login
          </button>

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOTP}>
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>Forgot Password?</h2>
              <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Enter your email and we'll send you an OTP to reset your password
              </p>

              <div className="mb-6">
                <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                      darkMode ? "bg-gray-700/60 border-gray-600 text-gray-100 placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-300/40 hover:shadow-indigo-400/50 transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>Verify OTP</h2>
              <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Enter the 6-digit code sent to {email}
              </p>

              <div className="mb-6">
                <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-center tracking-widest font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                    darkMode ? "bg-gray-700/60 border-gray-600 text-gray-100 placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-300/40 hover:shadow-indigo-400/50 transition-all disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className={`w-full mt-3 py-2 text-sm font-medium ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
              >
                Resend OTP
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={24} className="text-green-600" />
                </div>
              </div>
              <h2 className={`text-2xl font-bold mb-2 text-center ${darkMode ? "text-gray-100" : "text-gray-900"}`}>Set New Password</h2>
              <p className={`text-sm mb-6 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Create a strong password for your account
              </p>

              <div className="mb-6">
                <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                    darkMode ? "bg-gray-700/60 border-gray-600 text-gray-100 placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400"
                  }`}
                />
                <p className={`text-xs mt-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Must be at least 8 characters long
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-300/40 hover:shadow-indigo-400/50 transition-all disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
