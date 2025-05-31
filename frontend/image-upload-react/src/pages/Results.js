import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import dayjs from "dayjs";
import "./Results.css";
import Footer from "../components/Footer";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Results = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/json-history");
      setHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching history:", error);
      setLoading(false);
    }
  };

  const sentimentMap = {
    "very negative": -2,
    negative: -1,
    neutral: 0,
    positive: 1,
    "very positive": 2,
  };

  const chartData = {
    labels: history.map((entry) => {
      const date = dayjs(entry.time_stamp);
      return `${date.format("ddd")}\n${date.format("D")}`;
    }),
    datasets: [
      {
        label: "Sentiment",
        data: history.map((entry) => sentimentMap[entry.sentiment_rating]),
        borderColor: "rgba(12, 150, 228, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 7,
        tension: 0,
        pointBorderColor: "rgba(12, 150, 228, 1)",
        pointBackgroundColor: "#fff",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 16,
          },
        },
      },
      tooltip: {
        enabled: true,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: (context) => {
            const sentimentLabels = {
              "-2": "very negative",
              "-1": "negative ",
              0: "neutral",
              1: "positive",
              2: "very positive",
            };
            return sentimentLabels[context.raw] || context.raw;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Sentiment Score",
          font: {
            size: 24,
          },
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 20,
          },
          callback: (value) => {
            const labels = {
              "-2": "Very Negative", //MAKE SURE TO MAKE THESE LOWERCASE (i changed the backend to toLowerCase before parsing to frontend)
              "-1": "Negative ",
              0: "Neutral",
              1: "Positive",
              2: "Very Positive",
            };
            return labels[value] || value;
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 20,
          },
        },
        ticks: {
          font: {
            size: 20,
          },
        },
      },
    },
  };

  const downloadCSV = () => {
    const csvRows = [];

    const headers = [
      "Timestamp",
      "Sentiment Rating",
      "Sentiment Score",
      "Detected Objects",
    ];
    csvRows.push(headers.join(","));

    history.forEach((entry) => {
      const date = dayjs(entry.time_stamp).format("YYYY-MM-DD HH:mm:ss");
      const sentimentRating = entry.sentiment_rating;
      const sentimentScore = sentimentMap[entry.sentiment_rating];
      const detectedObjects = entry.detected_objects.join("; ");

      const row = [
        `"${date}"`,
        `"${sentimentRating}"`,
        sentimentScore,
        `"${detectedObjects}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "expressink_results.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="results-container">
      <div className="results-title-div">
        <h1 className="results-title">Mood Trends</h1>
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="download-button-container">
        <button className="download-button" onClick={downloadCSV}>
          Download Results as CSV
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Results;
