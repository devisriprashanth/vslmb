// FeedCard.jsx (Provided, unchanged)
import React from 'react';
import { FaBriefcase, FaMapLocationDot, FaUserTie } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { VscGraph } from "react-icons/vsc";
import star from '../../assets/icons/star.svg';

const FeedCard = ({ name, category, rating, experience, location, fee, successRate, onClick }) => {
  return (
    <div
      className="bg-white/90 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow space-y-4"
      onClick={onClick}
    >
      {/* Header with Icon and Name */}
      <div className="flex items-center gap-4">
        <FaUserTie className="w-12 h-12" />
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-gray-600">{category}</p>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-gray-600">
        <FaMapLocationDot className="text-secondary w-5 h-5" />
        <p>{location}</p>
      </div>

      {/* Fee */}
      <div className="flex items-center gap-2">
        <GiMoneyStack className="text-secondary w-6 h-6" />
        <p>Fee: ₹{fee} / case</p>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 bg-bg1 p-2 rounded-md">
          <FaBriefcase className="text-secondary w-6 h-6" />
          <p>{experience} Years</p>
        </div>

        <div className="flex items-center gap-2 bg-bg1 p-2 rounded-md">
          <VscGraph className="text-secondary w-6 h-6" />
          <p>Success Rate: {Math.floor(successRate)}%</p>
        </div>

        <div className="flex items-center gap-2 bg-bg1 p-2 rounded-md">
          <p className="flex items-center">
            {Math.floor(rating)}
            <img src={star} alt="star" className="w-5 h-5 ml-2" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;