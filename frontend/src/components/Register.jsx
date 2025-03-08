import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const registerData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/register",
        registerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration successful:", response.data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h1 className="text-3xl items-center">Create an Account</h1>

      <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mx-auto">
        <legend className="fieldset-legend">Register</legend>

        <label className="fieldset-label">Email</label>
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="fieldset-label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="fieldset-label">Confirm Password</label>
        <input
          type="password"
          className="input"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button className="btn btn-neutral mt-4" type="submit">
          Register
        </button>
      </fieldset>
    </form>
  );
};

export default Register;
