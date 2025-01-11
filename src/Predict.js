import React, { memo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useState } from "react";

const Predict = memo(function Predict(props) {
  const api = axios.create({
    baseURL: `http://localhost:8000/predict`,
  });

  const [imageData, setImageData] = useState({
    prediction: "Null",
    confidence: 0,
  });
  const prediction = async (image) => {
    const formData = new FormData();
    formData.append("image", image);
    const result = await api.post("/predict", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setImageData(result.data);
  };

  React.useEffect(() => {
    prediction();
  }, []);
  return (
    <div>
      <div
        style={{
          textAlign: "center",
          margin: "20px",
          padding: "20px",
          border: "2px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ color: "#333" }}>Potato Identifier</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => prediction(e.target.files[0])}
          style={{ margin: "20px 0" }}
        />
        {imageData.prediction !== "Null" && (
          <div>
            <img
              src={URL.createObjectURL(props.image)}
              alt="Uploaded"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            />
            <h3 style={{ color: "#555" }}>
              Prediction: {imageData.prediction}
            </h3>
            <p style={{ color: "#777" }}>
              Confidence: {(imageData.confidence * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

Predict.propTypes = {};

export default Predict;
