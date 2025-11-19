import React, { useRef } from "react";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const emailRef = useRef();

  async function handleEmailLink(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const payload = { email };

    // Show toast.promise just like in login & signup
    toast.promise(
      fetch("http://localhost:8000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      }).then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to send reset link");
        }
        return res.json();
      }),
      {
        pending: "Sending reset link...",
        success: "Password reset link sent successfully!",
        error: {
          render({ data }) {
            return data.message || "Something went wrong!";
          },
        },
      },
      {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
      }
    );
  }

  return (
    <div className="bg-gray-200 h-screen w-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-[500px] h-[550px] px-4">
        <div className="flex items-center">
          <img
            src="/logo1.png"
            alt="My Expense Tracker"
            className="h-30 w-30"
          />
        </div>

        <h2 className="text-xl font-semibold mb-2 pl-4">Forgot Password</h2>
        <p className="text-gray-600 text-xs mb-8 pl-4">
          Please enter the email address you’d like your password reset
          information sent to
        </p>

        <form className="space-y-4 px-4">
          <h2 className="text-xs text-gray-600 font-semibold">
            Enter Email Address
          </h2>
          <input
            type="email"
            placeholder=" "
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            ref={emailRef}
          />
          <button
            type="submit"
            className="mt-6 w-full bg-teal-700 shadow-lg shadow-gray-500/50 text-sm text-white rounded-sm py-1 mb-4 hover:bg-teal-600 transition cursor-pointer"
            onClick={handleEmailLink}
          >
            Request reset link
          </button>
        </form>

        <div className="flex items-center justify-center">
          <a className="font-semibold text-sm " href="/">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
