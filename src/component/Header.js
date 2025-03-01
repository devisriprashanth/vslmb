import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaFilter } from "react-icons/fa";
import '../index.css';
import supabase from '../supabaseClient'; // Import Supabase client

const Header = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLawyer, setIsLawyer] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        setUserName(user.user_metadata?.first_name || ''); // Adjust based on your user metadata
        setIsLawyer(user.user_metadata?.isLawyerSelected || false); // Adjust based on your user metadata
        // Optionally store in localStorage for persistence, but don't rely on it as the source of truth
        localStorage.setItem("user", JSON.stringify({
          first_name: user.user_metadata?.first_name,
          isLawyerSelected: user.user_metadata?.isLawyerSelected,
        }));
      } else {
        setUserName('');
        setIsLawyer(false);
        localStorage.removeItem("user");
      }
    };

    fetchUser();

    // Listen for auth state changes (e.g., sign-in, sign-out, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUserName(session.user.user_metadata?.first_name || '');
        setIsLawyer(session.user.user_metadata?.isLawyerSelected || false);
        localStorage.setItem("user", JSON.stringify({
          first_name: session.user.user_metadata?.first_name,
          isLawyerSelected: session.user.user_metadata?.isLawyerSelected,
        }));
      } else if (event === 'SIGNED_OUT') {
        setUserName('');
        setIsLawyer(false);
        localStorage.removeItem("user");
        navigate("/login");
      }
    });

    // Cleanup the listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout Error:", error);
    }
    // The onAuthStateChange listener will handle clearing the state and navigating to login
  };

  return (
    <header className="py-1 px-4 w-full bg-transparent">
      <div className="flex flex-row items-center">
        <div className="flex flex-1 flex-col items-start mt-3 mb-3 md:mb-0">
          <h1 className="text-2xl text-third cursor-pointer font-bold" onClick={() => navigate('/')}>
            SLMB
          </h1>
          <p className="text-sm text-third font-medium mt-1">
            Your trusted legal 
          </p>
        </div>

        <div className="flex items-center gap-4 relative">
          {!isLawyer && (
            <div onClick={() => navigate('/filter')} className="cursor-pointer">
              <FaFilter className="text-2xl text-third"/>
            </div>
          )}

          <div className="flex items-center gap-2 cursor-pointer">
            <FaUserAlt className="text-2xl text-third" />
            {userName ? (
              <>
                <h1 className='text-2xl text-third' onClick={() => setToggle(!toggle)}>
                  {userName}
                </h1>
                {toggle && (
                  <div className="absolute right-0 top-7 bg-white border shadow-lg rounded-lg">
                    <button
                      onClick={handleLogout}
                      className="text-red-500 w-full text-left hover:bg-gray-200 px-1 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <h1
                className='text-2xl text-third cursor-pointer'
                onClick={() => navigate('/login')}
              >
                Login
              </h1>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;