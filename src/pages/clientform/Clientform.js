import React, { useState, useEffect } from "react";
import "../../index.css";
import { useNavigate, useLocation } from "react-router-dom";
import form1 from "../../assets/img/caseform.jpg";
import { CiLocationOn } from "react-icons/ci";
import supabase from "../../supabaseClient";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Clientform = () => {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const [caseName, setCaseName] = useState("");
  const [category, setCategory] = useState(locationHook.state?.category || ""); // Set initial category from location state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState(locationHook.state?.location || ""); // Set initial location from location state
  const [description, setDescription] = useState("");

  const { id } = useParams(); // Get 'id' from URL
  const lawyerId = id.toString();
  console.log("ID from URL:", lawyerId);

  useEffect(() => {
    const userId = localStorage.getItem("id");
  
    if (!userId) {
      toast.error("Please log in to submit a case.");
      navigate("/login");
    }
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
    const user = localStorage.getItem("id"); // Get stored user ID
    if (!user) {
      toast.error("User Not Authenticated");
      navigate("/login");
      return;
    }
  
    try {
      // Insert into the caseform table
      const { data, error } = await supabase
        .from("caseform")
        .insert([
          {
            client_id: user, // Use `user` directly
            lawyer_id: lawyerId,
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
        navigate(`/upload/${user}/${lawyerId}`);
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      toast.error("Something went wrong!");
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
              className={`p-2 border border-gray-300 rounded-md text-lg bg-white ${category ? '' : 'text-gray-300'}`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled // Disable the category select element
            >
              <option value="" hidden>
                Category
              </option>
              <option value="Criminal Lawyer">Criminal Lawyer</option>
              <option value="Family Lawyer">Family Lawyer</option>
              <option value="Corporate Lawyer">Corporate Lawyer</option>
              <option value="Civil Litigation Lawyer">Civil Litigation Lawyer</option>
              <option value="Intellectual Property Lawyer">Intellectual Property Lawyer</option>
              <option value="Tax Lawyer">Tax Lawyer</option>
              <option value="Employment Lawyer">Employment Lawyer</option>
              <option value="Real Estate Lawyer">Real Estate Lawyer</option>
              <option value="Immigration Lawyer">Immigration Lawyer</option>
              <option value="Personal Injury Lawyer">Personal Injury Lawyer</option>
              <option value="Medical Malpractice Lawyer">Medical Malpractice Lawyer</option>
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
                className={`py-2 rounded-md w-full text-lg bg-white ${location ? '' : 'text-gray-300'}`}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled // Disable the location select element
              >
                <option value="" hidden>
                  Location
                </option>
                <option value="Anakapalli">Anakapalli</option>
                <option value="Ananthapuramu">Ananthapuramu</option>
                <option value="Bapatla">Bapatla</option>
                <option value="Chittoor">Chittoor</option>
                <option value="East Godavari">East Godavari</option>
                <option value="Eluru">Eluru</option>
                <option value="Guntur">Guntur</option>
                <option value="Kadapa">Kadapa</option>
                <option value="Krishna">Krishna</option>
                <option value="Kurnool">Kurnool</option>
                <option value="Nandyal">Nandyal</option>
                <option value="NTR">NTR</option>
                <option value="Palnadu">Palnadu</option>
                <option value="Prakasam">Prakasam</option>
                <option value="Srikakulam">Srikakulam</option>
                <option value="Tirupati">Tirupati</option>
                <option value="Visakhapatnam">Visakhapatnam</option>
                <option value="Vizianagaram">Vizianagaram</option>
                <option value="YSR Kadapa">YSR Kadapa</option>
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