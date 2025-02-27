import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from '../assets/img/client.jpg';// Import Client BG
import lawyer from '../assets/img/lawyer.jpg'// Import Lawyer BG

const Register = () => {
  const [isLawyerSelected, setIsLawyerSelected] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  return (
    <section
      className="h-screen bg-cover bg-center flex flex-col md:flex-row gap-4 transition-all duration-500"
      style={{
        backgroundImage: `url(${isLawyerSelected ? lawyer : client})`,
      }}
    >
      {/* Left Section - Logo */}
      <div
        className={`md:flex-1 w-full p-4 my-10 md:my-0 md:p-10 transition-all duration-500 text-center ${
          isLawyerSelected ? "md:text-right md:order-2" : "md:text-left md:order-1"
        }`}
      >
        <h1 className="text-white text-2xl md:text-3xl font-bold">SLMB</h1>
        <p className="text-sm text-white font-medium mt-2">Your trusted legal partner</p>
      </div>

      {/* Right Section - Register Form */}
      <div
        className={`bg-white shadow-lg h-auto md:h-full p-6 md:p-10 w-full md:max-w-md transition-all duration-500 ${
          isLawyerSelected
            ? "md:rounded-tr-[70px] md:rounded-br-[70px] md:order-1"
            : "md:rounded-tl-[70px] md:rounded-bl-[70px] md:order-2"
        }`}
      >
        <h1 className="text-3xl font-bold text-center mb-4 mt-0">Create a Account</h1>
        <p className="text-center text-gray-600 mb-4">
          Already have an account?{" "}
          <span
            className="text-secondary underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        {/* User Type Selection */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md border ${
              !isLawyerSelected ? "bg-secondary text-white" : "bg-white text-secondary"
            }`}
            onClick={() => setIsLawyerSelected(false)}
          >
            Client
          </button>

          <button
            className={`px-4 py-2 rounded-md border ${
              isLawyerSelected ? "bg-secondary text-white" : "bg-white text-secondary"
            }`}
            onClick={() => setIsLawyerSelected(true)}
          >
            Lawyer
          </button>
        </div>

        {/* Register Form */}
        <form className="flex flex-col">
          {/* Name Fields in Row */}
          <div className="flex flex-col md:flex-row gap-4 mt-2 md:mt-5 md:mb-5 mb-2">
            <div className="w-full">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                placeholder="Enter your First Name"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                placeholder="Enter your Last Name"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email & Password Fields in Row */}
          <div className="flex flex-col md:flex-row gap-4 mt-2 md:mb-10 mb-4">
            <div className="w-full">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your Password"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="w-full bg-bg1 text-black hover:text-white p-2 rounded-md hover:bg-secondary">
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
