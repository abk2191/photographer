import { useState, useRef, useEffect } from "react";

function App() {
  const fileInputRef = useRef(null);
  const [selectedImageURL, setSelectedImageURL] = useState([]);

  // Load images from localStorage on component mount
  useEffect(() => {
    const savedImages = localStorage.getItem("galleryImages");
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages);
        if (Array.isArray(parsedImages)) {
          setSelectedImageURL(parsedImages);
        }
      } catch (error) {
        console.error("Error loading images from localStorage:", error);
        localStorage.removeItem("galleryImages");
      }
    }
  }, []);

  // Save images to localStorage whenever selectedImageURL changes
  useEffect(() => {
    if (selectedImageURL.length > 0) {
      localStorage.setItem(
        "galleryImages",
        JSON.stringify(selectedImageURL)
      );
    } else {
      localStorage.removeItem("galleryImages");
    }
  }, [selectedImageURL]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const acceptFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImageURL((prev) => [...prev, reader.result]);
    };

    reader.readAsDataURL(file);
    event.target.value = null;
  };

  const removeImage = (indexToRemove) => {
    setSelectedImageURL((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const clearAllImages = () => {
    setSelectedImageURL([]);
    localStorage.removeItem("galleryImages");
  };

  return (
    <>
      <div className="logo">
        <h1 style={{ color: "white" }}>My Web Gallery</h1>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={acceptFile}
        accept="image/*"
        style={{ display: "none" }}
      />

      <div className="upload-photo-button-div">
        <button onClick={handleButtonClick} className="upload-photo-button">
          +
        </button>
      </div>

      <div className="display-images-div-flex">
        <div className="display-images-div">
          {selectedImageURL.length > 0 ? (
            selectedImageURL.map((image, index) => (
              <div key={index} style={{ position: "relative" }}>
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="each-image"
                  style={{
                    height: "250px",
                    width: "250px",
                    objectFit: "cover",
                  }}
                />
                <button
                  onClick={() => removeImage(index)}
                  title="Remove image"
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "25px",
                    height: "25px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: "white", textAlign: "center", width: "100%" }}>
              No images yet. Click the + button to add some!
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;