import "./App.css";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <Router>
      <div>
        <Routes>
          {!isRegistered ? (
            <Route
              path="/"
              element={<Register setIsRegistered={setIsRegistered} />}
            />
          ) : !isLoggedin ? (
            <Route path="/" element={<Login setIsLoggedin={setIsLoggedin} />} />
          ) : (
            <Route path="/" element={<Navigate to="/dashboard" />} />
          )}
          {isLoggedin && <Route path="/dashboard" element={<Dashboard />} />}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
