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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Register</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="height">Height (in cm)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="Height"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Age"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="allergies">Allergies</label>
                  <select
                    className="form-control"
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
                <div className="form-group">
                  <label htmlFor="diet">Diet</label>
                  <select
                    className="form-control"
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
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    className="form-control"
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
                <button type="submit" className="btn btn-primary btn-block">
                  Register
                </button>
                <div className="mt-3 text-center">
                  <p>
                    Already have an account?{" "}
                    <a href="#" onClick={() => setIsRegistered(true)}>
                      Login
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
