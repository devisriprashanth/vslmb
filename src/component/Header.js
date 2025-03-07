import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaFilter } from "react-icons/fa";
import '../index.css';

const Header = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLawyer, setIsLawyer] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserName(storedUser.first_name);
      setIsLawyer(storedUser.isLawyerSelected); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDashboard = () => {
    navigate("/client-dashboard");
  };

  return (
    <header className="py-1 px-4 w-full bg-transparent">
      <div className="flex flex-row items-center">
        <div className="flex flex-1 flex-col items-start mt-3 mb-3 md:mb-0">
          <h1 className="text-2xl text-third cursor-pointer font-bold" onClick={() => navigate('/')}>SLMB</h1>
          <p className="text-sm text-third font-medium mt-1">Your trusted legal</p>
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Hide Filter for Lawyer */}
          {!isLawyer && userName !== 'Admin' && (
            <div onClick={() => navigate('/filter')} className="cursor-pointer">
              <FaFilter className="text-2xl text-third"/>
            </div>
          )}

          <div className="flex items-center gap-2 cursor-pointer relative">
            <FaUserAlt className="text-2xl text-third" />
            {userName ? (
              <>
                <h1 className='text-2xl text-third' onClick={() => setToggle(!toggle)}>
                  {userName}
                </h1>
                {toggle && (
                  <div className="absolute right-0 top-7 bg-white border shadow-lg rounded-lg w-32">
                    {!isLawyer && (
                      <button
                        onClick={handleDashboard}
                        className="text-gray-700 w-full text-left hover:bg-gray-200 px-2 py-1 rounded-md"
                      >
                        Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-red-500 w-full text-left hover:bg-gray-200 px-2 py-1 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <h1 className='text-2xl text-third cursor-pointer' onClick={() => navigate('/login')}>
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
