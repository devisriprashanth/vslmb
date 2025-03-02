import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import supabase from '../supabaseClient';

const ClientDash = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (!userId) {
      setError("Please log in to view your cases.");
      return;
    }
    fetchCases(userId);
  }, [userId]);

  async function fetchCases(clientId) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("caseform")
        .select(`
          id,
          case_name,
          category,
          description,
          status,
          lawyer_id,
          client_pdf
        `)
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const casesWithLawyers = await Promise.all(
        data.map(async (caseItem) => {
          if (caseItem.lawyer_id) {
            const { data: lawyerData, error: lawyerError } = await supabase
              .from("lawyers")
              .select("first_name, last_name")
              .eq("id", caseItem.lawyer_id)
              .single();

            if (lawyerError) throw lawyerError;

            return {
              ...caseItem,
              lawyerName: lawyerData ? `${lawyerData.first_name} ${lawyerData.last_name}` : "Not Assigned",
            };
          }
          return { ...caseItem, lawyerName: "Not Assigned" };
        })
      );

      setCases(casesWithLawyers || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-cover bg-center">
      <div className='bg-bg1 w-full '>
        <Header />
      </div>
      <div className="text-center text-3xl md:text-4xl font-bold text-black mt-5">
        Your Cases
      </div>
      <div className="w-full max-w-6xl bg-white/30 rounded-lg p-6 my-10 mx-1 shadow-lg backdrop-blur-md">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center">Loading cases...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : cases.length > 0 ? (
            <table className="w-full text-left text-black border-collapse">
              <thead>
                <tr className="border-b text-lg md:text-xl font-semibold">
                  <th className="py-2 px-4">Case Name</th>
                  <th className="py-2 px-4">Category</th>
                  <th className="py-2 px-4">Description</th>
                  <th className="py-2 px-4">Lawyer</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Client PDF</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b text-sm">
                    <td className="py-2 px-4">{caseItem.case_name}</td>
                    <td className="py-2 px-4">{caseItem.category}</td>
                    <td className="py-2 px-4">{caseItem.description}</td>
                    <td className="py-2 px-4">{caseItem.lawyerName}</td>
                    <td className="py-2 px-4 font-semibold text-blue-600">{caseItem.status}</td>
                    <td className="py-2 px-4">
                      {caseItem.client_pdf ? (
                        <a href={caseItem.client_pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          View PDF
                        </a>
                      ) : "No PDF"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No cases found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDash;
