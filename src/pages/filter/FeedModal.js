import React from 'react';
import { FaBriefcase, FaMapLocationDot, FaUserTie } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { VscGraph } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import star from '../../assets/icons/star.svg';
import supabase from '../../supabaseClient'; // Import Supabase client
import toast from "react-hot-toast";

const FeedModal = ({ lawyer, onClose }) => {
  console.log(lawyer);
  const navigate = useNavigate();
  //testing user id presnet or not
  const userId = localStorage.getItem("id");
  console.log(userId)
  if (!lawyer) return null;

  // const handleUpload = async () => {
  //   // Check if the user is authenticated before navigating
  //   const { data: { user }, error } = await supabase.auth.getUser();
  //   if (!user || error) {
  //     toast.error("Please log in to submit a case.");
  //     navigate("/login");
  //     return;
  //   }

  //   // If authenticated, navigate to the case form
  //   navigate(`/caseform/${lawyer.id}`, {
  //     state: {
  //       category: lawyer.category,
  //       location: lawyer.location,
  //     }
  //   });
  // };
  const handleUpload = () => {
    const userId = localStorage.getItem("id");
  
    console.log("User ID from localStorage:", userId);
  
    if (!userId || userId === "null" || userId === "undefined") {
      toast.error("Please log in to submit a case.");
      navigate("/login");
      return;
    }
  
    console.log("Navigating to caseform...");
    navigate(`/caseform/${lawyer.uid}`, {
      state: {
        category: lawyer.category,
        location: lawyer.location,
      }
    });
  };
  
  
  
  

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg mx-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
          <FaUserTie className='mr-3' />
          {lawyer.first_name} {lawyer.last_name}
        </h2>

        <div className="space-y-3 text-gray-700">
          {lawyer.category && (
            <p>
              <strong>Category:</strong> {lawyer.category}
            </p>
          )}

          {lawyer.location && (
            <p className="flex items-center">
              <FaMapLocationDot className='w-5 h-5 mr-2 text-secondary' />
              <strong>Location:</strong> {lawyer.location}
            </p>
          )}

          {lawyer.price && (
            <p className="flex items-center">
              <GiMoneyStack className='w-5 h-5 mr-2 text-secondary' />
              <strong>Fee:</strong> ₹{lawyer.price}
            </p>
          )}

          {lawyer.experience && (
            <p className="flex items-center">
              <FaBriefcase className='w-5 h-5 mr-2 text-secondary' />
              <strong>Experience:</strong> {lawyer.experience} Years
            </p>
          )}

          {lawyer.success_rate !== undefined && (
            <p className="flex items-center">
              <VscGraph className='w-5 h-5 mr-2 text-secondary' />
              <strong>Success Rate:</strong> {Math.floor(lawyer.success_rate)}%
            </p>
          )}

          {lawyer.rating !== undefined && (
            <p className="flex items-center">
              <strong>Rating:</strong> {Math.floor(lawyer.rating)}/5
              <img src={star} alt="star" className="w-5 h-5 ml-2" />
            </p>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
          >
            Close
          </button>

          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-all"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedModal;