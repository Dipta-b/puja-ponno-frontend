import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineArrowLeft,
  AiOutlineCheckCircle,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineSafety,
} from "react-icons/ai";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config/api";

function ForgotPassword() {
  const navigate = useNavigate();

  // Step state: 1 = Email Input, 2 = OTP Verification, 3 = New Password Input, 4 = Success Screen
  const [step, setStep] = useState(1);

  // Form data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timer state for resend OTP (60 seconds)
  const [cooldown, setCooldown] = useState(0);

  // Refs for OTP input fields
  const otpInputRefs = useRef([]);

  // Handle cooldown countdown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // STEP 1: Submit email to request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error("ইমেইল ঠিকানা দিন");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "OTP পাঠাতে ব্যর্থ হয়েছে");
        return;
      }

      if (data.demoOtp) {
        toast.success(`OTP তৈরি হয়েছে: ${data.demoOtp}`, { duration: 10000 });
        const otpDigits = String(data.demoOtp).split("");
        if (otpDigits.length === 6) {
          setOtp(otpDigits);
        }
      } else {
        toast.success(data.message || "আপনার ইমেইলে OTP পাঠানো হয়েছে");
      }

      setStep(2);
      setCooldown(60); // 60 seconds cooldown for resend
    } catch (err) {
      console.error(err);
      toast.error("সার্ভার সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP in Step 2
  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    const cleanEmail = email.trim().toLowerCase();

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "OTP পাঠাতে ব্যর্থ হয়েছে");
        return;
      }

      if (data.demoOtp) {
        toast.success(`নতুন OTP: ${data.demoOtp}`, { duration: 10000 });
        const otpDigits = String(data.demoOtp).split("");
        if (otpDigits.length === 6) {
          setOtp(otpDigits);
        }
      } else {
        toast.success("নতুন OTP আপনার ইমেইলে পাঠানো হয়েছে");
      }

      setCooldown(60);
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus();
      }
    } catch (err) {
      console.error(err);
      toast.error("সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  // OTP single field change handler
  const handleOtpChange = (index, value) => {
    // Only numeric input
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Take the last entered character if multiple typed
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input field
    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  // OTP Keydown (backspace handling)
  const handleOtpKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      otpInputRefs.current[index - 1]
    ) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  // Handle OTP Paste (e.g. pasting 123456)
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      if (otpInputRefs.current[5]) {
        otpInputRefs.current[5].focus();
      }
    }
  };

  // STEP 2: Submit OTP for verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const cleanOtp = otp.join("");
    if (cleanOtp.length !== 6) {
      toast.error("সঠিক ৬ সংখ্যার ওটিপি কোড লিখুন");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: cleanOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "ওটিপি যাচাই ব্যর্থ হয়েছে");
        return;
      }

      toast.success("ওটিপি সফলভাবে যাচাই হয়েছে 🎉");
      setResetToken(data.resetToken);
      setStep(3);
    } catch (err) {
      console.error(err);
      toast.error("সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Submit new password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 8) {
      toast.error("পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("পাসওয়ার্ড দুটি মিলছে না");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          resetToken,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে");
        return;
      }

      toast.success(data.message || "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");
      setStep(4);
    } catch (err) {
      console.error(err);
      toast.error("সার্ভার সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#f6f1e7] py-12 px-4">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f6f1e7] via-[#f3eadb] to-[#e9ddc8]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200 blur-3xl opacity-30 rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-200 blur-3xl opacity-20 rounded-full" />

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
        {/* STEP PROGRESS INDICATOR */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${step >= 1
              ? "bg-gradient-to-r from-yellow-500 to-orange-400 text-white shadow-md"
              : "bg-gray-200 text-gray-500"
              }`}
          >
            1
          </div>
          <div
            className={`w-10 h-1 transition-all duration-300 ${step >= 2 ? "bg-orange-400" : "bg-gray-200"
              }`}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${step >= 2
              ? "bg-gradient-to-r from-yellow-500 to-orange-400 text-white shadow-md"
              : "bg-gray-200 text-gray-500"
              }`}
          >
            2
          </div>
          <div
            className={`w-10 h-1 transition-all duration-300 ${step >= 3 ? "bg-orange-400" : "bg-gray-200"
              }`}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${step >= 3
              ? "bg-gradient-to-r from-yellow-500 to-orange-400 text-white shadow-md"
              : "bg-gray-200 text-gray-500"
              }`}
          >
            3
          </div>
        </div>

        {/* STEP 1: REQUEST OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-5">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-yellow-100/80 flex items-center justify-center text-yellow-700 mb-3 shadow-inner">
                <AiOutlineMail size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-[#5a3e1b] tracking-wide">
                পাসওয়ার্ড পুনরুদ্ধার
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                আপনার একাউন্টের নিবন্ধিত ইমেইল এড্রেস লিখুন। আমরা ৬ ডিজিটের OTP
                কোড পাঠাব।
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ইমেইল এড্রেস
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-400 shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
            >
              {loading ? "ওটিপি পাঠানো হচ্ছে..." : "ওটিপি কোড পাঠান"}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-yellow-800 transition-colors"
              >
                <AiOutlineArrowLeft className="mr-1" /> লগইন পেজে ফিরুন
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-orange-100/80 flex items-center justify-center text-orange-700 mb-3 shadow-inner">
                <AiOutlineSafety size={26} />
              </div>
              <h2 className="text-2xl font-semibold text-[#5a3e1b] tracking-wide">
                ওটিপি কোড যাচাই
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold text-gray-800">{email}</span>{" "}
                ঠিকানায় ৬ সংখ্যার OTP পাঠানো হয়েছে।
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-yellow-700 underline mt-1 hover:text-yellow-900 cursor-pointer"
              >
                ইমেইল ভুল হয়েছে? পরিবর্তন করুন
              </button>
            </div>

            <div>
              <label className="block text-center text-sm font-medium text-gray-700 mb-3">
                ৬ ডিজিটের OTP দিন
              </label>
              <div
                className="flex justify-between gap-2"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-xl font-bold rounded-xl bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner text-gray-800"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-400 shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
            >
              {loading ? "যাচাই করা হচ্ছে..." : "ওটিপি যাচাই করুন"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                disabled={cooldown > 0 || loading}
                onClick={handleResendOTP}
                className="text-sm text-yellow-700 font-medium hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
              >
                {cooldown > 0
                  ? `নতুন OTP পাঠান (${cooldown} সেঃ)`
                  : "আবার OTP পাঠান"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-yellow-100/80 flex items-center justify-center text-yellow-700 mb-3 shadow-inner">
                <AiOutlineLock size={26} />
              </div>
              <h2 className="text-2xl font-semibold text-[#5a3e1b] tracking-wide">
                নতুন পাসওয়ার্ড সেট করুন
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                আপনার নতুন পাসওয়ার্ডটি লিখুন (কমপক্ষে ৮ অক্ষর)।
              </p>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                নতুন পাসওয়ার্ড
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner text-gray-800"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
              >
                {showPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </span>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner text-gray-800"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
              >
                {showConfirmPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-400 shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
            >
              {loading ? "সেভ হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS SCREEN */}
        {step === 4 && (
          <div className="text-center space-y-5 py-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-md">
              <AiOutlineCheckCircle size={40} />
            </div>

            <h2 className="text-2xl font-bold text-[#5a3e1b]">
              পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! 🎉
            </h2>

            <p className="text-sm text-gray-600">
              আপনার পাসওয়ার্ড রিসেট সম্পন্ন হয়েছে। আপনি এখন নতুন পাসওয়ার্ড দিয়ে
              লগইন করতে পারেন।
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-400 shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              লগইন পেজে যান
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
