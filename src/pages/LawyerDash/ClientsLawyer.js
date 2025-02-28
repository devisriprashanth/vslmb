import React, { useState } from 'react';
import Header from '../../component/Header';
import { useNavigate } from 'react-router-dom';
import { RiMenu3Fill , RiMenu2Line } from "react-icons/ri";


const ClientsLawyer = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const Menu = () => (
   <div className="flex justify-between items-center px-3 md:px-5 mb-6 w-auto">
                   <h1 className="text-2xl font-bold">Clients List</h1>
         
                   {/* Menu Button Wrapper with Relative Position */}
                   <div className="relative">
                     <button
                       onClick={() => setIsMenuOpen(!isMenuOpen)}
                       className="bg-secondary text-white px-4 py-2 rounded"
                     >
                       {isMenuOpen ? <RiMenu2Line /> : <RiMenu3Fill />}
                     </button>
         
                     {/* Dropdown Menu with Auto Width */}
                     {isMenuOpen && (
                       <div className="absolute right-0 top-12 bg-white w-auto rounded-lg shadow-lg z-40 animate-slide-down">
                         <button onClick={() => navigate('/lawyer-dashboard')} className="block w-full px-6 py-3 text-black hover:bg-gray-200">
                           Dashboard
                         </button>
                         <button onClick={() => navigate('/lawyer-dashboard/clients')} className="block w-full px-6 py-3 text-black hover:bg-gray-200">
                           Clients
                         </button>
                         <button onClick={() => navigate('/settings')} className="block w-full px-6 py-3 text-black hover:bg-gray-200">
                           Settings
                         </button>
                       </div>
                     )}
                   </div>
                 </div>
  );

  const AppointmentTable = () => (
    <table className="w-full text-left text-black my-4">
      <thead>
        <tr className="border-b text-lg">
          <th className="py-2">Client Name</th>
          <th className="py-2">Case Type</th>
          <th className="py-2">Hearing</th>
          <th className="py-2">Status</th>
          <th className="py-2">Outcome</th>
        </tr>
      </thead>
      <tbody>
        {[
        ].map((appointment, index) => (
          <tr key={index} className="border-b text-sm">
            <td className="py-2">{appointment.name}</td>
            <td className="py-2">{appointment.type}</td>
            <td className="py-2">{appointment.hearing}</td>
            <td className="py-2">{appointment.status}</td>
            <td className="py-2">{appointment.outcome}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <section className='bg-bg1 min-h-screen'>
      <Header />
      
      <div className="flex flex-col">
        {/* Sidebar */}
          <Menu />
        

        {/* Main Content */}
        <div className="flex-1 p-6 w-full">
          <div className="bg-white/30 backdrop-blur-md rounded-lg p-4 shadow-lg glass-effect">
            <h3 className="text-2xl font-semibold mb-4 text-black text-center md:text-left">Appointments</h3>
            <AppointmentTable />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button
          className="bg-white/70 backdrop-blur-md p-4 rounded-lg mt-10 shadow-lg glass-effect w-full text-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? 'Close Menu' : 'Open Menu'}
        </button>

        {isMenuOpen && (
          <div className="bg-white/70 backdrop-blur-md p-4 mt-2 rounded-lg shadow-lg glass-effect">
            <Menu />
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientsLawyer;
