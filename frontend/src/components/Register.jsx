import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
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
      } else {
        alert("Form Submission Failed!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Form Submission Failed!");
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="#">
              <span className="sr-only">Home</span>
              <svg
                className="h-8 sm:h-10"
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.474..." />
              </svg>
            </a>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to NutritionBuddy
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              We empower you to live a healthier lifestyle with delicious free
              meal recipes and planning guides.
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <form
              onSubmit={handleSubmit}
              className="form w-full max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg"
            >
              <fieldset className="fieldset p-4">
                <legend className="fieldset-legend text-xl font-semibold mb-4">
                  Register
                </legend>

                <div className="form-group mb-4">
                  <label className="fieldset-label block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input w-full p-3 border border-gray-300 rounded-lg"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="fieldset-label block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    className="input w-full p-3 border border-gray-300 rounded-lg"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="fieldset-label block text-sm font-medium text-gray-700">
                    Height (in cm)
                  </label>
                  <input
                    type="number"
                    className="input w-full p-3 border border-gray-300 rounded-lg"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="Height"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="fieldset-label block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    className="input w-full p-3 border border-gray-300 rounded-lg"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Age"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="fieldset-label block text-sm font-medium text-gray-700">
                    Allergies
                  </label>
                  <select
                    className="select w-full p-3 border border-gray-300 rounded-lg"
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

                <div className="form-group mb-4">
                  <label className="fieldset-label block text-sm font-medium text-gray-700">
                    Diet
                  </label>
                  <select
                    className="select w-full p-3 border border-gray-300 rounded-lg"
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

                <div className="form-group mb-4">
                  <label className="fieldset-label block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    className="select w-full p-3 border border-gray-300 rounded-lg"
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

                <div className="form-group mt-6">
                  <button
                    type="submit"
                    className="button w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Register
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default RegisterForm;
