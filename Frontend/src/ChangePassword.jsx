import React, { useContext, useRef } from "react";
import { useSearchParams } from "react-router";
import { AppContext } from "./context/AppContext";
import { toast } from "react-toastify";
import ShowPassword from "./components/ShowPassword";

export default function ChangePassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { user } = useContext(AppContext);

  const currentRef = useRef();
  const newRef = useRef();
  const confirmRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    const currentPass = token == null ? currentRef.current.value : "";
    const newPass = newRef.current.value;
    const confirmPass = confirmRef.current.value;

    if (newPass !== confirmPass) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const payload = {
      current_pass: currentPass,
      new_pass: newPass,
      confirm_pass: confirmPass,
      token,
      user_id: user.user_id,
    };

    const changePassPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("http://localhost:8000/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        const data = await response.json();

        if (response.status === 200) {
          resolve(data);
        } else {
          reject(data.message || "Password change failed");
        }
      } catch (err) {
        reject("Something went wrong. Please try again.");
      }
    });

    toast.promise(
      changePassPromise,
      {
        pending: "Changing password...",
        success: "Password changed.",
        error: {
          render({ data }) {
            return data || "Failed to change password";
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

    if (currentRef.current) currentRef.current.value = "";
    newRef.current.value = "";
    confirmRef.current.value = "";
  }

  return (
    <div className="bg-gray-200 h-screen w-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-[500px] h-[600px] px-4">
        <div className="flex items-center">
          <img
            src="/logo1.png"
            alt="My Expense Tracker"
            className="h-30 w-30"
          />
        </div>

        <h3 className="text-xl font-semibold mb-2 pl-4">
          Change your password
        </h3>
        <p className="text-gray-600 text-xs mb-4 pl-4">
          Enter a new password below to change your password
        </p>

        <form className="space-y-4 px-4">
          {!token && (
            <ShowPassword ref={currentRef} placeholder="Current Password" />
          )}
          <ShowPassword ref={newRef} placeholder="New Password" />
          <ShowPassword ref={confirmRef} placeholder="Re-type Password" />
          <button
            type="submit"
            className="mt-4 w-full bg-teal-700 shadow-lg shadow-gray-500/50 text-sm text-white rounded-sm py-1 mb-1.5 hover:bg-teal-600 transition cursor-pointer"
            onClick={handleSubmit}
          >
            Change Password
          </button>
          <div className="flex items-center justify-center">
            <a className="mt-4 font-semibold text-sm" href="/dashboard">
              Back to Dashboard
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
