import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import form1 from "../../assets/img/caseform.jpg"; // Background Image
import form2 from "../../assets/icons/drop_img.svg"; // Upload Icon
import supabase from "../../supabaseClient"; // Supabase Client
import toast from "react-hot-toast"; // Notifications Library
import { useParams } from "react-router-dom";

const Upload = ({ uploadedFiles, setUploadedFiles }) => {
  const fileInputRef = useRef(null); // File Input Reference
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, lawyerId } = useParams();
  console.log("Client ID from URL:", user);
  console.log("Lawyer ID from URL:", lawyerId);
  // 🔥 Open File Dialog
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // 🎯 File Upload Function
  const processFile = async (file) => {
    if (!file) {
      toast.error("❌ No File Selected");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("❌ Only PDF files are allowed");
      return;
    }

    setIsLoading(true);
    const fileName = `${Date.now()}_${file.name}`; // Unique File Name

    try {
      // 🔥 Upload PDF to Supabase Storage
      const { data, error } = await supabase.storage
        .from("case-files")
        .upload(`documents/${fileName}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.log("Upload Error:", error);
        toast.error("❌ Upload Failed");
        return;
      }

      // ✅ Get Public URL
      const { data: urlData } = await supabase.storage
        .from("case-files")
        .getPublicUrl(`documents/${fileName}`);

      // 📌 Add File to State
      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          date: new Date().toLocaleDateString(),
          url: urlData.publicUrl,
        },
      ]);

      toast.success("✅ File Uploaded Successfully");
      navigate(`/review/${user}/${lawyerId}`);
    } catch (err) {
      console.error("Unexpected Error:", err);
      toast.error("❌ Something went wrong");
    } finally {
      setIsLoading(false);
      setIsDragging(false);
    }
  };

  // 📌 File Input Change Event
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  // Drag & Drop Events
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
          className={`bg-white/80 rounded-xl p-8 text-center w-full max-w-lg ${
            isDragging ? "border-2 border-dashed border-secondary" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img src={form2} alt="upload" className="w-40 h-auto mb-4" />
          <h1 className="text-xl font-semibold text-secondary mb-4">
            {isDragging ? "Drop your PDF Here" : "Drag & Drop your PDF"}
          </h1>
          <span className="text-gray-500 mb-4 block">or</span>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={handleButtonClick}
            className="bg-secondary text-white text-lg rounded-lg w-full py-2 hover:shadow-lg transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Select your PDF"}
          </button>
        </div>
      </section>
    </>
  );
};

export default Upload;
