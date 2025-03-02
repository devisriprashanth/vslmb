import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const ClientDash = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchCases();

    // Real-time subscription for case updates
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const clientId = storedUser?.id; // Assuming the user object contains the client ID

    if (!clientId) {
      setError('Please log in as a client to view your cases.');
      navigate('/login');
      return;
    }

    const channel = supabase.channel('client-cases')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'caseform', filter: `client_id=eq.${clientId}` },
        (payload) => {
          fetchCases(clientId); // Refresh cases on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // Clean up subscription on unmount
    };
  }, [navigate]);

  async function checkAuthAndFetchCases() {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      setError('Please log in as a client to view your cases.');
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const clientId = storedUser?.id; // Assuming the user object contains the client ID
    fetchCases(clientId);
  }

  async function fetchCases(clientId) {
    try {
      setLoading(true);
      // Fetch cases for this client from caseform
      const { data: caseData, error: caseError } = await supabase
        .from('caseform')
        .select(`
          id,
          case_name,
          category,
          phone_number,
          location,
          description,
          client_pdf,
          lawyer_pdf,
          created_at,
          status,
          lawyer_id
        `)
        .eq('client_id', clientId) // Filter by client_id
        .order('created_at', { ascending: true }); // Order by creation time

      if (caseError) throw caseError;

      // Fetch lawyer details for each case (if lawyer_id exists)
      const casesWithLawyers = await Promise.all(
        caseData.map(async (caseItem) => {
          if (caseItem.lawyer_id) {
            const { data: lawyerData, error: lawyerError } = await supabase
              .from('lawyers')
              .select('first_name, last_name')
              .eq('id', caseItem.lawyer_id)
              .single();

            if (lawyerError) throw lawyerError;

            return {
              ...caseItem,
              lawyerName: lawyerData ? `${lawyerData.first_name} ${lawyerData.last_name}` : 'Not assigned',
            };
          }
          return { ...caseItem, lawyerName: 'Not assigned' };
        })
      );

      setCases(casesWithLawyers || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center bg-cover bg-center" style={{ background: '#f' }}>
        <div className='bg-bg1 w-full'>
          <Header />
        </div>
        <div className="text-center text-3xl md:text-4xl font-bold text-black mt-5">Loading cases...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center bg-cover bg-center" style={{ background: '#f' }}>
        <div className='bg-bg1 w-full'>
          <Header />
        </div>
        <div className="text-center text-3xl md:text-4xl font-bold text-red-500 mt-5">{error}</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center bg-cover bg-center"
      style={{ background: '#f' }} 
    >
      {/* Header */}
      <div className='bg-bg1 w-full'>
        <Header />
      </div>
      

      {/* Title */}
      <div className="text-center text-3xl md:text-4xl font-bold text-black mt-5">
        Your Cases
      </div>

      {/* Cases Table with Glass Effect */}
      <div
        className="w-full max-w-6xl bg-white/30 rounded-lg p-6 my-10 mx-1 shadow-glassmorphism backdrop-blur-[8.5px]"
        style={{
          background: 'rgba(255, 250, 250, 0.25)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(8.5px)',
          WebkitBackdropFilter: 'blur(8.5px)', 
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-black border-collapse">
            <thead>
              <tr className="border-b text-lg md:text-xl font-semibold">
                <th className="py-2 px-4">Case Name</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Lawyer</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Client PDF</th>
                <th className="py-2 px-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {cases.length > 0 ? (
                cases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b">
                    <td className="py-2 px-4">{caseItem.case_name || 'No data'}</td>
                    <td className="py-2 px-4">{caseItem.category || 'No data'}</td>
                    <td className="py-2 px-4">{caseItem.lawyerName || 'Not assigned'}</td>
                    <td className="py-2 px-4">{caseItem.status || 'Pending'}</td>
                    <td className="py-2 px-4">
                      {caseItem.client_pdf ? (
                        <a href={caseItem.client_pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          View PDF
                        </a>
                      ) : 'No PDF'}
                    </td>
                    <td className="py-2 px-4">{caseItem.description || 'No data'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-2 px-4 text-center">No cases available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientDash;