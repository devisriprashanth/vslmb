import React, { useRef, useState } from "react";
import "../../index.css";
import form1 from "../../assets/img/caseform.jpg";
import supabase from "../../supabaseClient";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Review = ({ uploadedFiles = [], setUploadedFiles = () => {} }) => {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
   const { user, lawyerId } = useParams();
    console.log("Client ID from URL:", user);
    console.log("Lawyer ID from URL:", lawyerId);
const navigate = useNavigate();
  const handleRemoveFile = async (indexToRemove) => {
    const fileToRemove = uploadedFiles[indexToRemove];
    const filePath = fileToRemove.url.split("/storage/v1/object/public/")[1];

    const { error } = await supabase.storage.from("files").remove([filePath]);

    if (error) {
      toast.error("❌ Failed to delete file");
      console.error(error);
    } else {
      setUploadedFiles((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
      toast.success("✅ File Removed Successfully");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length < files.length) {
      toast.warning("❗ Only PDF files are accepted");
    }

    const uploaded = [];
    for (let file of pdfFiles) {
      const fileName = `${Date.now()}_${file.name}`;

      const { data, error } = await supabase.storage
        .from("files")
        .upload(`documents/${fileName}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        toast.error("❌ Upload Failed");
      } else {
        const { data: urlData } = await supabase.storage
          .from("case-files")
          .getPublicUrl(`documents/${fileName}`);

        uploaded.push({
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          date: new Date().toLocaleDateString(),
          url: urlData.publicUrl,
        });
      }
    }

    setUploadedFiles((prev) => [...prev, ...uploaded]);
    toast.success("✅ Files Uploaded Successfully");
    e.target.value = "";
  };

  // const handleSubmit = async () => {
  //   if (uploadedFiles.length === 0) {
  //     toast.error("❌ Please Upload Files Before Submitting");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     for (let file of uploadedFiles) {
  //       const { data, error } = await supabase
  //         .from("caseform")
  //         .insert([
  //           {
  //             name: file.name,
  //             size: file.size,
  //             date: file.date,
  //             url: file.url,
  //           },
  //         ]);

  //       if (error) {
  //         console.error("Insert Error:", error);
  //         toast.error("❌ Something went wrong");
  //         return;
  //       }
  //     }
  //     toast.success("✅ Case Files Submitted Successfully");
  //     setUploadedFiles([]);
  //   } catch (err) {
  //     console.error("Unexpected Error:", err);
  //     toast.error("❌ Submission Failed");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("❌ Please Upload Files Before Submitting");
      return;
    }
  
    setIsSubmitting(true);
    try {
      for (let file of uploadedFiles) {
       console.log(file.url)
        const { data, error } = await supabase
          .from("caseform")
          .update({
            client_pdf: file.url,
            lawyer_pdf: file.url,
          })
          .eq("client_id", user)
          .eq("lawyer_id", lawyerId)
          .is("client_pdf", null)
          .is("lawyer_pdf", null);
        if (error) {
          console.error("Update Error:", error);
          toast.error("❌ Something went wrong");
          return;
        }
      }
  
      toast.success("✅ Case Files Submitted Successfully");
      // setUploadedFiles([]);
      navigate(`/filter`);
    } catch (err) {
      console.error("Unexpected Error:", err);
      toast.error("❌ Submission Failed");
    } finally {
      setIsSubmitting(false);
    }
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
                      <th className="p-3 text-sm text-gray-700">Preview</th>
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
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Preview 🔥
                          </a>
                        </td>
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
              {/* Centering the Submit Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`bg-secondary text-white text-lg rounded-md px-6 py-2 ${
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
              <button
                onClick={handleUploadClick}
                className="bg-secondary text-white text-lg rounded-md px-6 py-2 hover:shadow-xl"
              >
                Upload Files
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
  
};

export default Review;
