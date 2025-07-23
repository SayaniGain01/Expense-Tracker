import { Link } from "react-router-dom";
import { useRef } from "react";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  async function handleLogin(e) {
    e.preventDefault()
    const email=emailRef.current.value
    const password=passwordRef.current.value
    const payload={email,password}
    const response= await fetch("http://localhost:8000/auth/login",{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            
        },credentials: "include",
        body:JSON.stringify(payload)
    })
    const data=await response.json()
    console.log(data)
  }
  return (
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
          className="w-64 mx-6 bg-teal-700 shadow-lg shadow-gray-500/50 text-sm text-white rounded-sm py-1 mb-1.5 cursor-pointer"
          onClick={handleLogin}
        >
          Log In
        </button>

        <a
          className="text-xs mb-5 text-teal-700 cursor-pointer text-center "
          href="http://"
        >
          Forgot Password?
        </a>

        <Link to="/signup">
          <button className="w-64 mx-6 ring-2 ring-gray-600/50 cursor-pointer rounded-sm py-1 text-sm text-gray-600">
            Create New Account
          </button>
        </Link>
      </form>
    </div>
  );
}
export default Login;
