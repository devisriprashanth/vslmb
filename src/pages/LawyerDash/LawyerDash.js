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
  const [editedAppointments, setEditedAppointments] = useState({}); // Track edited appointments
  const [accountStatus, setAccountStatus] = useState(""); // Track account status

  useEffect(() => {
    const checkLawyerForm = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      console.log("Stored User:", storedUser); // Debugging
      const userName = storedUser?.first_name || "";

      if (!userName) {
        console.warn("No userName found in localStorage");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("lawyers_form")
          .select("first_name, status") // Fetch multiple rows
          .eq("first_name", userName);

        if (error) {
          console.error("Failed to fetch lawyers_form data:", error);
          return;
        }

        console.log("Fetched Data:", data);

        if (data.length > 0) {
          setAccountStatus(data[0].status);
          setShowAlert(false); // Hide alert if first_name is found
        } else {
          setShowAlert(true);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    checkLawyerForm();
  }, []); // Run only once on mount

  useEffect(() => {
    const fetchAppointments = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userName = storedUser?.first_name || "";

      if (!userName) {
        console.warn("No userName found in localStorage");
        return;
      }

      try {
        const { data: caseformData, error: caseformError } = await supabase
          .from("caseform")
          .select("*");

        if (caseformError) {
          console.error("Error fetching caseform data:", caseformError);
          return;
        }

        const appointmentsWithClientNames = await Promise.all(
          caseformData.map(async (item) => {
            const { data: lawyerData, error: lawyerError } = await supabase
              .from("lawyers")
              .select("first_name")
              .eq("id", item.lawyer_id)
              .single();

            if (lawyerError) {
              console.error("Error fetching lawyer data:", lawyerError);
              return null;
            }

            if (lawyerData.first_name !== userName) {
              return null;
            }

            const { data: clientData, error: clientError } = await supabase
              .from("clients")
              .select("first_name")
              .eq("id", item.client_id)
              .single();

            if (clientError) {
              console.error("Error fetching client data:", clientError);
              return { ...item, clientName: "Unknown" };
            }

            return {
              id: item.id,
              clientName: clientData.first_name, // extracting client name from client_id
              caseType: item.category,           // extracting case type from category
              caseName: item.case_name,          // extracting case name from case_name
              appointment_datetime: item.appointment_datetime || "", // ensure appointment_datetime is defined
              status: item.status
            };
          })
        );

        const upcomingAppointments = appointmentsWithClientNames.filter(app => app !== null && app.status !== "Completed");
        const completedAppointments = appointmentsWithClientNames.filter(app => app !== null && app.status === "Completed");

        setAppointments(upcomingAppointments);
        setPreviousClients(completedAppointments);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    if (accountStatus === "Accepted") {
      fetchAppointments();
    }
  }, [accountStatus]);

  const handleStatusChange = (id, newStatus) => {
    setEditedAppointments({
      ...editedAppointments,
      [id]: { ...editedAppointments[id], status: newStatus }
    });
    setAppointments(appointments.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const handleDatetimeChange = (id, newDatetime) => {
    setEditedAppointments({
      ...editedAppointments,
      [id]: { ...editedAppointments[id], appointment_datetime: newDatetime }
    });
    setAppointments(appointments.map((app) =>
      app.id === id ? { ...app, appointment_datetime: newDatetime } : app
    ));
  };

  const handleUpdate = async () => {
    try {
      const updates = Object.keys(editedAppointments).map(async (id) => {
        const { appointment_datetime, status } = editedAppointments[id];
        const { error } = await supabase
          .from("caseform")
          .update({ appointment_datetime, status })
          .eq("id", id);

        if (error) {
          console.error("Error updating appointment:", error);
        }
      });

      await Promise.all(updates);
      setEditedAppointments({});
      alert("Appointments updated successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
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
                <button
                  onClick={() => navigate('/lawyer-dashboard/clients')}
                  className={`block w-full px-6 py-3 ${accountStatus !== "Accepted" ? "text-gray-400 bg-gray-200" : "text-black hover:bg-gray-200"}`}
                  disabled={accountStatus !== "Accepted"}
                >
                  Clients
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className={`block w-full px-6 py-3 ${accountStatus !== "Accepted" ? "text-gray-400 bg-gray-200" : "text-black hover:bg-gray-200"}`}
                  disabled={accountStatus !== "Accepted"}
                >
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

        {accountStatus === "Accepted" ? (
          <>
            {/* Appointments Section */}
            <div className="bg-white/70 p-6 rounded-lg shadow-lg glass-effect px-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-black">Upcoming Appointments</h2>
              {appointments.length > 0 ? (
                <>
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th>Client Name</th>
                        <th>Case Type</th>
                        <th>Case Name</th>
                        <th>Appointment Date & Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((app) => (
                        <tr key={app.id} className="border-b">
                          <td>{app.clientName}</td>
                          <td>{app.caseType}</td>
                          <td>{app.caseName}</td>
                          <td>
                            <input
                              type="datetime-local"
                              value={app.appointment_datetime ? app.appointment_datetime.split(".")[0] : ""}
                              className="border p-1 rounded w-full sm:w-auto"
                              onChange={(e) => handleDatetimeChange(app.id, e.target.value)}
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
                  {Object.keys(editedAppointments).length > 0 && (
                    <button
                      onClick={handleUpdate}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Update
                    </button>
                  )}
                </>
              ) : (
                <p>No Upcoming Appointments</p>
              )}
            </div>

            {/* Previous Clients Section */}
            <div className="bg-white/70 p-6 rounded-lg shadow-lg glass-effect">
              <h2 className="text-lg font-semibold mb-4 text-black">Previous Clients</h2>
              {previousClients.length > 0 ? (
                <ul>
                  {previousClients.map((app, index) => (
                    <li key={index} className="mb-2">
                      {app.clientName} - {app.caseType} - {app.caseName} - {app.status} - {app.appointment_datetime}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No Previous Clients</p>
              )}
            </div>
          </>
        ) : accountStatus === "Declined" ? (
          <div className="bg-red-200 text-red-900 p-4 rounded-lg shadow-md mb-6">
            <p className="font-semibold">Your account is not accepted by the SLMB Admin.</p>
          </div>
        ) : (
          <div className="bg-yellow-200 text-yellow-900 p-4 rounded-lg shadow-md mb-6">
            <p className="font-semibold">Your account is in pending state.</p>
          </div>
        )}

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