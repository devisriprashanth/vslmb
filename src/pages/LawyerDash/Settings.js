import React, { useState } from 'react';
import Header from '../../component/Header';
import { useNavigate } from 'react-router-dom';
import { RiMenu3Fill , RiMenu2Line } from "react-icons/ri";

const Settings = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({ currentEmail: 'ram@gmail.com', newEmail: '', confirmEmail: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (emailForm.newEmail === emailForm.confirmEmail) {
      console.log('Email updated:', emailForm);
      setIsEmailPopupOpen(false);
    } else {
      alert('New email and confirm email must match!');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword === passwordForm.confirmPassword) {
      console.log('Password updated:', passwordForm);
      setIsPasswordPopupOpen(false);
    } else {
      alert('New password and confirm password must match!');
    }
  };

  const EmailPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md glass-effect">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-black">Change Email</h3>
          <button className="text-2xl cursor-pointer" onClick={() => setIsEmailPopupOpen(false)}>✕</button>
        </div>
        <form onSubmit={handleEmailSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-black mb-1">Current Email</label>
            <input type="email" value={emailForm.currentEmail} disabled className="w-full p-2 rounded bg-gray-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-black mb-1">New Email</label>
            <input type="email" className="w-full p-2 border rounded" required onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })} />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-black mb-1">Confirm Email</label>
            <input type="email" className="w-full p-2 border rounded" required onChange={(e) => setEmailForm({ ...emailForm, confirmEmail: e.target.value })} />
          </div>
          <button type="submit" className="bg-secondary text-white p-2 rounded w-full">Save</button>
        </form>
      </div>
    </div>
  );

  const PasswordPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md glass-effect">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-black">Change Password</h3>
          <button className="text-2xl cursor-pointer" onClick={() => setIsPasswordPopupOpen(false)}>✕</button>
        </div>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-black mb-1">Current Password</label>
            <input type="password" className="w-full p-2 border rounded" required onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-black mb-1">New Password</label>
            <input type="password" className="w-full p-2 border rounded" required onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-black mb-1">Confirm Password</label>
            <input type="password" className="w-full p-2 border rounded" required onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
          </div>
          <button type="submit" className="bg-secondary text-white p-2 rounded w-full">Save</button>
        </form>
      </div>
    </div>
  );

  return (
    <section className="bg-bg2 min-h-screen">
      <Header />
      <div className="flex justify-between items-center px-3 md:px-5 mb-6">
              <h1 className="text-2xl font-bold">Lawyer Dashboard</h1>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-blue-500 text-white px-4 py-2 rounded">
                {isMenuOpen ?   <RiMenu2Line /> : <RiMenu3Fill />}
              </button>
            </div>
      
            {isMenuOpen && (
              <nav className="mx-2 md:mx-10 bg-white shadow p-4 rounded">
                <button onClick={() => navigate('/lawyer-dashboard')} className="block text-secondary mb-2">
                  Dashboard
                </button>
                <button onClick={() => navigate('/clients')} className="block text-secondary">
                  Clients
                </button>
                <button onClick={() => navigate('/settings')} className="block text-secondary">
                  Settings
                </button>
              </nav>
            )}
      <div className='w-full flex justify-end p-4'>
        <button className='bg-secondary text-white px-5 py-2 rounded' onClick={() => navigate('/lawyer-form')}>
          Fill Form
        </button>
      </div>

      <div className="flex flex-col items-center p-4">
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-xl glass-effect">
          <h3 className="text-3xl font-semibold text-black mb-4">Settings</h3>
          <h2 className="text-xl text-black mb-4">Welcome!</h2>
          <h2 className="text-lg text-black mb-4">User Name</h2>

          <div>
            <h2 className="text-sm text-black mb-2">Change Email</h2>
            <div className="bg-gray-100 p-3 rounded-lg flex justify-between">
              <span>{emailForm.currentEmail}</span>
              <span className="text-red-500 cursor-pointer" onClick={() => setIsEmailPopupOpen(true)}>Change</span>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm text-black mb-2">Change Password</h2>
            <div className="bg-gray-100 p-3 rounded-lg flex justify-between">
              <span>*******</span>
              <span className="text-red-500 cursor-pointer" onClick={() => setIsPasswordPopupOpen(true)}>Change</span>
            </div>
          </div>
        </div>
      </div>

      {isEmailPopupOpen && <EmailPopup />}
      {isPasswordPopupOpen && <PasswordPopup />}
    </section>
  );
};

export default Settings
