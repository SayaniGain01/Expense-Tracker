import React from "react";
import { Link } from "react-router-dom";
import logo from "/logo1.png";
import image from "/image.png";
import feature1 from "/feature1.png";
import feature2 from "/feature2.png";
import feature3 from "/feature3.png";
import feature4 from "/feature4.png";
import work1 from "/work1.png";
import work2 from "/work2.png";
import work3 from "/work3.png";

export default function Home() {
  return (
    <div className="font-sans text-gray-800">
      <img src={logo} alt="logo" className="h-30 px-4 lg:px-10" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-12 lg:py-6 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug md:leading-tight mb-4">
            Track Your Expenses,
            <br className="hidden sm:block" /> Take Control of Your Finances
          </h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
            Easily manage your daily expenses, visualize your spending, and
            achieve your savings goals.
          </p>
          <Link to="/login">
            <button className="bg-teal-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-md font-semibold hover:bg-teal-700 transition text-sm sm:text-base">
              Get Started →
            </button>
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={image}
            alt="dashboard"
            className="w-10/12 sm:w-full max-w-md h-auto"
          />
        </div>
      </section>

      <section className="bg-gray-50 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
          Features
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 text-center">
          <div>
            <img
              src={feature1}
              alt="Feature 1"
              className="mx-auto mb-2 sm:mb-3 w-10 sm:w-14 h-auto"
            />
            <p className="font-semibold text-sm sm:text-base">
              Expense Analytics
            </p>
          </div>
          <div>
            <img
              src={feature2}
              alt="Feature 2"
              className="mx-auto mb-2 sm:mb-3 w-10 sm:w-14 h-auto"
            />
            <p className="font-semibold text-sm sm:text-base">
              Budget Planning
            </p>
          </div>
          <div>
            <img
              src={feature3}
              alt="Feature 3"
              className="mx-auto mb-2 sm:mb-3 w-10 sm:w-14 h-auto"
            />
            <p className="font-semibold text-sm sm:text-base">
              Smart Reminders
            </p>
          </div>
          <div>
            <img
              src={feature4}
              alt="Feature 4"
              className="mx-auto mb-2 sm:mb-3 w-10 sm:w-14 h-auto"
            />
            <p className="font-semibold text-sm sm:text-base">
              Secure & Private
            </p>
          </div>
        </div>
      </section>

      
      <section className="py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
          How It Works
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 text-center">
          <div>
            <img
              src={work1}
              alt="Sign Up"
              className="mx-auto mb-2 sm:mb-3 w-12 sm:w-16 h-auto"
            />
            <p className="font-semibold text-base sm:text-lg">Sign Up</p>
            <p className="text-gray-600 text-xs sm:text-sm">
              Create an account
            </p>
          </div>
          <div>
            <img
              src={work2}
              alt="Add Expenses"
              className="mx-auto mb-2 sm:mb-3 w-12 sm:w-16 h-auto"
            />
            <p className="font-semibold text-base sm:text-lg">Add Expenses</p>
            <p className="text-gray-600 text-xs sm:text-sm">
              Log your daily spending
            </p>
          </div>
          <div>
            <img
              src={work3}
              alt="Track Growth"
              className="mx-auto mb-2 sm:mb-3 w-12 sm:w-16 h-auto"
            />
            <p className="font-semibold text-base sm:text-lg">Track Growth</p>
            <p className="text-gray-600 text-xs sm:text-sm">
              See reports & insights
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-10 sm:py-14 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
          Ready to take charge of your money?
        </h2>
        <div className="flex justify-center gap-3 sm:gap-4">
          <Link to="/login">
            <button className="border border-teal-600 text-teal-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-md font-semibold hover:bg-teal-50 transition text-sm sm:text-base">
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button className="bg-teal-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-md font-semibold hover:bg-teal-700 transition text-sm sm:text-base">
              Sign Up
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
