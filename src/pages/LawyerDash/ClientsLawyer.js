import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiMenu3Fill, RiMenu2Line } from "react-icons/ri";
import Header from "../../component/Header";
import supabase from "../../supabaseClient";

const ClientsLawyer = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve user details from localStorage
  const userId = localStorage.getItem("id");
  const isLawyerSelected = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).isLawyerSelected
    : false;

  useEffect(() => {
    if (!userId || !isLawyerSelected) {
      setError('Please log in as a lawyer to view cases.');
      navigate('/login');
      return;
    }

    fetchCases(userId);

    // Real-time subscription for case updates
    const channel = supabase.channel('lawyer-cases')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'caseform', filter: `lawyer_id=eq.${userId}` },
        (payload) => {
          fetchCases(userId); // Refresh cases on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // Clean up subscription on unmount
    };
  }, [userId, navigate, isLawyerSelected]);

  async function fetchCases(lawyerId) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('caseform')
        .select(`
          id,
          case_name,
          category,
          phone_number,
          location,
          description,
          client_id,
          status,
          created_at,
          client_pdf,
          lawyer_pdf
        `)
        .eq('lawyer_id', lawyerId) // Filter cases assigned to this lawyer
        .order('created_at', { ascending: true }); // Order by creation time

      if (error) throw error;

      // Fetch client names for each case (if client_id exists)
      const casesWithClients = await Promise.all(
        data.map(async (caseItem) => {
          if (caseItem.client_id) {
            const { data: clientData, error: clientError } = await supabase
              .from('clients')
              .select('first_name, last_name')
              .eq('id', caseItem.client_id)
              .single();

            if (clientError) throw clientError;

            return {
              ...caseItem,
              clientName: clientData ? `${clientData.first_name} ${clientData.last_name}` : 'Unknown Client',
            };
          }
          return { ...caseItem, clientName: 'Unknown Client' };
        })
      );

      setCases(casesWithClients || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(caseId, newStatus) {
    try {
      const { error } = await supabase
        .from('caseform')
        .update({ status: newStatus })
        .eq('id', caseId);

      if (error) throw error;

      // Update local state to reflect the change
      setCases(cases.map(caseItem =>
        caseItem.id === caseId ? { ...caseItem, status: newStatus } : caseItem
      ));
      alert(`Case ${caseId} status updated to ${newStatus}`);
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) {
    return (
      <section className="bg-bg1 min-h-screen">
        <Header />
        <div className="flex flex-col text-center text-2xl font-bold py-10">Loading cases...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-bg1 min-h-screen">
        <Header />
        <div className="flex flex-col text-center text-red-500 text-2xl font-bold py-10">{error}</div>
      </section>
    );
  }

  return (
    <section className="bg-bg1 min-h-screen">
      <Header />
      <div className="flex flex-col">
        {/* Menu */}
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

        {/* Cases Table */}
        <div className="flex-1 p-6 w-full">
          <div className="bg-white/30 backdrop-blur-md rounded-lg p-4 shadow-lg glass-effect">
            <h3 className="text-2xl font-semibold mb-4 text-black text-center md:text-left">
              Cases
            </h3>
            <table className="w-full text-left text-black my-4 border">
              <thead>
                <tr className="border-b text-lg bg-gray-200">
                  <th className="py-2 px-3">Client Name</th>
                  <th className="py-2 px-3">Case Name</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Client PDF</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.length > 0 ? (
                  cases.map((caseItem) => (
                    <tr key={caseItem.id} className="border-b text-sm">
                      <td className="py-2 px-3">{caseItem.clientName}</td>
                      <td className="py-2 px-3">{caseItem.case_name || 'No data'}</td>
                      <td className="py-2 px-3">{caseItem.category || 'No data'}</td>
                      <td className="py-2 px-3 font-semibold text-blue-600">
                        {caseItem.status || 'Pending'}
                      </td>
                      <td className="py-2 px-3">
                        {caseItem.client_pdf ? (
                          <a href={caseItem.client_pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                            View PDF
                          </a>
                        ) : 'No PDF'}
                      </td>
                      <td className="py-2 px-3 flex space-x-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() => handleStatusUpdate(caseItem.id, "Accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => handleStatusUpdate(caseItem.id, "Declined")}
                        >
                          Decline
                        </button>
                        <select
                          value={caseItem.status}
                          className="border p-1 rounded"
                          onChange={(e) => handleStatusUpdate(caseItem.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No cases found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsLawyer;