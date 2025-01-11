import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        "http://localhost:8000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      navigate("/result", { state: response.data });
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1 className="header">Upload Your Image</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="file-input"
      />
      <br />
      <button onClick={handleSubmit} className="submit-button">
        Predict
      </button>
      {preview && (
        <div className="image-preview">
          <img
            src={preview}
            alt="Uploaded Preview"
            className="uploaded-image"
          />
        </div>
      )}
    </div>
  );
}

export default Home;
