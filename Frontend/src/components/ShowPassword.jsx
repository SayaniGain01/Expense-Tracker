import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ShowPassword({ id = "password", placeholder = "Password" }, ref) {
  const inputRef = ref || useRef();
  const [showPassword, setShowPassword] = useState(false);

  function togglePassword() {
    const input = inputRef.current;
    const newType = input.type === "password" ? "text" : "password";
    input.type = newType;
    setShowPassword(newType === "text");
  }

  return (
    <div className="relative w-64 mx-6 mb-8">
      <input
        className="border border-gray-500 rounded-sm p-1.5 text-sm w-full pr-10"
        type="password"
        id={id}
        placeholder={placeholder}
        ref={inputRef}
      />
      {showPassword ? (
        <FaEyeSlash
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
          onClick={togglePassword}
        />
      ) : (
        <FaEye
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
          onClick={togglePassword}
        />
      )}
    </div>
  );
}

export default ShowPassword;
