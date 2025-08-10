import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import SignUp from './SignUp'
import Dashboard from './Dashboard';
import Profile from './Profile';
import './App.css';
import RootLayout from './RootLayout';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <Login /> },
        { path: 'signup', element: <SignUp /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'profile', element: <Profile /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

