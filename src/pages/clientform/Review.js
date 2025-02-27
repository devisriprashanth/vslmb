import React, { useRef } from "react";
import "../../index.css";
import form1 from '../../assets/img/caseform.jpg';

const Review = ({ uploadedFiles = [], setUploadedFiles = () => {} }) => {
    const fileInputRef = useRef(null);

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files)
      .filter(file => file.type === "application/pdf")
      .map(file => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        date: new Date().toLocaleTimeString(),
      }));

    if (newFiles.length < e.target.files.length) {
      alert("Only PDF files are accepted. Non-PDF files were ignored.");
    }

    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
    e.target.value = null;
  };

  const handleSubmit = () => {
    console.log("Submitted files:", uploadedFiles);
  };

  return (
    <>
    <section className="w-full h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${form1})` }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="application/pdf"
        className="hidden"
      />
      <div className="bg-bg/70 rounded-xl p-10 shadow-lg w-full max-w-4xl text-center">
        {uploadedFiles.length > 0 ? (
          <>
            <h2 className="text-2xl text-secondary mb-4">Uploaded Files</h2>
            <div className="overflow-x-auto rounded-lg shadow-md mb-6">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-sm text-gray-700">File Name</th>
                    <th className="p-3 text-sm text-gray-700">Size</th>
                    <th className="p-3 text-sm text-gray-700">Time</th>
                    <th className="p-3 text-sm text-gray-700">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">{file.name}</td>
                      <td className="p-3 text-sm">{file.size}</td>
                      <td className="p-3 text-sm">{file.date}</td>
                      <td className="p-3">
                        <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-4 md:flex-row justify-center">
              <button onClick={handleUploadClick} className="bg-secondary text-white text-lg rounded-md px-6 py-2 hover:shadow-xl">Upload More</button>
              <button onClick={handleSubmit} className="bg-secondary text-white text-lg rounded-md px-6 py-2 hover:shadow-xl">Submit</button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-lg text-gray-600 mb-4">No files uploaded yet</p>
            <div className="flex flex-col gap-4">
              <button onClick={handleUploadClick} className="bg-secondary text-white text-lg rounded-md px-6 py-2 hover:shadow-xl">Upload</button>
              <button onClick={handleSubmit} disabled={uploadedFiles.length === 0} className={`bg-secondary text-white text-lg rounded-md px-6 py-2 hover:shadow-xl ${uploadedFiles.length === 0 ? 'bg-gray-400 cursor-not-allowed' : ''}`}>Submit</button>
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  )
}

export default Review
