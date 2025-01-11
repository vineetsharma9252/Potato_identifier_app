import React, { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null); // Stores the uploaded image
  const [result, setResult] = useState(null); // Stores the prediction result

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]); // Store the selected image
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image); // Append the image as 'file'

    try {
      const response = await axios.post(
        "http://localhost:8000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResult(response.data); // Store the result from the backend
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Image Prediction App</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleSubmit} style={{ marginLeft: "10px" }}>
        Predict
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Prediction: {result.prediction}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
