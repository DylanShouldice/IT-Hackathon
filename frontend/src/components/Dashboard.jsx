import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Ensures collapse works

const Dashboard = () => {
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  const [weightGoal, setWeightGoal] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("http://localhost:8080/meals");
        setMeals(response.data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weight Loss Progress",
        data: currentWeight
          ? [
              currentWeight - 1,
              currentWeight - 2,
              currentWeight - 3,
              currentWeight - 4,
            ]
          : [],
        borderColor: "#4CAF50",
        fill: false,
      },
    ],
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar text-white vh-100">
          <div className="position-sticky pt-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link text-light" to="/profile">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/settings">
                  Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/logout">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
          </div>

          {/* Meal Recommendations */}
          <div className="card shadow p-4 mb-4">
            <h2>Recommended Meals</h2>
            <div className="accordion" id="mealAccordion">
              {Object.entries(meals).map(([mealType, mealList], index) => (
                <div className="accordion-item" key={mealType}>
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index}`}
                    >
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse"
                    data-bs-parent="#mealAccordion"
                  >
                    <div className="accordion-body">
                      <ul className="list-group">
                        {mealList.length > 0 ? (
                          mealList.map((meal) => (
                            <li className="list-group-item" key={meal.id}>
                              {meal.name}
                            </li>
                          ))
                        ) : (
                          <li className="list-group-item text-muted">
                            No meals available
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weight Goal Section */}
          <div className="card shadow p-4 mb-4">
            <h2>Weight Goal Progress</h2>
            <div className="input-group mb-3">
              <input
                type="number"
                className="form-control rounded-pill"
                value={weightGoal}
                onChange={(e) => setWeightGoal(Number(e.target.value))}
                placeholder="Set your goal weight"
              />
            </div>
            <div className="input-group mb-3">
              <input
                type="number"
                className="form-control rounded-pill"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                placeholder="Current weight"
              />
            </div>
            <div className="card shadow p-3">
              <Line ref={chartRef} data={data} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
