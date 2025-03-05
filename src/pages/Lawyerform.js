import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Header from '../component/Header';

const LawyerForm = () => {
  const navigate = useNavigate();

  // Get Stored Lawyer Details
  const lawyerId = localStorage.getItem("id");
  const firstName = localStorage.getItem("first_name");

  // Form State
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [price, setPrice] = useState('');
  const [district, setDistrict] = useState('');
  const [experience, setExperience] = useState('');
  const [casesTaken, setCasesTaken] = useState('');
  const [casesWon, setCasesWon] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(true); // State to track if it's a new user

  // Enrollment Number Validation
  const enrollmentPattern = /^AP\/\d{1,3}(-[A-Z])?\/\d{4}$/;

  const handleEnrollmentChange = (e) => {
    const value = e.target.value.toUpperCase();
    setEnrollmentNumber(value);
    if (enrollmentPattern.test(value) || value === '') {
      setError('');
    } else {
      setError('❌ Invalid Enrollment Number Format');
    }
  };

  useEffect(() => {
    // Check if the user is an existing user with 'Declined' status
    const checkUserStatus = async () => {
      const { data, error } = await supabase
        .from('lawyers_form')
        .select('status')
        .eq('first_name', firstName)
        .single();

      if (data && data.status === 'Declined') {
        setIsNewUser(false);
      }
    };

    checkUserStatus();
  }, [firstName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(casesWon) > parseInt(casesTaken)) {
      alert("Cases Won cannot be greater than Cases Taken");
      return;
    }

    if (isNewUser) {
      // Insert a new row for new users
      const { data, error } = await supabase.from("lawyers_form").insert([
        {
          uid: lawyerId,
          first_name: firstName,
          enrollment_number: enrollmentNumber,
          location: district,
          price: parseFloat(price),
          experience: parseInt(experience),
          category: category,
          cases_taken: parseInt(casesTaken),
          cases_won: parseInt(casesWon),
        }
      ]);

      if (error) {
        console.error("❌ Error:", error);
        alert("❌ Something went wrong");
      } else {
        alert("✅ Form Submitted Successfully");
        navigate("/lawyer-dashboard");
      }
    } else {
      // Update the existing row for users with 'Declined' status
      const { data, error } = await supabase
        .from("lawyers_form")
        .update({
          enrollment_number: enrollmentNumber,
          location: district,
          price: parseFloat(price),
          experience: parseInt(experience),
          category: category,
          cases_taken: parseInt(casesTaken),
          cases_won: parseInt(casesWon),
          status: 'Pending' // Reset status to default
        })
        .eq('first_name', firstName);

      if (error) {
        console.error("❌ Error:", error);
        alert("❌ Something went wrong");
      } else {
        alert("✅ Form Updated Successfully");
        navigate("/lawyer-dashboard");
      }
    }
  };

  const lawyerCategories = [
    'Corporate Lawyer', 'Criminal Lawyer', 'Civil Litigation Lawyer',
    'Family Lawyer', 'Intellectual Property Lawyer', 'Tax Lawyer',
    'Employment Lawyer', 'Real Estate Lawyer', 'Immigration Lawyer',
    'Personal Injury Lawyer', 'Medical Malpractice Lawyer'
  ];

  const districts = [
    "Anakapalli", "Ananthapuramu", "Bapatla", "Chittoor", "East Godavari",
    "Eluru", "Guntur", "Kadapa", "Krishna", "Kurnool", "Nandyal", "NTR",
    "Palnadu", "Prakasam", "Srikakulam", "Tirupati", "Visakhapatnam", 
    "Vizianagaram", "YSR Kadapa"
  ];

  return (
    <section className="bg-bg1 min-h-screen flex flex-col items-center px-5">
      <Header />
      <div className="bg-white/60 shadow-lg rounded-xl p-5 w-full max-w-lg mt-10">
        <h1 className="text-3xl text-secondary text-center">
          {isNewUser ? 'Lawyer Registration 🧑‍⚖️' : 'Update Lawyer Information 🧑‍⚖️'}
        </h1>

        <form onSubmit={handleSubmit} className="mt-5">
          {/* Enrollment Number */}
          <div>
            <label className="text-2xl">Enrollment Number</label>
            <input
              type="text"
              className="p-2 w-full border rounded-md"
              placeholder="AP/123/2025"
              value={enrollmentNumber}
              onChange={handleEnrollmentChange}
              required
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>

          {/* Category */}
          <div className="mt-5">
            <label className="text-2xl">Category</label>
            <select
              className="p-2 w-full border rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select Category</option>
              {lawyerCategories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className="mt-5">
            <label className="text-2xl">District</label>
            <select
              className="p-2 w-full border rounded-md"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            >
              <option value="" disabled>Select District</option>
              {districts.map((dist, index) => (
                <option key={index} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="mt-5">
            <label className="text-2xl">Price Per Case</label>
            <input
              type="tel"
              className="p-2 w-full border rounded-md"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          {/* Experience */}
          <div className="mt-5">
            <label className="text-2xl">Experience (in years)</label>
            <input
              type="tel"
              className="p-2 w-full border rounded-md"
              placeholder="Enter Experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            />
          </div>

          {/* Cases Taken */}
          <div className="mt-5">
            <label className="text-2xl">Cases Taken</label>
            <input
              type="tel"
              className="p-2 w-full border rounded-md"
              value={casesTaken}
              onChange={(e) => setCasesTaken(e.target.value)}
              required
            />
          </div>

          {/* Cases Won */}
          <div className="mt-5">
            <label className="text-2xl">Cases Won</label>
            <input
              type="tel"
              className="p-2 w-full border rounded-md"
              value={casesWon}
              onChange={(e) => setCasesWon(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-10 bg-secondary p-3 text-white rounded-md w-full text-xl hover:bg-primary transition"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default LawyerForm;
