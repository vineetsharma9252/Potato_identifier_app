from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from io import BytesIO
from PIL import Image
import numpy as np
import tensorflow as tf


# Load the model
MODEL = tf.keras.models.load_model("models\model_3.keras")
app = FastAPI()
IMAGE_SIZE = 256
origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/ping")
async def ping():
    return {"message": "Potato API is up and running"}

# Helper function to read and preprocess image
def read_file_as_image(data) -> np.ndarray:
    try:
        image = Image.open(BytesIO(data))
        image = image.resize((IMAGE_SIZE, IMAGE_SIZE))  # Resize image to model's expected size
        image = np.array(image) / 255.0  # Normalize pixel values to [0, 1]
        return image
    except Exception as e:
        raise ValueError(f"Error processing the image: {e}")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Define class names
    class_names = [
        'Pepper__bell___Bacterial_spot',
        'Pepper__bell___healthy',
        'Potato___Early_blight',
        'Potato___Late_blight',
        'Potato___healthy'
    ]

    try:
        # Read and preprocess the image
        image = read_file_as_image(await file.read())
        image = np.expand_dims(image, axis=0)  # Add batch dimension
        
        # Predict using the model
        prediction = MODEL.predict(image)
        image_pred = class_names[np.argmax(prediction[0])]
        confidence = np.max(prediction[0])
        
        # Return prediction and confidence
        return {"prediction": image_pred, "confidence": float(confidence)}
    
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
