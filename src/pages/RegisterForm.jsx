import React, { useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
        return;
      }

      setRegisteredUser(result);
      setIsOpen(true);
      reset();

    } catch (err) {
      console.error(err);
      alert("সার্ভার সমস্যা হয়েছে");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f1e7] relative overflow-hidden">

      {/* background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f6f1e7] via-[#f3eadb] to-[#e9ddc8]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200 blur-3xl opacity-30 rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-200 blur-3xl opacity-20 rounded-full" />

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl 
        bg-white/40 backdrop-blur-xl border border-white/40
        shadow-xl space-y-4"
      >

        <h2 className="text-center text-2xl font-semibold text-[#5a3e1b]">
          রেজিস্টার করুন
        </h2>

        {/* NAME */}
        <input
          placeholder="নাম"
          {...register("name", { required: true })}
          className="w-full p-3 rounded-xl bg-white/60"
        />
        {errors.name && <p className="text-red-500">নাম প্রয়োজন</p>}

        {/* EMAIL */}
        <input
          placeholder="ইমেইল"
          {...register("email", { required: true })}
          className="w-full p-3 rounded-xl bg-white/60"
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="পাসওয়ার্ড"
            {...register("password", { required: true })}
            className="w-full p-3 rounded-xl bg-white/60 pr-10"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>

        {/* ROLE */}
        <select
          {...register("role")}
          className="w-full p-3 rounded-xl bg-white/60"
        >
          <option value="user">ইউজার</option>
          <option value="admin">অ্যাডমিন</option>
        </select>

        {/* IMAGE */}
        <input
          placeholder="Image URL"
          {...register("image")}
          className="w-full p-3 rounded-xl bg-white/60"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-400 text-white font-semibold"
        >
          রেজিস্টার করুন
        </button>

        {/* FOOTER TEXT */}
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-gray-600">
            অ্যাকাউন্ট আছে?{" "}
            <span className="text-yellow-700 font-semibold cursor-pointer">
              লগইন করুন
            </span>
          </Link>
        </div>

      </form>

      {/* MODAL */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" />

          <div className="fixed inset-0 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-xl text-center">

              <h2 className="text-lg font-bold">
                🎉 সফলভাবে রেজিস্ট্রেশন হয়েছে
              </h2>

              <p>স্বাগতম, {registeredUser?.name}</p>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
              >
                ঠিক আছে
              </button>

            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
}

export default RegisterForm;