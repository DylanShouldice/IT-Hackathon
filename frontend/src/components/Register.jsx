import React, { useState } from "react";
import axios from "axios";

const RegisterForm = ({ setIsRegistered }) => {
  // Initialize form data state
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
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('background_register.jpg')",
        }}
      >
        <div className="flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-50">
          <h1 className="text-white text-4xl font-bold">NutritionBuddy</h1>
          <p className="text-white mt-4 text-lg text-center">
            We empower you to live a healthier lifestyle with delicious free
            meal recipes and planning guides.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
              />
            </div>
            <div>
              <label
                htmlFor="height"
                className="block text-sm font-medium text-gray-700"
              >
                Height (in cm)
              </label>
              <input
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="Height"
              />
            </div>
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700"
              >
                Age
              </label>
              <input
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Age"
              />
            </div>
            <div>
              <label
                htmlFor="allergies"
                className="block text-sm font-medium text-gray-700"
              >
                Allergies
              </label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
              >
                <option value="">Select your allergies</option>
                <option value="none">None</option>
                <option value="peanuts">Peanuts</option>
                <option value="dairy">Dairy</option>
                <option value="gluten">Gluten</option>
                <option value="soy">Soy</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="diet"
                className="block text-sm font-medium text-gray-700"
              >
                Diet
              </label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="diet"
                name="diet"
                value={formData.diet}
                onChange={handleInputChange}
              >
                <option value="">Select your diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="paleo">Paleo</option>
                <option value="keto">Keto</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
            <div className="mt-3 text-center">
              <p>
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={() => setIsRegistered(true)}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
