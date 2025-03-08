import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import axios from "axios";
import BMIAndWeighIn from "./BMIAndWeighIn";
const Dashboard = () => {
  const [meals, setMeals] = useState([]);
  const [mealsByCategory, setMealsByCategory] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  const [weightGoal, setWeightGoal] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [openAccordion, setOpenAccordion] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("http://localhost:8080/meals");
        setMeals(response.data);

        const categorized = {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: [],
        };

        // Option 1: If meals have a category field
        response.data.forEach((meal) => {
          const category = meal.category?.toLowerCase() || "other";
          if (categorized[category]) {
            categorized[category].push(meal);
          }
        });

        setMealsByCategory(categorized);
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
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#ffffff",
        pointRadius: 4,
        tension: 0.4,
        fill: true,
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

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="hidden md:flex md:w-64 flex-col bg-gradient-to-b from-indigo-800 to-indigo-900 text-white">
        <div className="p-6">
          <h1 className=" text-xl font-bold">HealthPal</h1>
        </div>
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-3 text-white bg-indigo-700 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 text-gray-200 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center px-4 py-3 text-gray-200 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Settings
              </Link>
            </li>
            <li>
              <Link
                to="/logout"
                className="flex items-center px-4 py-3 text-gray-200 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.707a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 10-1.414-1.414L10 8.586 6.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 101.414 1.414L10 11.414l3.293 3.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <button
          type="button"
          className="p-3 rounded-full bg-indigo-600 text-white shadow-lg"
          aria-label="Open menu"
          onClick={() =>
            document.getElementById("mobile-menu").classList.toggle("hidden")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        className="hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden"
      >
        <div className="h-full w-64 bg-indigo-900 p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">NutriTrack</h2>
            <button
              onClick={() =>
                document.getElementById("mobile-menu").classList.add("hidden")
              }
              className="text-white"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-3 text-white bg-indigo-700 rounded-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 text-gray-200 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-3 text-gray-200 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  className="flex items-center px-4 py-3 text-gray-200 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.707a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 10-1.414-1.414L10 8.586 6.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 101.414 1.414L10 11.414l3.293 3.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Logout
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          <div className="border-b border-gray-200 pb-5 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>

          {/* Updated Meals Section - Option 1: If you still want to display by categories */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Recommended Meals
            </h2>
            <div className="space-y-3">
              {Object.entries(mealsByCategory).map(
                ([mealType, mealList], index) => (
                  <div
                    key={mealType}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                      onClick={() => toggleAccordion(index)}
                      aria-expanded={openAccordion === index}
                    >
                      <span className="font-medium text-gray-700">
                        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                      </span>
                      <svg
                        className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
                          openAccordion === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openAccordion === index && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <ul className="divide-y divide-gray-200">
                          {mealList.length > 0 ? (
                            mealList.map((meal) => (
                              <li
                                key={meal.id}
                                className="py-3 flex justify-between items-center"
                              >
                                <div>
                                  <span className="text-gray-700">
                                    {meal.name}
                                  </span>
                                  {meal.description && (
                                    <p className="text-gray-500 text-sm mt-1">
                                      {meal.description}
                                    </p>
                                  )}
                                </div>
                                <button
                                  className="ml-4 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                                  aria-label="View recipe"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                </button>
                              </li>
                            ))
                          ) : (
                            <li className="py-3 text-gray-500">
                              No meals available
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Alternative Meals Section - Option 2: Display all meals in a list/grid */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                All Available Meals
              </h2>
              <Link
                to="/add-meal"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Meal
              </Link>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {meals.length > 0 ? (
                  meals.map((meal) => (
                    <li key={meal.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-indigo-600 truncate">
                            {meal.name}
                          </h3>
                          <div className="ml-2 flex-shrink-0 flex">
                            <Link
                              to={`/meal/${meal.id}`}
                              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {meal.description || "No description available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                    No meals available. Add a meal to get started.
                  </li>
                )}
              </ul>
            </div>
          </div>
          <BMIAndWeighIn
            currentWeight={currentWeight}
            setCurrentWeight={setCurrentWeight}
          />
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Weight Goal Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="weightGoal"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Target Weight
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      id="weightGoal"
                      type="number"
                      value={weightGoal}
                      onChange={(e) => setWeightGoal(Number(e.target.value))}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">kg</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="currentWeight"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Weight
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      id="currentWeight"
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(Number(e.target.value))}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">kg</span>
                    </div>
                  </div>
                </div>
                {currentWeight && weightGoal && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Current</span>
                      <span className="text-sm text-gray-500">Goal</span>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                ((currentWeight - weightGoal) / currentWeight) *
                                  100
                              )
                            )}%`,
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm font-medium text-gray-800">
                        {currentWeight} kg
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {weightGoal} kg
                      </span>
                    </div>
                    <p className="text-sm text-center mt-4 text-gray-600">
                      {currentWeight > weightGoal
                        ? `${(currentWeight - weightGoal).toFixed(1)} kg to go!`
                        : "You've reached your goal!"}
                    </p>
                  </div>
                )}
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Line
                  ref={chartRef}
                  data={data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                      },
                      tooltip: {
                        backgroundColor: "rgba(17, 24, 39, 0.9)",
                        padding: 12,
                        titleColor: "#fff",
                        bodyColor: "#fff",
                        borderColor: "rgba(75, 85, 99, 0.3)",
                        borderWidth: 1,
                        displayColors: false,
                        callbacks: {
                          label: function (context) {
                            return `${context.parsed.y} kg`;
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        grid: {
                          color: "rgba(226, 232, 240, 0.7)",
                        },
                        ticks: {
                          font: {
                            size: 11,
                          },
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          font: {
                            size: 11,
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
