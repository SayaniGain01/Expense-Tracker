import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

function Login() {
  const navigate=useNavigate()
  const emailRef = useRef();
  const passwordRef = useRef();
  async function handleLogin(e) {
    e.preventDefault()
    const email=emailRef.current.value
    const password=passwordRef.current.value
    const payload={email,password}
    try{
    const response= await fetch("http://localhost:8000/auth/login",{
        method:"POST",
        headers:{
            "Content-Type": "application/json",   
        },
        body:JSON.stringify(payload),
        credentials: "include"
    })
    const data=await response.json()
    console.log(data)
    if (response.status===200){
      navigate("/dashboard")
    }
  }
  catch(err){
    alert("Something went wrong.")
  }
}
function togglePassword() {
    const input = passwordRef.current;
    input.type = input.type === "password" ? "text" : "password";
  }
  return (
    <div className="flex h-screen">
      <div className='w-1/2 bg-teal-700'></div>
      <div className='w-1/2 flex justify-center items-center bg-white'>
        <div className="flex flex-col bg-white">
          <img src="logo1.png" alt="logo" className="w-50 h-50" />
          <form className="flex flex-col">
            <input
              className="border border-gray-500 rounded-sm mb-5 p-1.5 text-sm w-64 mx-6"
              type="email"
              id="email"
              placeholder="Email"
              ref={emailRef}
            />
            <input
              className="border border-gray-500 rounded-sm mb-8 p-1.5 text-sm w-64 mx-6"
              type="password"
              id="password"
              placeholder="Password"
              ref={passwordRef}
            />
            
            <button
              className="w-64 mx-6 bg-teal-700 shadow-lg shadow-gray-500/50 text-sm text-white rounded-sm py-1 mb-1.5 hover:bg-teal-600 transition cursor-pointer"
              onClick={handleLogin}
            >
              Log In
            </button>
            <Link
              className="text-xs mb-5 text-teal-700 cursor-pointer text-center "
              to="/forgot-password"
            >
              Forgot Password?
            </Link>
            <Link to="/signup">
              <button className="w-64 mx-6 ring-2 ring-gray-600/50 cursor-pointer rounded-sm py-1 text-sm text-gray-600 hover:bg-gray-400 hover:text-white transition">
                Create New Account
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;
