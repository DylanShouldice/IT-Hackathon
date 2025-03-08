import React, { useState } from "react";
import axios from "axios";
const Login = ({ setIsLoggedin, setIsRegistered }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        formData
      );

      if (response.status === 200) {
        alert("Login Successful!");
        setIsLoggedin(true);
      } else {
        alert("Login Failed!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login Failed!");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 relative">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('/background_register.jpg')]"></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-transparent"></div>

        <div className="flex flex-col items-center justify-center w-full h-full z-10 relative">
          <h1 className="text-white text-4xl font-bold">HealthPal</h1>
          <p className="text-white mt-4 text-lg text-left mx-5">
            Welcome back! Access your personalized meal plans and nutrition
            tips.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6 bg-gradient-to-br from-white to-gray-50">
        <div className="w-full max-w-md sm:max-w-2xl px-8 py-10 bg-white rounded-2xl shadow-lg">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-indigo-600">HealthPal</h1>
            <p className="text-gray-600 mt-2 text-sm">
              Your personal nutrition assistant
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in to continue your health journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  aria-required="true"
                />
              </div>
              <div className="flex justify-end mt-1">
                <a
                  href="#"
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 mt-6"
              aria-label="Sign in to your account"
            >
              Sign In
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegistered(false)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:underline transition-colors duration-200"
                >
                  Create account
                </button>
              </p>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-800 underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-800 underline"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
