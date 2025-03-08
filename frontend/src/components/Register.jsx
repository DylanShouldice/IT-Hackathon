import React, { useState } from "react";
import axios from "axios";

const RegisterForm = ({ setIsRegistered }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    height: "",
    age: "",
    allergies: "",
    diet: "",
    gender: "",
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
        "http://localhost:8080/register",
        formData
      );

      if (response.status === 200) {
        alert("Form Submitted Successfully!");
        setIsRegistered(true);
      } else {
        alert("Form Submission Failed!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Form Submission Failed!");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 relative">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('/background_register.jpg')]"></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-black bg-opacity-50"></div>
        <div className="flex flex-col items-center justify-center w-full h-full z-10 relative">
          <h1 className="text-white text-4xl font-bold">HealthPal</h1>
          <p className="text-white mt-4 text-lg text-left mx-5">
            We empower you to live a healthier lifestyle with delicious free
            meal recipes and planning guides.
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
            Create Account
          </h2>
          <p className="text-gray-600 mb-8">
            Join our community of health enthusiasts
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
                  placeholder="Create a strong password"
                  required
                  aria-required="true"
                  minLength="8"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="height"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Height (cm)
                </label>
                <input
                  type="number"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="175"
                  min="50"
                  max="300"
                />
              </div>

              {/* Age field */}
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age
                </label>
                <input
                  type="number"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="25"
                  min="13"
                  max="120"
                />
              </div>
            </div>

            {/* Allergies field */}
            <div>
              <label
                htmlFor="allergies"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Allergies
              </label>
              <select
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                aria-label="Select your allergies"
              >
                <option value="">Select your allergies</option>
                <option value="none">None</option>
                <option value="peanuts">Peanuts</option>
                <option value="dairy">Dairy</option>
                <option value="gluten">Gluten</option>
                <option value="soy">Soy</option>
              </select>
            </div>

            {/* Diet field */}
            <div>
              <label
                htmlFor="diet"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Diet Preference
              </label>
              <select
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                id="diet"
                name="diet"
                value={formData.diet}
                onChange={handleInputChange}
                aria-label="Select your diet preference"
              >
                <option value="">Select your diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="paleo">Paleo</option>
                <option value="keto">Keto</option>
                <option value="normal">No specific diet</option>
              </select>
            </div>

            {/* Gender field */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gender
              </label>
              <select
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                aria-label="Select your gender"
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 mt-6"
              aria-label="Register account"
            >
              Create My Account
            </button>

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegistered(true)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:underline transition-colors duration-200"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-gray-500">
          By creating an account, you agree to our{" "}
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

export default RegisterForm;
