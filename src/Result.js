import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";
function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prediction, confidence } = location.state || {};

  return (
    <div className="container">
      <h1 className="header">Prediction Result</h1>
      {prediction ? (
        <div className="result-box">
          <h3 className="result-text">Prediction: {prediction}</h3>
          <p className="result-text">
            Confidence: {(confidence * 100).toFixed(2)}%
          </p>
        </div>
      ) : (
        <p className="error-text">No result available. Please try again.</p>
      )}
      <button onClick={() => navigate("/")} className="back-button">
        Back to Home
      </button>
    </div>
  );
}

export default Result;
