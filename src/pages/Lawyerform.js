import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LawyerForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [experience, setExperience] = useState('');
  const [casesTaken, setCasesTaken] = useState('');
  const [casesWon, setCasesWon] = useState('');
  const [rating, setRating] = useState(0);
  const [successRate, setSuccessRate] = useState('');

  const handleEnrollmentChange = (e) => {
    const value = e.target.value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    setEnrollmentNumber(value);
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z]/g, '');
    setDistrict(value);
  };

  return (
    <section className="bg-bg2 min-h-screen flex flex-col items-center px-5 md:px-10 lg:px-20">
      <div className="bg-white shadow-lg rounded-xl p-5 w-full max-w-lg md:max-w-2xl lg:max-w-4xl mt-20">
        <h1 className="text-left text-3xl text-secondary">Lawyer Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className="mt-7">
            <label htmlFor="username" className="text-2xl">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="p-2 mt-2 pl-5 text-xl focus:outline-none border border-gray-300 rounded-md w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mt-5">
            <label htmlFor="experience" className="text-2xl">Experience</label>
            <input
              type="tel"
              id="experience"
              placeholder="Enter your experience in years"
              className="p-2 mt-2 pl-5 text-xl focus:outline-none border border-gray-300 rounded-md w-full"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              min="0"
              required
            />
          </div>
          <div className="mt-5">
            <label htmlFor="enrollment" className="text-2xl">Enrollment Number</label>
            <input
              type="text"
              id="enrollment"
              placeholder="Enter your Enrollment number"
              className="p-2 mt-2 pl-5 text-xl focus:outline-none border border-gray-300 rounded-md w-full"
              value={enrollmentNumber}
              onChange={handleEnrollmentChange}
              required
            />
          </div>
          <div className="mt-5">
            <label htmlFor="district" className="text-2xl">District</label>
            <select
              id="district"
              className="p-2 mt-2 pl-5 text-xl focus:outline-none border border-gray-300 rounded-md w-full"
              value={district}
              onChange={handleDistrictChange}
              required
            >
              <option value="" disabled>Select your District</option>
              {[
                "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari",
                "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", "Prakasam",
                "Srikakulam", "Sri Potti Sriramulu Nellore", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"
              ].map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>
          <div className="mt-5">
            <label htmlFor="cases-taken" className="text-2xl">Number of Cases Taken</label>
            <input
              type="tel"
              id="cases-taken"
              placeholder="Enter no of cases taken"
              className="p-2 mt-2 pl-5 text-xl focus:outline-none border border-gray-300 rounded-md w-full"
              value={casesTaken}
              onChange={(e) => setCasesTaken(e.target.value)}
              min="0"
              required
            />
          </div>
          <div className="mt-5">
            <label htmlFor="cases-won" className="text-2xl">Number of Cases Won</label>
            <input
              type="tel"
              id="cases-won"
              placeholder="Enter no of cases won"
              className="p-2 mt-2 pl-5 text-xl focus:outline-none border border-gray-300 rounded-md w-full"
              value={casesWon}
              onChange={(e) => setCasesWon(e.target.value)}
              min="0"
              required
            />
          </div>
          <div className="mt-5">
            <label htmlFor="rating" className="text-2xl">Rating</label>
            <input
              type="tel"
              id="rating"
              placeholder="Enter rating"
              className="p-2 mt-2 pl-5 text-xl focus:outline-none border border-gray-300 rounded-md w-full"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="0"
              max="5"
              step="0.1"
              required
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mt-10 gap-5">
            <button
              type="submit"
              className="bg-secondary p-3 w-full md:w-1/3 cursor-pointer rounded-md text-white text-xl"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LawyerForm;