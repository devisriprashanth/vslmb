import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient"; // Import Supabase
import client from "../assets/img/client.jpg";
import lawyer from "../assets/img/lawyer.jpg";

const Register = () => {
  const [isLawyerSelected, setIsLawyerSelected] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    navigate('/login');

    const table = isLawyerSelected ? "lawyers" : "clients";

    const { data, error } = await supabase
      .from(table)
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        },
      ]);

    if (error) {
      console.error("Error:", error.message);
      alert("Registration failed! Please try again.");
    } else {
      console.log("User Registered:", data);
      alert("Registered Successfully!");

      // Navigate to login page
      navigate("/login");
    }
  };

  return (
    <section
      className="h-screen bg-cover bg-center flex flex-col md:flex-row gap-4 transition-all duration-500"
      style={{ backgroundImage: `url(${isLawyerSelected ? lawyer : client})` }}
    >
      <div
        className={`md:flex-1 w-full p-4 my-10 md:my-0 md:p-10 transition-all duration-500 text-center ${
          isLawyerSelected ? "md:text-right md:order-2" : "md:text-left md:order-1"
        }`}
      >
        <h1 className="text-white text-2xl md:text-3xl font-bold cursor-pointer" onClick={() => navigate('/')}>SLMB</h1>
        <p className="text-sm text-white font-medium mt-2">Your trusted legal partner</p>
      </div>

      <div
        className={`bg-white shadow-lg h-auto md:h-full p-6 md:p-10 w-full md:max-w-md transition-all duration-500 ${
          isLawyerSelected
            ? "md:rounded-tr-[70px] md:rounded-br-[70px] md:order-1"
            : "md:rounded-tl-[70px] md:rounded-bl-[70px] md:order-2"
        }`}
      >
        <h1 className="text-3xl font-bold text-center mb-4">Create an Account</h1>
        <p className="text-center text-gray-600 mb-4">
          Already Register?{" "}
          <span
            className="text-secondary underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

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

        <form onSubmit={handleRegister} className="flex flex-col">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-2 border rounded-md"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-2 border rounded-md"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <label className="block text-gray-700 mt-4">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block text-gray-700 mt-4">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-bg1 text-black p-2 mt-4 rounded-md hover:bg-secondary"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
