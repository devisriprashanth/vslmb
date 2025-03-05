import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import supabase from '../supabaseClient';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lawyerDetails, setLawyerDetails] = useState([]); // Changed from cases to lawyerDetails

  const userId = localStorage.getItem("id");

  // Fetch lawyers' data from the lawyers_form table
  const fetchCases = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lawyers_form')
        .select('id, first_name, enrollment_number, location, category, experience, status');

      if (error) {
        setError('Error fetching lawyer details: ' + error.message);
        setLawyerDetails([]); // Updated to setLawyerDetails
      } else {
        setLawyerDetails(data); // Updated to setLawyerDetails
        setError(null);
      }
    } catch (error) {
      setError('Unexpected error: ' + error.message);
      setLawyerDetails([]); // Updated to setLawyerDetails
    } finally {
      setLoading(false);
    }
  };

  // Function to update the status of a lawyer
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

      // Update the local state to reflect the change immediately
      setLawyerDetails((prevLawyerDetails) => // Updated to setLawyerDetails
        prevLawyerDetails.map((lawyer) => // Updated variable name
          lawyer.id === id ? { ...lawyer, status: newStatus } : lawyer
        )
      );
    } catch (error) {
      setError('Unexpected error updating status: ' + error.message);
    }
  };

  // Fetch data when the component mounts or userId changes
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
    <Header/>
    </div>
    <div className="flex-1 my-5 p-6 w-full">
        <div className="bg-white/30 backdrop-blur-md rounded-lg p-4 shadow-lg glass-effect">
          <h3 className="text-2xl font-semibold mb-4 text-black text-center md:text-left">
            Lawyer Details
          </h3>

          {/* Display loading state */}
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
                {lawyerDetails.length > 0 ? ( // Updated to lawyerDetails
                  lawyerDetails.map((lawyer) => ( // Updated variable name
                    <tr key={lawyer.id} className="border-b text-sm">
                      <td className="py-2 px-3">{lawyer.first_name || 'No data'}</td>
                      <td className="py-2 px-3">{lawyer.enrollment_number || 'No data'}</td>
                      <td className="py-2 px-3">{lawyer.category || 'No data'}</td>
                      <td className="py-2 px-3">{lawyer.location || 'No data'}</td>
                      <td className="py-2 px-3">{lawyer.experience || 'No data'}</td>
                      <td className="py-2 px-3 flex space-x-2">
                        {/* Display the current status */}
                        <span className="mr-2">{lawyer.status || 'Pending'}</span>
                        {/* Show buttons only if status is not yet Accepted or Declined */}
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
      
    </>
  );
};

export default Admin