import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import client from '../assets/img/client.jpg';
import lawyer from '../assets/img/lawyer.jpg';

const Login = () => {
  const [isLawyerSelected, setIsLawyerSelected] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      alert("Invalid Credentials ❌");
      console.log("Auth Error:", authError.message);
      return;
    }

    // Get the authenticated user
    const { data: { user } } = authData;

    // Determine which table to query based on isLawyerSelected
    const table = isLawyerSelected ? "lawyers" : "clients";

    // Fetch additional user data from the appropriate table
    const { data: userData, error: userError } = await supabase
      .from(table)
      .select("*")
      .eq("auth_id", user.id) // Match the auth_id with the authenticated user's ID
      .single();

    if (userError || !userData) {
      alert("User not found in database ❌");
      console.log("User Fetch Error:", userError?.message);
      await supabase.auth.signOut(); // Sign out if user not found in table
      return;
    }

    // Store user data in localStorage (optional, since Header.js already syncs with Supabase auth)
    localStorage.setItem("user", JSON.stringify({
      first_name: userData.first_name,
      isLawyerSelected,
    }));
    localStorage.setItem("id", userData.id);
    localStorage.setItem("first_name", userData.first_name);

    alert("Login Successful ✅");

    // Navigate to the appropriate dashboard
    if (isLawyerSelected) {
      navigate("/lawyer-dashboard");
    } else {
      navigate("/client-dashboard");
    }
  };

  return (
    <section
      className={`h-screen bg-cover bg-center flex flex-col md:flex-row gap-4 transition-all duration-500`}
      style={{
        backgroundImage: `url(${isLawyerSelected ? lawyer : client})`,
      }}
    >
      <div
        className={`md:flex-1 w-full p-4 my-10 md:my-0 md:p-10 text-center ${isLawyerSelected ? "md:text-right md:order-2" : "md:text-left md:order-1"}`}
      >
        <h1 className="text-white text-2xl md:text-3xl font-bold cursor-pointer" onClick={() => navigate('/')}>SLMB</h1>
        <p className="text-sm text-white font-medium mt-2">
          Your trusted legal partner
        </p>
      </div>

      <div
        className={`bg-white shadow-lg h-auto md:h-full p-6 md:p-10 w-full md:max-w-md ${isLawyerSelected
          ? "md:rounded-tr-[70px] md:rounded-br-[70px] md:order-1"
          : "md:rounded-tl-[70px] md:rounded-bl-[70px] md:order-2"}`}
      >
        <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
        <p className="text-center text-gray-600 mb-4">
          Want to join us?{" "}
          <span
            className="text-secondary underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Create Account
          </span>
        </p>

        {/* User Type Selection */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md border ${!isLawyerSelected ? "bg-secondary text-white" : "bg-white text-secondary"}`}
            onClick={() => setIsLawyerSelected(false)}
          >
            Client
          </button>
          <button
            className={`px-4 py-2 rounded-md border ${isLawyerSelected ? "bg-secondary text-white" : "bg-white text-secondary"}`}
            onClick={() => setIsLawyerSelected(true)}
          >
            Lawyer
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col">
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              className="w-full p-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your Password"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-bg1 text-black hover:text-white p-2 rounded-md hover:bg-secondary"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;