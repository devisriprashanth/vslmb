import React from "react";
import "../index.css";
import pop1 from "../assets/img/popup.jpg";

const Popupsection = () => {
  return (
    <section
      className="flex flex-col h-screen items-center justify-center w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${pop1})` }}
    >
      <div className="popup-overlay bg-black bg-opacity-50 rounded-xl p-6 max-w-4xl w-full mx-4 md:mx-0">
        <h1 className="text-4xl md:text-5xl text-white text-center mb-6">
          Free Case Evaluation
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="flex flex-col">
            <h2 className="text-white text-lg md:text-xl mb-2">Full Name</h2>
            <input
              type="text"
              placeholder="Full Name"
              className="login-input p-3 bg-white rounded-md focus:outline-none w-full"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <h2 className="text-white text-lg md:text-xl mb-2">Phone Number</h2>
            <input
              type="tel"
              placeholder="Phone Number"
              maxLength={10}
              pattern="\d{10}"
              inputMode="numeric"
              className="login-input p-3 bg-white rounded-md focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Describe Case */}
        <div className="flex flex-col mt-6">
          <h2 className="text-white text-lg md:text-xl mb-2">
            Describe Your Case
          </h2>
          <textarea
            className="w-full h-32 bg-white rounded-md p-3 resize-none focus:outline-none"
            placeholder="Describe here..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button className="p-3 bg-black text-white text-lg md:text-xl rounded-2xl hover:shadow-lg">
            SUBMIT
          </button>
        </div>
      </div>
    </section>
  );
};

export default Popupsection;
