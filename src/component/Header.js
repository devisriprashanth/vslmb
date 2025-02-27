import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaFilter } from "react-icons/fa";
import '../index.css';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="p-4 w-full bg-transparent">
            <div className="flex flex-row items-center">
                <div className="flex flex-1 flex-col items-start mt-3 mb-3 md:mb-0">
                    <h1
                        className="text-2xl text-third cursor-pointer font-bold"
                        onClick={() => navigate('/')}
                    >
                        SLMB
                    </h1>
                    <p className="text-sm text-third font-medium mt-1">
                        Your trusted legal partner
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <FaFilter className="text-2xl text-third cursor-pointer" onClick={() => navigate('/filter')} />
                    <FaUserAlt className="text-2xl text-third cursor-pointer" onClick={() => navigate('/login')} />
                    <h1 className='text-2xl text-third'>Login</h1>
                </div>
            </div>
        </header>
    );
};

export default Header;
