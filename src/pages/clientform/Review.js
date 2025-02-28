import React, { useRef, useState } from "react";
import "../../index.css";
import form1 from "../../assets/img/caseform.jpg";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";

// Supabase Connection
const supabase = createClient(
  "https://<YOUR_SUPABASE_URL>",
  "<YOUR_SUPABASE_API_KEY>"
);

const Review = ({ uploadedFiles = [], setUploadedFiles = () => {} }) => {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRemoveFile = async (indexToRemove) => {
    const fileToRemove = uploadedFiles[indexToRemove];
    const filePath = fileToRemove.url;

    const { error } = await supabase.storage.from("law_docs").remove([filePath]);

    if (error) {
      toast.error("Failed to delete file ❌");
      console.error(error);
    } else {
      setUploadedFiles((prevFiles) =>
        prevFiles.filter((_, index) => index !== indexToRemove)
      );
      toast.success("File Removed Successfully ✅");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files)
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        date: new Date().toLocaleDateString(),
      }));

    if (newFiles.length < e.target.files.length) {
      toast.warning("Only PDF files are accepted ❗");
    }

    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    e.target.value = null;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (uploadedFiles.length > 0) {
      toast.success("Case Files Submitted Successfully ✅");
    } else {
      toast.error("Please Upload Files Before Submitting ❌");
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <section
        className="w-full h-screen bg-cover bg-center flex items-center justify-center p-4"
        style={{ backgroundImage: `url(${form1})` }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="application/pdf"
          className="hidden"
        />
        <div className="bg-bg/80 rounded-xl p-10 shadow-lg w-full max-w-4xl text-center">
          {uploadedFiles.length > 0 ? (
            <>
              <h2 className="text-2xl text-secondary mb-4">Uploaded Files</h2>
              <div className="overflow-x-auto rounded-lg shadow-md mb-6">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-sm text-gray-700">File Name</th>
                      <th className="p-3 text-sm text-gray-700">Size</th>
                      <th className="p-3 text-sm text-gray-700">Date</th>
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
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-4 md:flex-row justify-center">
                <button
                  onClick={handleUploadClick}
                  className="bg-secondary text-white text-lg rounded-md px-6 py-2 hover:shadow-xl"
                >
                  Upload More
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`bg-secondary text-white text-lg rounded-md px-6 py-2 hover:shadow-xl ${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-600 mb-4">No files uploaded yet</p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleUploadClick}
                  className="bg-secondary text-white text-lg rounded-md px-6 py-2 hover:shadow-xl"
                >
                  Upload
                </button>
                <button
                  onClick={handleSubmit}
                  disabled
                  className="bg-gray-400 text-white text-lg rounded-md px-6 py-2 cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Review;
