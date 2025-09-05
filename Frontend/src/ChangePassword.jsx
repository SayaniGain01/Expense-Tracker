import React, { useContext, useRef } from "react";
import {useSearchParams} from "react-router";
import { AppContext } from "./context/AppContext";


export default function ChangePassword() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {user} = useContext(AppContext)

  const currentRef=useRef()
  const newRef=useRef()
  const confirmRef=useRef()

async function handleSubmit(e){
  e.preventDefault()
  const currentPass=token == null ? currentRef.current.value:""
  const newPass= newRef.current.value
  const confirmPass= confirmRef.current.value

  if (newPass != confirmPass) {
      alert("Password doesn't match");
      return;
    }

  const payload={
    current_pass:currentPass,
    new_pass:newPass,
    confirm_pass:confirmPass,
    token,
    user_id:user.user_id
  }
  console.log(token)
  
  const result= await fetch("http://localhost:8000/change-password",{
    method:"POST",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    credentials: "include"
  })
  
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
          {!token && <input
            type="password"
            placeholder="Current Password"
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            ref={currentRef}
          />}
          <input
            type="password"
            placeholder="New Password"
            className="w-full border rounded-md px-4 py-2 text-md
            focus:outline-none focus:ring-2 focus:ring-teal-500"
            ref={newRef}
          />
          <input
            type="password"
            placeholder="Re-type Password"
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            ref={confirmRef}
          />
          <button
            type="submit"
            className="mt-8 w-full bg-teal-700 shadow-lg shadow-gray-500/50 text-sm text-white rounded-sm py-1 mb-1.5 hover:bg-teal-600 transition cursor-pointer"
            onClick={handleSubmit}
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
