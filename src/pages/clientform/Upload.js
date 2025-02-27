import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import form1 from '../../assets/img/caseform.jpg';
import form2 from '../../assets/icons/drop_img.svg';

const Upload = ({ uploadedFiles, setUploadedFiles }) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();
  
    const handleButtonClick = () => {
      fileInputRef.current.click();
    };
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      processFile(file);
    };
  
    const processFile = (file) => {
      if (file && file.type === "application/pdf") {
        setUploadedFiles(prevFiles => [...prevFiles, {
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
          date: new Date().toLocaleDateString()
        }]);
        navigate("/review");
      } else if (file) {
        alert("Please upload a PDF file only");
      }
      setIsDragging(false);
    };
  
    const handleDragOver = (event) => {
      event.preventDefault();
      setIsDragging(true);
    };
  
    const handleDragLeave = (event) => {
      event.preventDefault();
      setIsDragging(false);
    };
  
    const handleDrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      processFile(file);
    };
  return (
    <>
    <section className="w-full min-h-screen bg-cover bg-center flex justify-center items-center p-4" style={{ backgroundImage: `url(${form1})` }}>
      <div
        className={`bg-bg/70 rounded-xl p-6 flex flex-col items-center w-full max-w-lg ${isDragging ? 'bg-gray-200' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <img src={form2} alt="upload" className="w-40 h-auto mb-4" />
        <h1 className="text-secondary text-xl text-center mb-4">
          {isDragging ? "Drop your PDF here" : "Drop your PDF"}
        </h1>
        <span className="text-gray-600 mb-4">or</span>
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleButtonClick}
          className="w-full bg-secondary text-white text-lg rounded-md p-2 hover:shadow-xl cursor-pointer"
        >
          Select your PDF
        </button>
      </div>
    </section>
    </>
  )
}

export default Upload