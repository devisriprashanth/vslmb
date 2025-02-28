import React, { useState } from "react";
import "../../index.css";
import { useNavigate } from "react-router-dom";
import form1 from "../../assets/img/caseform.jpg";
import { CiLocationOn } from "react-icons/ci";
import  supabase  from "../../supabaseClient";



const Clientform = () => {
  const navigate = useNavigate();

  // State for Form Fields
  const [caseName, setCaseName] = useState("");
  const [category, setCategory] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // Validation Function
  const validateForm = () => {
    if (!caseName || !category || !phoneNumber || !location || !description) {
      alert("Please fill all fields");
      return false;
    }
    if (phoneNumber.length !== 10) {
      alert("Phone Number should be 10 digits");
      return false;
    }
    return true;
  };

  // Submit Function
  const handleSubmit = async () => {
    if (validateForm()) {
      const { data, error } = await supabase.from("client_form").insert([
        {
          case_name: caseName,
          category: category,
          phone_number: phoneNumber,
          location: location,
          description: description,
        },
      ]);

      if (error) {
        alert("Submission Failed!");
        console.error(error);
      } else {
        alert("Form Submitted Successfully ✅");
        navigate("/filter");
      }
    }
  };

  return (
    <>
      <section
        className="w-full h-screen md:h-auto bg-cover bg-center flex justify-center items-center p-4"
        style={{ backgroundImage: `url(${form1})` }}
      >
        <div className="bg-white/80 rounded-xl w-full max-w-lg p-6">
          <h1 className="text-center text-black font-bold text-2xl mb-4">
            Case Details
          </h1>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter the Case Name"
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
              <option value="Corporate Lawyer">Corporate Lawyer</option>
              <option value="Criminal Lawyer">Criminal Lawyer</option>
              <option value="Civil Litigation Lawyer">
                Civil Litigation Lawyer
              </option>
              <option value="Family Lawyer">Family Lawyer</option>
              <option value="Intellectual Property (IP) Lawyer">
                Intellectual Property (IP) Lawyer
              </option>
              <option value="Tax Lawyer">Tax Lawyer</option>
              <option value="Employment and Labor Lawyer">
                Employment and Labor Lawyer
              </option>
              <option value="Real Estate Lawyer">Real Estate Lawyer</option>
              <option value="Immigration Lawyer">Immigration Lawyer</option>
              <option value="Personal Injury Lawyer">
                Personal Injury Lawyer
              </option>
              <option value="Bankruptcy Lawyer">Bankruptcy Lawyer</option>
              <option value="Environmental Lawyer">
                Environmental Lawyer
              </option>
              <option value="Medical Malpractice Lawyer">
                Medical Malpractice Lawyer
              </option>
              <option value="Entertainment Lawyer">
                Entertainment Lawyer
              </option>
              <option value="Contract Lawyer">Contract Lawyer</option>
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
                
                    <option value="Anakapalli">Anakapalli</option>
                    <option value="Ananthapuramu">Ananthapuramu</option>
                    <option value="Annamayya">Annamayya</option>
                    <option value="Bapatla">Bapatla</option>
                    <option value="Chittoor">Chittoor</option>
                    <option value="Dr. B.R. Ambedkar Konaseema">Dr. B.R. Ambedkar Konaseema</option>
                    <option value="East Godavari">East Godavari</option>
                    <option value="Eluru">Eluru</option>
                    <option value="Guntur">Guntur</option>
                    <option value="Kakinada">Kakinada</option>
                    <option value="Krishna">Krishna</option>
                    <option value="Kurnool">Kurnool</option>
                    <option value="Nandyal">Nandyal</option>
                    <option value="NTR Palnadu">NTR Palnadu</option>
                    <option value="Parvathipuram Manyam">Parvathipuram Manyam</option>
                    <option value="Prakasam">Prakasam</option>
                    <option value="Srikakulam">Srikakulam</option>
                    <option value="Sri Potti Sriramulu Nellore">Sri Potti Sriramulu Nellore</option>
                    <option value="Tirupati">Tirupati</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                    <option value="Vizianagaram">Vizianagaram</option>
                    <option value="West Godavari">West Godavari</option>
                    <option value="YSR Kadapa">YSR Kadapa</option>
                
              </select>
            </div>

            <textarea
              className="p-3 border border-gray-300 rounded-md text-lg h-32 resize-none"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <p className="text-center text-lg">
              Want to add doc?{" "}
              <span
                className="text-secondary cursor-pointer"
                onClick={() => navigate("/upload")}
              >
                Upload
              </span>
            </p>

            <button
              className="p-2 bg-secondary text-white text-lg rounded-md hover:shadow-xl cursor-pointer"
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
