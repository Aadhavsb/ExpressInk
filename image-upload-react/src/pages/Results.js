import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Results.css";

import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";

import ReactWordcloud from "react-wordcloud";

const Results = () => {
  const [data, setData] = useState([]);
  const [sentimentOverTimeData, setSentimentOverTimeData] = useState(null);
  const [sentimentCountData, setSentimentCountData] = useState(null);
  const [wordCloudData, setWordCloudData] = useState([]);

  useEffect(() => {
    axios
      .get("json-history")
      .then((response) => {
        const fetchedData = response.data[0];
        setData(fetchedData);

        processData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const processData = (fetchedData) => {
    // Process data for Sentiment Over Time (Line Chart)
    const timeSentimentData = fetchedData.map((item) => ({
      time: new Date(item.time_stamp),
      sentiment: sentimentToScore(item.sentiment_rating),
    }));
    timeSentimentData.sort((a, b) => a.time - b.time); // Sort data by time

    const sentimentOverTime = {
      labels: timeSentimentData.map((item) => item.time.toLocaleString()),
      datasets: [
        {
          label: "Sentiment Score Over Time",
          data: timeSentimentData.map((item) => item.sentiment),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    };

    setSentimentOverTimeData(sentimentOverTime);

    // Process data for Sentiment Counts (Bar Chart)
    const sentimentCounts = {};
    fetchedData.forEach((item) => {
      const sentiment = item.sentiment_rating;
      sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
    });

    const sentimentCountChart = {
      labels: Object.keys(sentimentCounts),
      datasets: [
        {
          label: "Number of Entries",
          data: Object.values(sentimentCounts),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 205, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
        },
      ],
    };

    setSentimentCountData(sentimentCountChart);

    // Process data for Word Cloud
    const objectCounts = {};
    fetchedData.forEach((item) => {
      item.detected_objects.forEach((obj) => {
        objectCounts[obj] = (objectCounts[obj] || 0) + 1;
      });
    });

    const wordCloudWords = Object.keys(objectCounts).map((key) => ({
      text: key,
      value: objectCounts[key],
    }));

    setWordCloudData(wordCloudWords);
  };

  // Helper function to convert sentiment ratings to numeric scores
  const sentimentToScore = (rating) => {
    switch (rating) {
      case "very negative":
        return -2;
      case "negative":
        return -1;
      case "neutral":
        return 0;
      case "positive":
        return 1;
      case "very positive":
        return 2;
      default:
        return 0; // Treat unknown sentiments as neutral
    }
  };

  return (
    <div className="results-container">
      <h2>Results and Insights</h2>

      {sentimentOverTimeData ? (
        <div className="chart-container">
          <h3>Sentiment Over Time</h3>
          <Line data={sentimentOverTimeData} />
        </div>
      ) : (
        <p>Loading sentiment over time chart...</p>
      )}

      {sentimentCountData ? (
        <div className="chart-container">
          <h3>Sentiment Distribution</h3>
          <Bar data={sentimentCountData} />
        </div>
      ) : (
        <p>Loading sentiment distribution chart...</p>
      )}

      {wordCloudData.length > 0 ? (
        <div className="wordcloud-container">
          <h3>Commonly Detected Objects</h3>
          <ReactWordcloud words={wordCloudData} />
        </div>
      ) : (
        <p>Loading word cloud...</p>
      )}
    </div>
  );
};

export default Results;
