import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import form1 from "../../assets/img/caseform.jpg";
import form2 from "../../assets/icons/drop_img.svg";
import supabase from "../../supabaseClient"; // 🔥 Import only once
import toast from "react-hot-toast"; // Optional for Notifications

const Upload = ({ uploadedFiles, setUploadedFiles }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const processFile = async (file) => {
    if (!file) {
      toast.error("No File Selected ❌");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files allowed ❌");
      return;
    }

    setIsLoading(true);
    const fileName = `${Date.now()}_${file.name}`;

    try {
      const { data, error } = await supabase.storage
      .from("files")
      .upload(`documents/${fileName}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

      if (error) {
        console.log("Upload Error:", error);
        toast.error("Upload Failed ❌");
        return;
      }

      const { data: urlData } = await supabase.storage
      .from("files")
      .getPublicUrl(`documents/${fileName}`);


      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          date: new Date().toLocaleDateString(),
          url: urlData.publicUrl, // ✅ Correct URL
        },
      ]);

      toast.success("Uploaded Successfully ✅");
      navigate("/review");

    } catch (err) {
      console.error("Unexpected Error:", err);
      toast.error("Something went wrong ❌");
    } finally {
      setIsLoading(false);
      setIsDragging(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  return (
    <>
      <section
        className="w-full min-h-screen bg-cover bg-center flex justify-center items-center p-4"
        style={{ backgroundImage: `url(${form1})` }}
      >
        <div
          className={`bg-bg/70 rounded-xl p-6 flex flex-col items-center w-full max-w-lg ${
            isDragging ? "bg-gray-200" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img src={form2} alt="upload" className="w-40 h-auto mb-4" />
          <h1 className="text-secondary text-xl text-center mb-4">
            {isDragging ? "Drop your PDF here" : "Drag & Drop your PDF"}
          </h1>
          <span className="text-gray-600 mb-4">or</span>
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={handleButtonClick}
            className="w-full bg-secondary text-white text-lg rounded-md p-2 hover:shadow-xl cursor-pointer"
          >
            {isLoading ? "Uploading..." : "Select your PDF"}
          </button>
        </div>
      </section>
    </>
  );
};

export default Upload;
