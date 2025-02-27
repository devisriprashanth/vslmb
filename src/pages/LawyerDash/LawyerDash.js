import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/Header';
import { RiMenu3Fill , RiMenu2Line } from "react-icons/ri";

const LawyerDash = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState([
    { id: 1, clientName: "Bhanu", caseType: "Land Dispute", date: "2025-02-15T10:00", status: "Ongoing" },
    { id: 2, clientName: "Arun Teja", caseType: "Divorce", date: "2025-02-16T14:00", status: "Pending" }
  ]);

  const [previousClients, setPreviousClients] = useState([]);
  const [showOutcomePopup, setShowOutcomePopup] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState("");

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "Completed") {
      setShowOutcomePopup(id);
    } else {
      setAppointments(appointments.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      ));
    }
  };

  const handleOutcomeSubmit = (id) => {
    if (selectedOutcome) {
      const completed = appointments.find(app => app.id === id);
      setAppointments(appointments.filter(app => app.id !== id));
      setPreviousClients([...previousClients, { ...completed, outcome: selectedOutcome }]);
      setShowOutcomePopup(null);
      setSelectedOutcome("");
    }
  };

  return (
    <section className="min-h-screen bg-bg1 py-2 px-6">
        <Header />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lawyer Dashboard</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-blue-500 text-white px-4 py-2 rounded">
          {isMenuOpen ?   <RiMenu2Line /> : <RiMenu3Fill />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="mb-6 bg-white shadow p-4 rounded">
          <button onClick={() => navigate('/lawyer-dashboard')} className="block text-secondary mb-2">
            Dashboard
          </button>
          <button onClick={() => navigate('/clients')} className="block text-secondary">
            Clients
          </button>
          <button onClick={() => navigate('/settings')} className="block text-secondary">
            Settings
          </button>
        </nav>
      )}

      {/* Appointments Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg glass-effect mb-6">
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
      <div className="bg-white p-6 rounded-lg shadow-lg glass-effect">
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
    </section>
  );
};

export default LawyerDash