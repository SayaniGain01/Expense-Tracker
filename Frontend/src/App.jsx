import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import SignUp from './Signup'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);


  return (
    <div className="flex h-screen">
      {/* left side */}
      <div className='w-1/2 bg-teal-700'></div>
      
      {/* right side */}
      <div className='w-1/2 flex justify-center items-center bg-white'>
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default App
