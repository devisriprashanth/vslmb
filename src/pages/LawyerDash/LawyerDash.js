import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../component/Header';
import { RiMenu3Fill, RiMenu2Line } from "react-icons/ri";
import supabase from '../../supabaseClient';

const LawyerDash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [previousClients, setPreviousClients] = useState([]);
  const [showOutcomePopup, setShowOutcomePopup] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const lawyerId = storedUser?.id;

    if (!lawyerId && !loading) {
      navigate('/login');
      return;
    }

    const checkLawyerForm = async () => {
      if (!lawyerId) {
        console.log("No lawyerId, showing toggle");
        setShowAlert(true);
        return;
      }

      console.log("Checking lawyers_form for ID:", lawyerId);
      const { data, error } = await supabase
        .from("lawyers_form")
        .select("id")
        .eq("id", lawyerId);

      console.log("Supabase response - Data:", data, "Error:", error);
      if (error) {
        console.error("Error checking lawyers_form:", error.message);
        setShowAlert(true); // Show toggle on error (assume not filled)
      } else if (!data || data.length === 0) {
        console.log("No data found in lawyers_form, showing toggle");
        setShowAlert(true); // No entry, show toggle
      } else {
        console.log("Data found in lawyers_form, hiding toggle");
        setShowAlert(false); // Entry exists, hide toggle
      }
    };

    const fetchAppointments = async () => {
      if (!lawyerId) return;

      const { data, error } = await supabase
        .from("case_form")
        .select("*")
        .eq("lawyer_id", lawyerId);

      if (error) {
        console.error("Failed to fetch appointments:", error);
      } else {
        setAppointments(data || []);
      }
    };

    const initialize = async () => {
      try {
        await Promise.all([checkLawyerForm(), fetchAppointments()]);
      } catch (err) {
        console.error("Initialization error:", err);
        setShowAlert(true); // Show toggle on failure as fallback
      } finally {
        setLoading(false);
        console.log("Loading complete, showAlert:", showAlert);
      }
    };

    initialize();
  }, [location, navigate]);

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === "Completed") {
      setShowOutcomePopup(id);
    } else {
      setAppointments(appointments.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      ));

      const { error } = await supabase
        .from("case_form")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  const handleOutcomeSubmit = async (id) => {
    if (selectedOutcome) {
      const completed = appointments.find((app) => app.id === id);
      setAppointments(appointments.filter((app) => app.id !== id));
      setPreviousClients([...previousClients, { ...completed, outcome: selectedOutcome }]);

      const { error } = await supabase
        .from("case_form")
        .update({ status: "Completed", outcome: selectedOutcome })
        .eq("id", id);

      if (error) {
        console.error("Failed to update outcome:", error);
      } else {
        setShowOutcomePopup(null);
        setSelectedOutcome("");
      }
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-bg1 py-2">
        <div className='shadow-md shadow-black/30 w-full'>
          <Header />
        </div>
        <div className="text-center py-10 text-xl">Loading...</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-bg1 py-2">
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

        {/* Notification Toggle: Show if no data in lawyers_form, Hide if data present */}
        {showAlert && (
          <div className="bg-yellow-500 text-white p-4 rounded-lg mb-6 text-center">
            <p>
              Welcome! Please fill out your profile form to get started.{' '}
              <span
                onClick={() => navigate('/lawyer-form')}
                className="underline cursor-pointer"
              >
                Fill out the form
              </span>
            </p>
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
                    <td>{app.client_name || "N/A"}</td>
                    <td>{app.case_type || "N/A"}</td>
                    <td>
                      <input
                        type="date"
                        value={app.date ? app.date.split("T")[0] : ""}
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
                        value={app.status || "Pending"}
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
                  {client.client_name || "N/A"} - {client.case_type || "N/A"} ({client.outcome})
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
                  className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleOutcomeSubmit(showOutcomePopup)}
                >
                  Submit
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setShowOutcomePopup(null);
                    setSelectedOutcome("");
                  }}
                >
                  Cancel
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