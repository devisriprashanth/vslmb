import React from 'react';
import { FaFilter } from 'react-icons/fa';
import star from '../../assets/icons/star.svg';

const FilterSection = ({ onFilterChange, filters }) => {
  return (
    <div className="w-full bg-white text-black p-5 rounded-lg shadow-lg glass-effect max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center">
       <FaFilter/>Filters
      </h2>
      <div className="space-y-6">
        {/* Rating Filter */}
        <div>
          <h3 className="font-semibold mb-2 text-base">Rating</h3>
          <div className="space-y-2">
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
        </div>

        {/* Success Rate Filter */}
        <div>
          <h3 className="font-semibold mb-2 text-base">Success Rate</h3>
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

        {/* Experience Filter */}
        <div>
          <h3 className="font-semibold mb-2 text-base">Experience</h3>
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

        {/* Categories Filter */}
        <div>
          <h3 className="font-semibold mb-2 text-base">Categories</h3>
          {['Criminal', 'Civil', 'Intellectual Property', 'Immigration'].map((category) => (
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
      </div>
    </div>
  );
};

export default FilterSection