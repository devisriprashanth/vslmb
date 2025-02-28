// LawyerDash.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/Header';
import { RiMenu3Fill, RiMenu2Line } from "react-icons/ri";
import supabase from '../../supabaseClient';

const LawyerDash = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [previousClients, setPreviousClients] = useState([]);
  const [showOutcomePopup, setShowOutcomePopup] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [showAlert, setShowAlert] = useState(true); // State to control alert visibility

  // Fetch userName from localStorage and check against lawyers_form
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userName = storedUser?.first_name || '';

    const checkLawyerForm = async () => {
      const { data, error } = await supabase.from("lawyers_form").select("first_name");

      if (error) {
        console.error("Failed to fetch lawyers_form data:", error);
        return;
      }

      // Check if userName matches any first_name in lawyers_form
      const isMatch = data.some((lawyer) => lawyer.first_name === userName);
      setShowAlert(!isMatch); // Show alert if no match, hide if there's a match
    };

    if (userName) {
      checkLawyerForm();
    }
  }, []);

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "Completed") {
      setShowOutcomePopup(id);
    } else {
      setAppointments(appointments.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      ));
    }
  };

  const handleOutcomeSubmit = (id) => {
    if (selectedOutcome) {
      const completed = appointments.find((app) => app.id === id);
      setAppointments(appointments.filter((app) => app.id !== id));
      setPreviousClients([...previousClients, { ...completed, outcome: selectedOutcome }]);
      setShowOutcomePopup(null);
      setSelectedOutcome("");
    }
  };

  return (
    <section className="min-h-screen bg-bg1 py-2 ">
      <div className='shadow-md shadow-black/30 w-full'>
        <Header />
      </div>
      <div className='py-2 px-8'>
      <div className="flex justify-between items-center px-3 mt-3 md:px-5 mb-6 w-auto">
        <h1 className="text-2xl font-bold">Lawyer Dashboard</h1>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-secondary text-white px-4 py-2 rounded"
          >
            {isMenuOpen ? <RiMenu2Line /> : <RiMenu3Fill />}
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-12 bg-white w-auto rounded-lg shadow-lg z-40 animate-slide-down">
              <button onClick={() => navigate('/lawyer-dashboard')} className="block w-full px-6 py-3 text-black hover:bg-gray-200">
                Dashboard
              </button>
              <button onClick={() => navigate('/lawyer-dashboard/clients')} className="block w-full px-6 py-3 text-black hover:bg-gray-200">
                Clients
              </button>
              <button onClick={() => navigate('/settings')} className="block w-full px-6 py-3 text-black hover:bg-gray-200">
                Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alert Section - Conditionally Rendered */}
      {showAlert && (
        <div className="bg-yellow-200 text-yellow-900 p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
          <p className="font-semibold">Please fill out the required form to complete your profile.</p>
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded"
            onClick={() => navigate('/lawyer-form')}
          >
            Fill Form
          </button>
        </div>
      )}

      {/* Appointments Section */}
      <div className="bg-white/70 p-6 rounded-lg shadow-lg glass-effect px-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-black">Upcoming Appointments</h2>
        {appointments.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Case Type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id} className="border-b">
                  <td>{app.clientName}</td>
                  <td>{app.caseType}</td>
                  <td>
                    <input
                      type="date"
                      value={app.date.split("T")[0]}
                      className="border p-1 rounded w-full sm:w-auto"
                      onChange={(e) =>
                        setAppointments(
                          appointments.map((a) =>
                            a.id === app.id ? { ...a, date: e.target.value } : a
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={app.status}
                      className="border p-1 rounded"
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Ongoing</option>
                      <option>Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Upcoming Appointments</p>
        )}
      </div>

      {/* Previous Clients Section */}
      <div className="bg-white/70 p-6 rounded-lg shadow-lg glass-effect">
        <h2 className="text-lg font-semibold mb-4 text-black">Previous Clients</h2>
        {previousClients.length > 0 ? (
          <ul>
            {previousClients.map((client, index) => (
              <li key={index} className="mb-2">
                {client.clientName} - {client.caseType} ({client.outcome})
              </li>
            ))}
          </ul>
        ) : (
          <p>No Previous Clients</p>
        )}
      </div>

      {/* Outcome Popup */}
      {showOutcomePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg mb-4">Select Case Outcome</h3>
            <label>
              <input
                type="radio"
                value="Win"
                name="outcome"
                onChange={() => setSelectedOutcome("Win")}
              /> Win
            </label>
            <br />
            <label>
              <input
                type="radio"
                value="Lost"
                name="outcome"
                onChange={() => setSelectedOutcome("Lost")}
              /> Lost
            </label>
            <br />
            <label>
              <input
                type="radio"
                value="Settled"
                name="outcome"
                onChange={() => setSelectedOutcome("Settled")}
              /> Settled
            </label>
            <div className="mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => handleOutcomeSubmit(showOutcomePopup)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      
    </section>
  );
};

export default LawyerDash;