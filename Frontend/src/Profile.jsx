import React, { useContext, useRef } from "react";
import Navbar from "./components/Navbar";
import InputField from "./components/InputField";
import { AppContext } from "./context/AppContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(AppContext);

  const imageRef = useRef();
  const emailRef = useRef();
  const nameRef = useRef();
  const phoneRef = useRef();
  const fileRef = useRef();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      imageRef.current.src = URL.createObjectURL(file);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const formData = new FormData();
    const file=fileRef.current.files[0]||imageRef.current.src
    formData.append("name", nameRef.current.value);
    formData.append("email", emailRef.current.value);
    formData.append("phone", phoneRef.current.value);
    formData.append("file", file);
    try{
      const response = await fetch("http://localhost:8000/user", {
      method: "PUT",
      body: formData,
      credentials: "include",
    });
  }
  catch(err){
    alert("Something went wrong")
    console.log(err)
  }
  }

  return (
    <div className="bg-gray-200 h-screen w-screen">
      <Navbar />
      <div className="flex justify-center mt-20 w-full">
        <div className="flex flex-col items-center bg-white p-5 px-30 rounded-2xl pt-15 relative">
          <div className="w-25 h-25 absolute -top-12 border-6 border-white rounded-full">
            <img
              className="object-cover h-full w-full rounded-full"
              ref={imageRef}
              src={user.image || "profile.png"}
              alt="pfp"
            />
            <input
              onChange={handleFileChange}
              className="absolute top-0 h-full w-full opacity-0 cursor-pointer "
              type="file"
              ref={fileRef}
            />
          </div>

          <InputField
            value={user.user_name}
            label={"Full Name*"}
            type={"text"}
            id={"fname"}
            ref={nameRef}
          />
          <InputField
            value={user.email_id}
            label={"Email*"}
            type={"email"}
            id={"email"}
            ref={emailRef}
          />
          <InputField
            value={user.phone}
            label={"Phone No."}
            type={"phone"}
            id={"phone"}
            ref={phoneRef}
          />
          <Link
            className="text-xs text-teal-700 cursor-pointer text-center "
            to="http://"
          >
            Change Password?
          </Link>

          <button
            className="mt-4 w-64 mx-6 bg-teal-700 shadow-lg shadow-gray-500/50 text-sm text-white rounded-sm py-1 mb-1.5 hover:bg-teal-600 transition cursor-pointer"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
