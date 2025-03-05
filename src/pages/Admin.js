import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import supabase from '../supabaseClient';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lawyerDetails, setLawyerDetails] = useState([]);
  const [acceptedLawyers, setAcceptedLawyers] = useState([]);

  const userId = localStorage.getItem("id");

  const fetchCases = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lawyers_form')
        .select('id, first_name, enrollment_number, location, category, experience, status');

      if (error) {
        setError('Error fetching lawyer details: ' + error.message);
        setLawyerDetails([]);
      } else {
        setLawyerDetails(data);
        setAcceptedLawyers(data.filter(lawyer => lawyer.status === 'Accepted'));
        setError(null);
      }
    } catch (error) {
      setError('Unexpected error: ' + error.message);
      setLawyerDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('lawyers_form')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        setError('Error updating status: ' + error.message);
        return;
      }

      setLawyerDetails((prevLawyerDetails) =>
        prevLawyerDetails.map((lawyer) =>
          lawyer.id === id ? { ...lawyer, status: newStatus } : lawyer
        )
      );

      setAcceptedLawyers((prevAcceptedLawyers) =>
        newStatus === 'Accepted'
          ? [...prevAcceptedLawyers, lawyerDetails.find(lawyer => lawyer.id === id)]
          : prevAcceptedLawyers.filter(lawyer => lawyer.id !== id)
      );
    } catch (error) {
      setError('Unexpected error updating status: ' + error.message);
    }
  };

  const handleDeleteLawyer = async (id) => {
    try {
      const { error } = await supabase
        .from('lawyers_form')
        .delete()
        .eq('id', id);

      if (error) {
        setError('Error deleting lawyer: ' + error.message);
        return;
      }

      await supabase
        .from('lawyers')
        .delete()
        .eq('id', id);

      setLawyerDetails((prevLawyerDetails) =>
        prevLawyerDetails.filter((lawyer) => lawyer.id !== id)
      );

      setAcceptedLawyers((prevAcceptedLawyers) =>
        prevAcceptedLawyers.filter((lawyer) => lawyer.id !== id)
      );
    } catch (error) {
      setError('Unexpected error deleting lawyer: ' + error.message);
    }
  };

  useEffect(() => {
    if (!userId) {
      setError("Please log in to view your cases.");
      setLoading(false);
      return;
    }
    fetchCases();
  }, [userId]);

  return (
    <>
      <section className='min-h-screen bg-bg1 w-full flex flex-col items-center bg-cover bg-center'>
        <div className=' w-full shadow-sm shadow-black/30'>
          <Header />
        </div>
        <div className="flex-1 my-5 p-6 w-full">
          <div className="bg-white/30 backdrop-blur-md rounded-lg p-4 shadow-lg glass-effect">
            <h3 className="text-2xl font-semibold mb-4 text-black text-center md:text-left">
              Lawyer Details
            </h3>

            {loading ? (
              <p className="text-center">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <table className="w-full text-left text-black my-4 border">
                <thead>
                  <tr className="border-b  text-lg bg-gray-200">
                    <th className="py-2 px-3">Lawyer Name</th>
                    <th className="py-2 px-3">Enrollment ID</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Location</th>
                    <th className="py-2 px-3">Experience</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lawyerDetails.length > 0 ? (
                    lawyerDetails.map((lawyer) => (
                      <tr key={lawyer.id} className="border-b text-sm">
                        <td className="py-2 px-3">{lawyer.first_name || 'No data'}</td>
                        <td className="py-2 px-3">{lawyer.enrollment_number || 'No data'}</td>
                        <td className="py-2 px-3">{lawyer.category || 'No data'}</td>
                        <td className="py-2 px-3">{lawyer.location || 'No data'}</td>
                        <td className="py-2 px-3">{lawyer.experience || 'No data'}</td>
                        <td className="py-2 px-3 flex space-x-2">
                          <span className="mr-2">{lawyer.status || 'Pending'}</span>
                          {lawyer.status !== 'Accepted' && lawyer.status !== 'Declined' && (
                            <>
                              <button
                                className="bg-green-500 text-white px-3 py-1 rounded"
                                onClick={() => handleStatusUpdate(lawyer.id, 'Accepted')}
                              >
                                Accept
                              </button>
                              <button
                                className="bg-red-500 text-white px-3 py-1 rounded"
                                onClick={() => handleStatusUpdate(lawyer.id, 'Declined')}
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No lawyer details found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      <section className='min-h-screen bg-bg1 w-full flex flex-col items-center bg-cover bg-center'>
        <div className="flex-1 my-5 p-6 w-full">
          <div className="bg-white/30 backdrop-blur-md rounded-lg p-4 shadow-lg glass-effect">
            <h3 className="text-2xl font-semibold mb-4 text-black text-center md:text-left">
              Accepted Lawyers
            </h3>

            {acceptedLawyers.length > 0 ? (
              <table className="w-full text-left text-black my-4 border">
                <thead>
                  <tr className="border-b  text-lg bg-gray-200">
                    <th className="py-2 px-3">Lawyer Name</th>
                    <th className="py-2 px-3">Enrollment ID</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Location</th>
                    <th className="py-2 px-3">Experience</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptedLawyers.map((lawyer) => (
                    <tr key={lawyer.id} className="border-b text-sm">
                      <td className="py-2 px-3">{lawyer.first_name || 'No data'}</td>
                      <td className="py-2 px-3">{lawyer.enrollment_number || 'No data'}</td>
                      <td className="py-2 px-3">{lawyer.category || 'No data'}</td>
                      <td className="py-2 px-3">{lawyer.location || 'No data'}</td>
                      <td className="py-2 px-3">{lawyer.experience || 'No data'}</td>
                      <td className="py-2 px-3">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => handleDeleteLawyer(lawyer.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">No accepted lawyers found</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Admin;