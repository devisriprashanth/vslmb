import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiMenu3Fill, RiMenu2Line } from "react-icons/ri";
import Header from "../../component/Header";
import { createClient } from "@supabase/supabase-js";
import supabase from '../../supabaseClient';



const ClientsLawyer = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch Appointments from Supabase
  const fetchAppointments = async () => {
    const { data, error } = await supabase.from("appointments").select("*");
    if (error) console.error("Error fetching appointments:", error);
    else setAppointments(data);
  };

  // Update case status
  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) {
      console.error("Error updating status:", error);
    } else {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: newStatus } : appt
        )
      );
    }
  };

  const Menu = () => (
    <div className="flex justify-between items-center px-3 md:px-5 mb-6 w-auto">
      <h1 className="text-2xl font-bold">Clients List</h1>
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-secondary text-white px-4 py-2 rounded"
        >
          {isMenuOpen ? <RiMenu2Line /> : <RiMenu3Fill />}
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 top-12 bg-white w-auto rounded-lg shadow-lg z-40 animate-slide-down">
            <button
              onClick={() => navigate("/lawyer-dashboard")}
              className="block w-full px-6 py-3 text-black hover:bg-gray-200"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/lawyer-dashboard/clients")}
              className="block w-full px-6 py-3 text-black hover:bg-gray-200"
            >
              Clients
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="block w-full px-6 py-3 text-black hover:bg-gray-200"
            >
              Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const AppointmentTable = () => (
    <table className="w-full text-left text-black my-4 border">
      <thead>
        <tr className="border-b text-lg bg-gray-200">
          <th className="py-2 px-3">Client Name</th>
          <th className="py-2 px-3">Case Type</th>
          <th className="py-2 px-3">Hearing</th>
          <th className="py-2 px-3">Status</th>
          <th className="py-2 px-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <tr key={appointment.id} className="border-b text-sm">
              <td className="py-2 px-3">{appointment.client_name}</td>
              <td className="py-2 px-3">{appointment.case_type}</td>
              <td className="py-2 px-3">{appointment.hearing_date}</td>
              <td className="py-2 px-3 font-semibold text-blue-600">
                {appointment.status}
              </td>
              <td className="py-2 px-3 flex space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => updateStatus(appointment.id, "Accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => updateStatus(appointment.id, "Declined")}
                >
                  Decline
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4">
              No appointments found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <section className="bg-bg1 min-h-screen">
      <Header />
      <div className="flex flex-col">
        <Menu />
        <div className="flex-1 p-6 w-full">
          <div className="bg-white/30 backdrop-blur-md rounded-lg p-4 shadow-lg glass-effect">
            <h3 className="text-2xl font-semibold mb-4 text-black text-center md:text-left">
              Appointments
            </h3>
            <AppointmentTable />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsLawyer;
