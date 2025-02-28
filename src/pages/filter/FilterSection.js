// FilterSection.jsx
import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import star from '../../assets/icons/star.svg';

const FilterSection = ({ onFilterChange, filters }) => {
  // State to manage which section is open
  const [openSection, setOpenSection] = useState(null);

  // Toggle the section
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-full bg-white text-black p-5 rounded-lg shadow-lg glass-effect max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaFilter className="mr-2" /> Filters
      </h2>

      {/* Locations Section */}
      <div className="mb-4">
        <button
          className="w-full text-left p-2 bg-gray-200 rounded-lg flex justify-between items-center"
          onClick={() => toggleSection('locations')}
        >
          <h3 className="font-semibold text-base">Locations</h3>
          <span>{openSection === 'locations' ? '▲' : '▼'}</span>
        </button>
        {openSection === 'locations' && (
          <div className="mt-2 space-y-2">
            {[
              'Anakapalli', 'Ananthapuramu', 'Bapatla', 'Chittoor', 'East Godavari',
              'Eluru', 'Guntur', 'Kadapa', 'Krishna', 'Kurnool', 'Nandyal', 'NTR',
              'Palnadu', 'Prakasam', 'Srikakulam', 'Tirupati', 'Visakhapatnam', 
              'Vizianagaram', 'YSR Kadapa',
            ].map((category) => (
              <label key={category} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.categories.includes(category)}
                  onChange={() => onFilterChange('categories', category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Section */}
      <div className="mb-4">
        <button
          className="w-full text-left p-2 bg-gray-200 rounded-lg flex justify-between items-center"
          onClick={() => toggleSection('rating')}
        >
          <h3 className="font-semibold text-base">Rating</h3>
          <span>{openSection === 'rating' ? '▲' : '▼'}</span>
        </button>
        {openSection === 'rating' && (
          <div className="mt-2 space-y-2">
            {[1, 2, 3, 4, 5].map((stars) => (
              <label key={stars} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.rating.includes(stars.toString())}
                  onChange={() => onFilterChange('rating', stars.toString())}
                />
                {Array.from({ length: stars }, (_, i) => (
                  <img key={i} src={star} className="w-5 h-5" alt="Star" />
                ))}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Success Rate Section */}
      <div className="mb-4">
        <button
          className="w-full text-left p-2 bg-gray-200 rounded-lg flex justify-between items-center"
          onClick={() => toggleSection('successRate')}
        >
          <h3 className="font-semibold text-base">Success Rate</h3>
          <span>{openSection === 'successRate' ? '▲' : '▼'}</span>
        </button>
        {openSection === 'successRate' && (
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.successRate || 100}
              onChange={(e) => onFilterChange('successRate', parseInt(e.target.value))}
              className="w-full accent-secondary"
            />
            <p className="text-gray-800">Selected: 0% to {filters.successRate || 100}%</p>
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="mb-4">
        <button
          className="w-full text-left p-2 bg-gray-200 rounded-lg flex justify-between items-center"
          onClick={() => toggleSection('experience')}
        >
          <h3 className="font-semibold text-base">Experience</h3>
          <span>{openSection === 'experience' ? '▲' : '▼'}</span>
        </button>
        {openSection === 'experience' && (
          <div className="mt-2">
            <input
              type="range"
              min="1"
              max="20"
              value={filters.experience || 1}
              onChange={(e) => onFilterChange('experience', parseInt(e.target.value))}
              className="w-full accent-secondary"
            />
            <p className="text-gray-800">Selected: {filters.experience || 1} years</p>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-4">
        <button
          className="w-full text-left p-2 bg-gray-200 rounded-lg flex justify-between items-center"
          onClick={() => toggleSection('categories')}
        >
          <h3 className="font-semibold text-base">Categories</h3>
          <span>{openSection === 'categories' ? '▲' : '▼'}</span>
        </button>
        {openSection === 'categories' && (
          <div className="mt-2 space-y-2">
            {[
              'Corporate Lawyer', 'Criminal Lawyer', 'Civil Litigation Lawyer',
              'Family Lawyer', 'Intellectual Property Lawyer', 'Tax Lawyer',
              'Employment Lawyer', 'Real Estate Lawyer', 'Immigration Lawyer',
              'Personal Injury Lawyer', 'Medical Malpractice Lawyer',
            ].map((category) => (
              <label key={category} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.categories.includes(category)}
                  onChange={() => onFilterChange('categories', category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;