import React, { useState, useEffect } from "react";
import "../../index.css";
import { useNavigate, useLocation } from "react-router-dom";
import form1 from "../../assets/img/caseform.jpg";
import { CiLocationOn } from "react-icons/ci";
import supabase from "../../supabaseClient";
import toast from "react-hot-toast";

const Clientform = () => {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const [caseName, setCaseName] = useState("");
  const [category, setCategory] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!user || error) {
        toast.error("Please log in to submit a case.");
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!caseName || !category || !phoneNumber || !location || !description) {
      toast.error("Please Fill All Fields");
      return;
    }

    // Validate phone number length
    if (phoneNumber.length !== 10) {
      toast.error("Invalid Phone Number");
      return;
    }

    // Get the authenticated user (client) for client_id
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      toast.error("User Not Authenticated");
      console.error("Auth Error:", authError);
      navigate("/login");
      return;
    }

    // Insert into the caseform table
    const { data, error } = await supabase
      .from("caseform")
      .insert([
        {
          client_id: user.id,
          lawyer_id: locationHook.pathname.split("/")[2],
          case_name: caseName,
          category: category,
          phone_number: phoneNumber,
          location: location,
          description: description,
        },
      ]);

    if (error) {
      console.error("Upload Error:", error);
      toast.error("Submission Failed ❌");
    } else {
      toast.success("Form Submitted Successfully ✅");
      navigate("/upload");
    }
  };

  return (
    <>
      <section
        className="w-full h-screen bg-cover bg-center flex justify-center items-center p-4"
        style={{ backgroundImage: `url(${form1})` }}
      >
        <div className="bg-white/80 rounded-xl w-full max-w-lg p-6">
          <h1 className="text-center text-black font-bold text-2xl mb-4">
            Case Details
          </h1>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter Case Name"
              className="p-2 border border-gray-300 rounded-md text-lg"
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
            />
            <select
              className="p-2 border border-gray-300 rounded-md text-lg bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" hidden>
                Category
              </option>
              <option value="Criminal Lawyer">Criminal Lawyer</option>
              <option value="Family Lawyer">Family Lawyer</option>
              <option value="Corporate Lawyer">Corporate Lawyer</option>
            </select>
            <input
              type="tel"
              placeholder="Phone Number"
              maxLength={10}
              className="p-2 border border-gray-300 rounded-md text-lg"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div className="flex items-center border border-gray-300 rounded-md bg-white">
              <CiLocationOn className="text-gray-500 mx-2 text-lg" />
              <select
                className="py-2 rounded-md w-full text-lg bg-white"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="" hidden>
                  Location
                </option>
                <option value="Guntur">Guntur</option>
                <option value="Tirupati">Tirupati</option>
                <option value="Vizag">Vizag</option>
              </select>
            </div>
            <textarea
              className="p-3 border border-gray-300 rounded-md h-32"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <button
              className="p-2 bg-secondary text-white rounded-md"
              onClick={handleSubmit}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Clientform;