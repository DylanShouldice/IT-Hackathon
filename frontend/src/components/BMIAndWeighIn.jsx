import React, { useState, useEffect } from "react";
import axios from "axios";

const BMIAndWeighIn = ({ currentWeight, setCurrentWeight }) => {
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [weighInDate, setWeighInDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [weighInHistory, setWeighInHistory] = useState([]);

  useEffect(() => {
    console.log("useEffect is running"); // Check if the effect is being triggered

    const fetchWeighInHistory = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      try {
        const response = await axios.get("http://localhost:8080/weighIn", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data); // Check the response
      } catch (error) {
        console.error(
          "Error fetching weigh-in history:",
          error.response || error.message
        );
      }
    };

    fetchWeighInHistory();
  }, []); // Empty dependency array means it only runs once, on initial render

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    if (height && currentWeight) {
      const heightInMeters = height / 100;
      const calculatedBMI = (
        currentWeight /
        (heightInMeters * heightInMeters)
      ).toFixed(1);
      setBmi(calculatedBMI);

      // Determine BMI category
      if (calculatedBMI < 18.5) {
        setBmiCategory("Underweight");
      } else if (calculatedBMI >= 18.5 && calculatedBMI < 25) {
        setBmiCategory("Normal weight");
      } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
        setBmiCategory("Overweight");
      } else {
        setBmiCategory("Obese");
      }
    } else {
      setBmi(null);
      setBmiCategory("");
    }
  }, [height, currentWeight]);

  // Function to handle weigh-in submission
  const handleWeighIn = async (e) => {
    e.preventDefault();
    if (newWeight) {
      const weightEntry = {
        date: weighInDate,
        weight: parseFloat(newWeight),
      };

      // Update weigh-in history
      const updatedHistory = [...weighInHistory, weightEntry];
      setWeighInHistory(updatedHistory);

      // Update current weight
      setCurrentWeight(parseFloat(newWeight));

      // Reset form
      setNewWeight("");

      try {
        await axios.post("http://localhost:8080/weighIn", weightEntry);
      } catch (error) {
        console.error("Error recording weigh-in:", error);
      }
    }
  };

  // Get the color based on BMI value
  const getBmiColor = () => {
    if (!bmi) return "#e5e7eb"; // gray-200
    if (bmi < 18.5) return "#3b82f6"; // blue-500
    if (bmi < 25) return "#10b981"; // emerald-500
    if (bmi < 30) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  // Calculate the rotation of the BMI dial needle
  const getBmiDialRotation = () => {
    if (!bmi) return 0;
    // Map BMI from range (15-40) to rotation degrees (-90 to 90)
    const bmiValue = Math.min(Math.max(parseFloat(bmi), 15), 40);
    const percentage = (bmiValue - 15) / (40 - 15);
    return -90 + percentage * 180;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl shadow-md p-6 mb-6">
      {/* BMI Dial Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">BMI Calculator</h2>

        <div className="mb-4">
          <label
            htmlFor="height"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Height (cm)
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter your height"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">cm</span>
            </div>
          </div>
        </div>

        {/* BMI Dial */}
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-24 mb-4">
            {/* Dial background */}
            <div className="absolute w-full h-full overflow-hidden bg-gray-100 rounded-t-full">
              {/* Color segments */}
              <div className="absolute bottom-0 left-0 w-full h-full">
                <div className="absolute bottom-0 left-0 w-1/4 h-full bg-blue-500 opacity-30"></div>
                <div className="absolute bottom-0 left-1/4 w-1/4 h-full bg-green-500 opacity-30"></div>
                <div className="absolute bottom-0 left-2/4 w-1/4 h-full bg-yellow-500 opacity-30"></div>
                <div className="absolute bottom-0 left-3/4 w-1/4 h-full bg-red-500 opacity-30"></div>
              </div>

              {/* Dial markings */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between px-2">
                <span className="text-xs text-gray-600">15</span>
                <span className="text-xs text-gray-600">25</span>
                <span className="text-xs text-gray-600">30</span>
                <span className="text-xs text-gray-600">40</span>
              </div>

              {/* Needle */}
              {bmi && (
                <div
                  className="absolute bottom-0 left-1/2 w-1 h-20 bg-gray-800 origin-bottom transform -translate-x-1/2"
                  style={{
                    transform: `translateX(-50%) rotate(${getBmiDialRotation()}deg)`,
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-gray-800 absolute -left-1 top-0"></div>
                </div>
              )}

              {/* Center point */}
              <div className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-gray-800 transform -translate-x-1/2 translate-y-1/2"></div>
            </div>
          </div>

          {/* BMI Display */}
          {bmi ? (
            <div className="text-center">
              <div
                className="text-4xl font-bold"
                style={{ color: getBmiColor() }}
              >
                {bmi}
              </div>
              <div className="text-sm text-gray-600">Your BMI</div>
              <div
                className="mt-2 text-lg font-medium"
                style={{ color: getBmiColor() }}
              >
                {bmiCategory}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Enter your height and weight to see your BMI
            </div>
          )}
        </div>
      </div>

      {/* Weigh-in Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Record Your Weight
        </h2>

        <form onSubmit={handleWeighIn} className="space-y-4">
          <div>
            <label
              htmlFor="weighInDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              id="weighInDate"
              type="date"
              value={weighInDate}
              onChange={(e) => setWeighInDate(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="newWeight"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Weight
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="newWeight"
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter your weight"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">kg</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Record Weight
          </button>
        </form>

        {/* Recent Weigh-ins */}
        {weighInHistory.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Recent Weigh-ins
            </h3>
            <div className="max-h-40 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {weighInHistory
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((entry, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                          {entry.weight} kg
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMIAndWeighIn;
