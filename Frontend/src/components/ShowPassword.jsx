import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ShowPassword({ id = "password", placeholder = "Password", ref,mx}, ) {
  
  const [showPassword, setShowPassword] = useState(false);

  function togglePassword() {
    setShowPassword((prevState)=>!prevState);
  }

  return (
    <div className={`relative ${mx}`}>
      <input
        className={" border border-gray-500 rounded-sm p-1.5 text-sm w-full pr-10"}
        type={showPassword?"text":"password"}
        id={id}
        placeholder={placeholder}
        ref={ref}
      />
      {!showPassword ? (
        <FaEyeSlash
          className="absolute left-full top-1/2 -translate-y-1/2 -translate-x-[150%] cursor-pointer text-gray-600"
          onClick={togglePassword}
        />
      ) : (
        <FaEye
          className="absolute left-full top-1/2 -translate-y-1/2 -translate-x-[150%] cursor-pointer text-gray-600"
          onClick={togglePassword}
        />
      )}
    </div>
  );
}

export default ShowPassword;
