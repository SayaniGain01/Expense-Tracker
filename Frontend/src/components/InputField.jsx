import React, { useEffect } from "react";

export default function InputField({label,type,id,value,ref}) {
  function handleChange(e){
    ref.current.value=e.target.value
  }
  useEffect(()=>{
    if (ref.current!=null){
      ref.current.value=value || ""
    }
  },[ref.current?.value])
  return (
    <div className="relative">
      <label htmlFor={id} className="absolute text-xs left-8 text-gray-500">
        {label}
      </label>
      <input
        className="border border-gray-500 rounded-sm mb-4 p-1.5 text-sm w-64 mx-6 pt-3"
        id={id}
        type={type}
        ref={ref}
        onChange={handleChange}
      />
    </div>
  );
}
