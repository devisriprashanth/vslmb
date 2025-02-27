import React, { useState } from 'react';
import Header from '../../component/Header';
import FilterSection from './FilterSection';
import FeedCard from './FeedCard';
import { useNavigate } from 'react-router-dom';
import FeedModal from './FeedModal';
import bg from '../../assets/img/filter.jpg'

const Filter = () => {
  const navigate = useNavigate();

  const initialFeedData = [
    { name: "Advocate Name", category: 'Criminal', rating: '2', experience: '5 years', location: "Location", fee: 10000, successRate: 95 },
    { name: "Advocate Name", category: 'Civil', rating: '4', experience: '6 years', location: "Location", fee: 15000, successRate: 90 },
    { name: "Advocate Name", category: 'Intellectual Property', rating: '3', experience: '7 years', location: "Location", fee: 12000, successRate: 85 },
    { name: "Advocate Name", category: 'Immigration', rating: '4', experience: '3 years', location: "Location", fee: 8000, successRate: 88 },
    { name: "Advocate Name", category: 'Civil', rating: '5', experience: '12 years', location: "Location", fee: 20000, successRate: 92 },
  ];

  const [filters, setFilters] = useState({
    rating: [],
    successRate: 0,
    experience: 1,
    categories: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      if (filterType === 'rating' || filterType === 'categories') {
        const updatedValues = prevFilters[filterType].includes(value)
          ? prevFilters[filterType].filter((item) => item !== value)
          : [...prevFilters[filterType], value];
        return { ...prevFilters, [filterType]: updatedValues };
      } else {
        return { ...prevFilters, [filterType]: value };
      }
    });
  };

  const parseExperienceYears = (experience) => {
    const years = parseInt(experience.split(' ')[0], 10);
    return isNaN(years) ? 0 : years;
  };

  const filteredFeedData = initialFeedData.filter((feed) => {
    const ratingMatch = filters.rating.length === 0 || filters.rating.includes(feed.rating);
    const successRateMatch = filters.successRate === 0 || feed.successRate <= filters.successRate;
    const experienceMatch = parseExperienceYears(feed.experience) >= filters.experience;
    const categoryMatch = filters.categories.length === 0 || filters.categories.includes(feed.category);
    return ratingMatch && successRateMatch && experienceMatch && categoryMatch;
  });

  const handleFeedClick = (feed) => {
    setSelectedFeed(feed);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeed(null);
  };

  return (
    <section className='w-full min-h-screen bg-cover bg-center' style={{ backgroundImage: `url(${bg})` }}>
      <Header />

      <button 
        className="bg-white/70 backdrop-blur-md p-4 rounded-lg m-5 shadow-lg flex items-center justify-between w-full max-w-sm"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <span className="text-lg font-bold text-black">Filters</span>
        <span className="text-black">▼</span>
      </button>

      {isFilterOpen && (
        <div className="bg-white/70 backdrop-blur-md p-4 rounded-lg shadow-lg w-full max-w-sm mx-5">
          <FilterSection onFilterChange={handleFilterChange} filters={filters} />
        </div>
      )}

      <div className="w-full p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeedData.map((feed, index) => (
          <FeedCard 
            key={index}
            name={feed.name}
            category={feed.category}
            location={feed.location}
            fee={feed.fee}
            experience={feed.experience}
            successRate={feed.successRate}
            rating={feed.rating}
            onClick={() => handleFeedClick(feed)}
          />
        ))}
      </div>

      {isModalOpen && <FeedModal feed={selectedFeed} onClose={handleCloseModal} />}
    </section>
  );
};

export default Filter