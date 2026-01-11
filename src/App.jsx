import { useState, useRef, useEffect } from "react";
import ImageViewer from "./ImageViewer";

function App() {
  const fileInputRef = useRef(null);
  const [selectedImageURL, setSelectedImageURL] = useState([]);

  // Load images from localStorage on component mount
  useEffect(() => {
    const savedImages = localStorage.getItem("galleryImages");
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages);
        // Validate that we have valid URLs before setting state
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          setSelectedImageURL(parsedImages);
        }
      } catch (error) {
        console.error("Error loading images from localStorage:", error);
        // Clear corrupted data
        localStorage.removeItem("galleryImages");
      }
    }
  }, []);

  // Save images to localStorage whenever selectedImageURL changes
  useEffect(() => {
    if (selectedImageURL.length > 0) {
      localStorage.setItem("galleryImages", JSON.stringify(selectedImageURL));
    } else {
      // If no images, clear the localStorage item
      localStorage.removeItem("galleryImages");
    }
  }, [selectedImageURL]);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // This triggers the file selector
  };

  const acceptFile = (event) => {
    const selectedImageFile = event.target.files[0];

    if (selectedImageFile) {
      const imageURL = URL.createObjectURL(selectedImageFile);
      setSelectedImageURL((prev) => [...prev, imageURL]);
    }

    // Reset the input so the same file can be selected again
    event.target.value = null;
  };

  // Function to remove an image
  const removeImage = (indexToRemove) => {
    setSelectedImageURL((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Function to clear all images
  const clearAllImages = () => {
    // Revoke object URLs to prevent memory leaks
    selectedImageURL.forEach((url) => URL.revokeObjectURL(url));
    setSelectedImageURL([]);
    localStorage.removeItem("galleryImages");
  };

  return (
    <>
      <div className="logo">
        <h1 style={{ color: "white" }}>My Web Gallery</h1>
        {/* {selectedImageURL.length > 0 && (
          <button
            onClick={clearAllImages}
            style={{
              marginLeft: "20px",
              padding: "5px 10px",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear All
          </button>
        )} */}
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
                  style={{
                    height: "250px",
                    width: "250px",
                    objectFit: "cover",
                  }}
                  className="each-image"
                />
                <button
                  onClick={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "25px",
                    height: "25px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  title="Remove image"
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
      {/* <ImageViewer /> */}
    </>
  );
}

export default App;
