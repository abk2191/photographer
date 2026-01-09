import { useState, useRef } from "react";

function App() {
  const fileInputRef = useRef(null);
  const [selectedImageURL, setSelectedImageURL] = useState([]);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // This triggers the file selector
  };

  const acceptFile = (event) => {
    let selectedImageFile = event.target.files[0];

    if (selectedImageFile) {
      const imageURL = URL.createObjectURL(selectedImageFile);
      setSelectedImageURL((prev) => [...prev, imageURL]);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={acceptFile}
        accept="image/*"
        style={{ display: "none" }}
      />
      <div className="upload-photo-button-div">
        <button onClick={handleButtonClick} className="upload-photo-button">
          UPLOAD PHOTO
        </button>
      </div>

      <div className="display-images-div">
        {selectedImageURL.map((image, index) => (
          <img
            key={index} // Don't forget the key!
            src={image}
            alt={`Preview ${index + 1}`}
            style={{ height: "250px", width: "250px" }}
            className="each-image"
          />
        ))}
      </div>
    </>
  );
}

export default App;
