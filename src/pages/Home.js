import React from 'react';
import Header from '../component/Header';
import { FaArrowRight } from "react-icons/fa6";
import h1 from '../assets/icons/h1.svg';
import h2 from '../assets/icons/h2.svg';
import h3 from '../assets/icons/h3.svg';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <section>
        {/* Hero Section */}
        <div className="flex flex-col h-fit bg-cover bg-center" style={{ backgroundImage: "url('/assets/Hero.jpg')" }}>
          <Header />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold my-8 md:my-20 text-white text-center">
            Welcome!
          </h1>
          <div className='w-full flex items-center justify-center'>
            <button className='text-white bg-secondary flex items-center  my-8 md:my-20 px-4 py-2 rounded-lg text-sm md:text-lg hover:bg-opacity-80 transition'>
              Get Started <FaArrowRight className='ml-2' />
            </button>
          </div>
        </div>

        {/* How It Works Section */}
        <div className='w-full flex flex-col bg-bg2 py-8 md:py-12 px-4'>
          <div className="flex w-full items-center justify-center my-5 md:my-10">
            <h1 className="text-2xl sm:text-3xl text-center font-semibold">How it works</h1>
          </div>

          {/* Cards Section */}
          <div className='flex flex-col md:flex-row gap-6 md:gap-10 w-full items-center justify-center'>
            {/* Card 1 */}
            <div className="flex flex-col bg-white w-full sm:w-4/5 md:w-1/3 h-auto items-center justify-center p-4 rounded-lg shadow-lg">
              <img src={h1} alt="Client Submission" className="w-14 md:w-20 h-14 md:h-20" />
              <h1 className="text-lg md:text-xl pt-3 md:pt-5 pb-3 md:pb-5 text-center font-semibold">Client Case Submission</h1>
              <p className="px-4 pb-3 md:pb-5 text-center text-sm">
                Clients register and provide essential case details, including type, legal issue, location, and urgency, to match with the right lawyers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col bg-white w-full sm:w-4/5 md:w-1/3 h-auto items-center justify-center p-4 rounded-lg shadow-lg">
              <img src={h2} alt="Case Matching" className="w-14 md:w-20 h-14 md:h-20" />
              <h1 className="text-lg md:text-xl pt-3 md:pt-5 pb-3 md:pb-5 text-center font-semibold">Case Matching</h1>
              <p className="px-4 pb-3 md:pb-5 text-center text-sm">
                The platform’s smart matching system recommends lawyers based on expertise, availability, and location, ensuring the best fit.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col bg-white w-full sm:w-4/5 md:w-1/3 h-auto items-center justify-center p-4 rounded-lg shadow-lg">
              <img src={h3} alt="Legal Assistance" className="w-14 md:w-20 h-14 md:h-20" />
              <h1 className="text-lg md:text-xl pt-3 md:pt-5 pb-3 md:pb-5 text-center font-semibold">Legal Assistance</h1>
              <p className="px-4 pb-3 md:pb-5 text-center text-sm">
                Clients receive real-time updates, reminders, and messaging features for seamless communication with legal professionals.
              </p>
            </div>
          </div>
        </div>

        {/* Schedule a Free Case Evaluation */}
        <div className="flex flex-col md:flex-row w-full bg-bg p-6 md:p-10 items-center justify-between text-center md:text-left">
          {/* Left Section (Heading) */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <h1 className="text-2xl sm:text-3xl font-bold underline mb-5 md:mb-0">
              Schedule a free case evaluation
            </h1>
          </div>

          {/* Right Section (Text + Button) */}
          <div className="w-full md:w-3/2 flex flex-col items-center md:items-center">
            <p className="max-w-xl text-sm sm:text-base mb-5 px-4">
              Our intelligent matching algorithm ensures clients connect with the best-suited lawyers based on expertise and availability, streamlining the legal consultation process.
            </p>
            <button 
              className="text-md bg-black justify-center text-white font-bold py-2 px-6 rounded w-auto sm:w-60 cursor-pointer hover:shadow-xl hover:bg-opacity-80 transition mb-5"
              onClick={() => navigate('/popup')}
            >
              Let's talk - Send a message
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
