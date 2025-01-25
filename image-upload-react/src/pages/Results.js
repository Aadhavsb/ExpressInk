import React, { useEffect, useState } from 'react';

const Results = () => {
  // State to store the data from the JSON file
  const [data, setData] = useState([]);
  // State to handle any errors
  const [error, setError] = useState(null);

  // Fetch the JSON file on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the JSON file from the public folder
        const response = await fetch('/data.json');
        
        // Check if response is okay
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        // Parse the JSON response
        const jsonData = await response.json();
        
        // Set the data in the state
        setData(jsonData);
      } catch (err) {
        // Handle errors
        setError(err.message);
      }
    };

    // Call the function to fetch data
    fetchData();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Render the data
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Results:</h2>
      {data.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.sentiment_rating}>
              <h3>{item.reasoning_text}</h3>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Results;
