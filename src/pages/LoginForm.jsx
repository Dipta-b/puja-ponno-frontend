import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const { setUser } = React.useContext(AuthContext);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || "লগইন ব্যর্থ হয়েছে");
                return;
            }

            toast.success("লগইন সফল হয়েছে 🎉");
            setUser(result);
            console.log("USER:", result);

            reset();
            navigate("/");

        } catch (err) {
            console.error(err);
            toast.error("সার্ভার সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#f6f1e7]">

            {/* BACKGROUND EFFECTS (same as register) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f6f1e7] via-[#f3eadb] to-[#e9ddc8]" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200 blur-3xl opacity-30 rounded-full" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-200 blur-3xl opacity-20 rounded-full" />

            {/* LOGIN CARD */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative z-10 w-full max-w-md p-8 rounded-2xl
        bg-white/40 backdrop-blur-xl border border-white/40
        shadow-[0_20px_60px_rgba(0,0,0,0.1)] space-y-5"
            >

                {/* TITLE */}
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-[#5a3e1b] tracking-wider">
                        লগইন করুন
                    </h2>
                    <p className="text-sm text-gray-600">
                        আপনার একাউন্টে প্রবেশ করুন
                    </p>
                </div>

                {/* EMAIL */}
                <div>
                    <label className="text-sm text-gray-700">ইমেইল</label>
                    <input
                        type="email"
                        {...register("email", { required: "ইমেইল প্রয়োজন" })}
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40
            focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>

                {/* PASSWORD */}
                <div className="relative">
                    <label className="text-sm text-gray-700">পাসওয়ার্ড</label>

                    <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", { required: "পাসওয়ার্ড প্রয়োজন" })}
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-white/60 border border-white/40
            focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
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

                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                </div>

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold text-white
          bg-gradient-to-r from-yellow-500 to-orange-400
          shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                    {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                </button>

                {/* FOOTER TEXT */}
                <div className="text-center mt-4">
                    <Link to="/register" className="text-sm text-gray-600">
                        অ্যাকাউন্ট নেই? <span className="text-yellow-700 font-semibold cursor-pointer">রেজিস্টার করুন</span>
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;