import "./App.css";
import { useState } from "react";
import Register from "./components/Register";
function App() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  return <div className="">{!isLoggedin && <Register />}</div>;
}

export default App;
