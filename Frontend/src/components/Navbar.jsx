import React,{useContext} from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Navbar() {
  const {user}= useContext(AppContext)
  return (
    <div>
      <nav className="bg-white h-18 shadow p-4 flex justify-between items-center">
        <div className=" w-30 h-30">
          <img src="logo1.png"alt="logo" />
        </div>
        <div className="flex items-center gap-6 px-6">
          <Link to="/dashboard">
            <div className="font-semibold hover:text-teal-600">Dashboard</div>
          </Link>
          <Link to="/profile">
            <div className="font-semibold hover:text-teal-600">Profile</div>
          </Link>
          <Link>
            <div className="font-semibold hover:text-red-600">Logout</div>
          </Link>
          <div className="flex rounded-full border-2 items-center gap-2 w-10 h-10">
            <img className="object-cover h-full w-full rounded-full" src={user.image || "/profile.png"} alt="Profile" />
          </div>
        </div>
      </nav>
    </div>
  );
}
