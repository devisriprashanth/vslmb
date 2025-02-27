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
    <section className="bg-bg1 min-h-screen">
      <Header />
      <div className="flex justify-between items-center px-3 md:px-5 mb-6 w-auto">
          <h1 className="text-2xl font-bold">Lawyer settings</h1>

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
        <div className="bg-yellow-200 text-yellow-900 p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <p className="font-semibold">Please fill out the required form to complete your profile.</p>
        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded"
          onClick={() => navigate('/lawyer-form')}
        >
          Fill Form
        </button>
      </div>

      <div className="flex flex-col items-center p-4">
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-xl glass-effect">
          <h2 className="text-2xl text-black mb-4">Welcome!</h2>
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
