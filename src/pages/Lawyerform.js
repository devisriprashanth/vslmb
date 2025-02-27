import React, { useState } from 'react';

const LawyerForm = () => {
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [experience, setExperience] = useState('');
  const [casesTaken, setCasesTaken] = useState('');
  const [casesWon, setCasesWon] = useState('');

  const handleEnrollmentChange = (e) => {
    const value = e.target.value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    setEnrollmentNumber(value);
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z]/g, '');
    setDistrict(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted successfully');
  };

  return (
    <section className="bg-bg2 min-h-screen flex flex-col items-center px-5 md:px-10 lg:px-20">
      <div className="bg-white/60 shadow-lg rounded-xl p-5 w-full max-w-lg md:max-w-2xl lg:max-w-4xl mt-20">
        <h1 className="text-left text-3xl text-secondary">Lawyer Registration</h1>
        <form onSubmit={handleSubmit}>
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
              {["Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari",
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
          <div className="flex flex-col w-full md:flex-row justify-between items-center mt-10 gap-5">
            <button
              type="submit"
              className="bg-secondary p-3 w-full md:w-1/3 justify-center items-center cursor-pointer rounded-md text-white text-xl"
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