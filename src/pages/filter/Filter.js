import React, { useState, useEffect } from 'react';
import Header from '../../component/Header';
import FilterSection from './FilterSection';
import FeedCard from './FeedCard';
import { useNavigate } from 'react-router-dom';
import FeedModal from './FeedModal';
import bg from '../../assets/img/filter.jpg';
import supabase from '../../supabaseClient';

const Filter = () => {
  const navigate = useNavigate();

  const [feedData, setFeedData] = useState([]);
  const [filters, setFilters] = useState({
    rating: [],
    successRate: 0,
    experience: 1,
    categories: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch Data from Backend
  useEffect(() => {
    const fetchLawyers = async () => {
      const { data, error } = await supabase.from("lawyers_form").select("*");

      if (error) {
        console.error("Failed to fetch lawyers data:", error);
      } else {
        setFeedData(data);
      }
    };

    fetchLawyers();
  }, []);

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
    return experience || 0;
  };

  const filteredFeedData = feedData.filter((feed) => {
    const ratingMatch = filters.rating.length === 0 || filters.rating.includes(feed.rating.toString());
    const successRateMatch = filters.successRate === 0 || feed.success_rate <= filters.successRate;
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
            name={feed.first_name}
            category={feed.category}
            location={feed.location}
            fee={feed.price}
            experience={`${feed.experience} years`}
            successRate={feed.success_rate}
            rating={feed.rating.toFixed(1)}
            onClick={() => handleFeedClick(feed)}
          />
        ))}
      </div>

      {isModalOpen && <FeedModal lawyer={selectedFeed} onClose={handleCloseModal} />}
    </section>
  );
};

export default Filter;
