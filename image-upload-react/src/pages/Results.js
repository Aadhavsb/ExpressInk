import React, { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import "./Results.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Results = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch data from JSON file
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        // Process data for chart
        const labels = data.map((item) => item.timestamp);
        const values = data.map((item) => item.sentiment_rating);

        setChartData({
          labels,
          datasets: [
            {
              label: "Sentiment Trend",
              data: values,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4, // Smooth curve
              fill: true,
            },
          ],
        });
      });
  }, []);

  return (
    <div style={{ width: "600px", margin: "auto" }}>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Trend Over Time" },
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default Results;
