import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
const navigate= useNavigate()
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const retypePasswordRef = useRef();
  async function handleSignup(e) {
    e.preventDefault();
    const username = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const retype = retypePasswordRef.current.value;
    if (password != retype) {
      alert("Password doesn't match");
      return;
    }
    const payload = { name:username, email, password };
    try{
    const response = await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    if (response.status===200){
        navigate("/")
    }
  }
  catch(err){
    alert("Something went wrong!")
  }
}

  return (
    <div className="flex h-screen">
        <div className='w-1/2 bg-teal-700'></div>
        <div className='w-1/2 flex justify-center items-center bg-white'>
            <div className="flex flex-col bg-white">
              <img src="logo1.png" alt="logo1" className="w-50 h-50" />
              <form className="flex flex-col">
                <input
                  className="border border-gray-500 rounded-sm mb-5 p-1.5 text-sm w-64 mx-6"
                  type="name"
                  id="name"
                  placeholder="Name"
                  ref={nameRef}
                />
                <input
                  className="border border-gray-500 rounded-md mb-5 p-1.5 text-sm w-64 mx-6"
                  id="email"
                  type="email"
                  placeholder="Email"
                  ref={emailRef}
                />
                <input
                  className="border border-gray-500 rounded-md mb-5 p-1.5 text-sm w-64 mx-6"
                  id="password"
                  type="password"
                  placeholder="Enter New Password"
                  ref={passwordRef}
                />
                <input
                  className="border border-gray-500 rounded-md mb-8 p-1.5 text-sm w-64 mx-6"
                  id="password"
                  type="password"
                  placeholder="Retype Password"
                  ref={retypePasswordRef}
                />
                <button
                  className="w-64 mx-6 bg-teal-700 shadow-lg shadow-gray-500/50 text-sm text-white rounded-sm py-1 mb-1.5 hover:bg-teal-600 cursor-pointer"
                  onClick={handleSignup}
                >
                  Sign Up
                </button>
              </form>
            </div>
        </div>
    </div>
  );
}
export default SignUp;
