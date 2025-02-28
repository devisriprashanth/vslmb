import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import supabase from "../../supabaseClient";

const Clientform = () => {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const { state } = locationHook;

  const [caseName, setCaseName] = useState("");
  const [category, setCategory] = useState(state?.category || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState(state?.location || "");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!caseName || !category || !phoneNumber || !location || !description) {
      toast.error("Please Fill All Fields");
      return;
    }

    if (phoneNumber.length !== 10) {
      toast.error("Invalid Phone Number");
      return;
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("User Not Authenticated");
      return;
    }

    const lawyerId = locationHook.pathname.split("/")[2]; // Getting lawyer id from URL

    const { error } = await supabase
      .from("caseform")
      .insert([
        {
          client_id: user.id,
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
      navigate("/upload");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center mb-4 text-xl font-bold">Case Details</h2>
        <input
          type="text"
          placeholder="Case Name"
          value={caseName}
          onChange={(e) => setCaseName(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          maxLength={10}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        ></textarea>

        <button onClick={handleSubmit} className="bg-secondary p-2 w-full">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Clientform;
