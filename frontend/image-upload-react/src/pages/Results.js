import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Line, Pie } from "react-chartjs-2";
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
  ArcElement,
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
  Filler,
  ArcElement
);

const Results = () => {
  const { getAuthHeaders, user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);
  const fetchHistory = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:8000/json-history", {
        headers: getAuthHeaders()
      });
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
        borderColor: "rgba(168, 85, 247, 1)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        pointBorderColor: "rgba(168, 85, 247, 1)",
        pointBackgroundColor: "#2d3748",
        pointBorderWidth: 3,
        pointRadius: 6,
        fill: true,
      },
    ],
  };

  // Calculate sentiment distribution for pie chart
  const sentimentCounts = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  history.forEach((entry) => {
    const score = sentimentMap[entry.sentiment_rating];
    if (score > 0) {
      sentimentCounts.positive++;
    } else if (score < 0) {
      sentimentCounts.negative++;
    } else {
      sentimentCounts.neutral++;
    }
  });

  const pieChartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [sentimentCounts.positive, sentimentCounts.neutral, sentimentCounts.negative],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',  // Green for positive
          'rgba(139, 92, 246, 0.8)',  // Purple for neutral
          'rgba(239, 68, 68, 0.8)',   // Red for negative
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 14,
            family: 'Poppins',
          },
          color: '#e2e8f0',
        },
      },
      tooltip: {
        enabled: true,
        titleFont: {
          size: 14,
          family: 'Poppins',
        },
        bodyFont: {
          size: 14,
          family: 'Poppins',
        },
        backgroundColor: 'rgba(45, 55, 72, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e0',
        borderColor: '#718096',
        borderWidth: 1,
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
            size: 16,
            family: 'Poppins',
          },
          color: '#e2e8f0',
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
            family: 'Poppins',
          },
          color: '#cbd5e0',
          callback: (value) => {
            const labels = {
              "-2": "Very Negative",
              "-1": "Negative ",
              0: "Neutral",
              1: "Positive",
              2: "Very Positive",
            };
            return labels[value] || value;
          },
        },
        grid: {
          color: 'rgba(113, 128, 150, 0.3)',
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 16,
            family: 'Poppins',
          },
          color: '#e2e8f0',
        },
        ticks: {
          font: {
            size: 12,
            family: 'Poppins',
          },
          color: '#cbd5e0',
        },
        grid: {
          color: 'rgba(113, 128, 150, 0.3)',
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
            family: 'Poppins',
          },
          color: '#e2e8f0',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(45, 55, 72, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e0',
        borderColor: '#718096',
        borderWidth: 1,
        titleFont: {
          family: 'Poppins',
        },
        bodyFont: {
          family: 'Poppins',
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
  };  if (loading) return (
    <div className="results-container">
      <div className="loading-container">
        <p className="loading-text">Loading your mood trends...</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="results-container">
      <div className="login-prompt">
        <div className="login-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="results-title">Login Required</h1>
        <p className="login-message">Please sign in to view your analysis history and results.</p>
        <div className="login-buttons">
          <a href="/login" className="login-button">Sign In</a>
          <a href="/signup" className="signup-button">Sign Up</a>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="results-container">
      <div className="results-header">
        <h1 className="results-title">Mood Trends & Analysis</h1>
        <p className="results-subtitle">Track your emotional journey through your artwork</p>
      </div>
      
      <div className="charts-container">
        <div className="chart-section line-chart-section">
          <h2 className="chart-title">Sentiment Over Time</h2>
          <div className="chart-wrapper">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="chart-section pie-chart-section">
          <h2 className="chart-title">Overall Sentiment Distribution</h2>
          <div className="chart-wrapper pie-wrapper">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
          <div className="sentiment-stats">
            <div className="stat-item positive">
              <span className="stat-number">{sentimentCounts.positive}</span>
              <span className="stat-label">Positive</span>
            </div>
            <div className="stat-item neutral">
              <span className="stat-number">{sentimentCounts.neutral}</span>
              <span className="stat-label">Neutral</span>
            </div>
            <div className="stat-item negative">
              <span className="stat-number">{sentimentCounts.negative}</span>
              <span className="stat-label">Negative</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="download-section">
        <button className="download-button" onClick={downloadCSV}>
          <span className="download-icon">📊</span>
          Download Results as CSV
        </button>
      </div>
      
      <Footer />
    </div>
  );
};

export default Results;
