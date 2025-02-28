import React from 'react'

const TestUpload = () => {

    const handleButtonClick = () => {
        alert("You clicked the button!");
    };
  return (
    <div>
        <button
            onClick={handleButtonClick}
            className="bg-secondary text-white text-lg rounded-lg w-full py-2 hover:shadow-lg transition-all"
            disabled={isLoading}
        >
            {isLoading ? "Uploading..." : "Select your PDF"}
        </button>
    </div>
  )
}

export default TestUpload
