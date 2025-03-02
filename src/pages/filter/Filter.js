// Filter.jsx
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
    categories: [], // This will hold both locations and lawyer categories
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch Data from Backend
  // useEffect(() => {
  //   const fetchLawyers = async () => {
  //     const { data, error } = await supabase.from("lawyers_form").select("*");

  //     if (error) {
  //       console.error("Failed to fetch lawyers data:", error);
  //     } else {
  //       setFeedData(data);
  //     }
  //   };

  //   fetchLawyers();
  // }, []);
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const { data, error } = await supabase.from("lawyers_form").select("*");
        
        if (error) throw error;
        
        setFeedData(data);
      } catch (err) {
        console.error("Failed to fetch lawyers data:", err.message);
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
    // Handle experience field which might be a string like "10 years"
    if (typeof experience === 'string') {
      return parseInt(experience.replace(/[^0-9]/g, '')) || 0;
    }
    return experience || 0;
  };

  // Filter the feedData based on the selected filters
  const filteredFeedData = feedData.filter((feed) => {
    // Rating Filter
    const ratingMatch =
      filters.rating.length === 0 ||
      filters.rating.includes(Math.floor(feed.rating).toString());

    // Success Rate Filter
    const successRateMatch =
      filters.successRate === 0 ||
      feed.success_rate <= filters.successRate;

    // Experience Filter
    const experienceMatch =
      parseExperienceYears(feed.experience) >= filters.experience;

    // Categories Filter (includes both locations and lawyer categories)
    const locationMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(feed.location);

    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(feed.category);

    // Combine location and category match (at least one should match if filters are applied)
    const combinedCategoryMatch =
      filters.categories.length === 0 || locationMatch || categoryMatch;

    return ratingMatch && successRateMatch && experienceMatch && combinedCategoryMatch;
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
    <section className="w-full min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
      <Header />

      {/* Filter Button and Section */}
      <div className="relative w-full max-w-sm mx-5 mt-5">
        <button
          className="bg-white/70 backdrop-blur-md p-4 rounded-lg shadow-lg flex items-center justify-between w-full"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span className="text-lg font-bold text-black">Filters</span>
          <span className="text-black">{isFilterOpen ? '▲' : '▼'}</span>
        </button>

        {/* Filter Section with absolute positioning */}
        {isFilterOpen && (
          <div className="absolute top-16 left-0 bg-white/70 backdrop-blur-md p-4 rounded-lg shadow-xl w-full z-10 max-h-[400px] overflow-y-auto border border-gray-200">
            <FilterSection onFilterChange={handleFilterChange} filters={filters} />
          </div>
        )}
      </div>

      {/* Cards Section */}
      <div className="w-full p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeedData.length > 0 ? (
          filteredFeedData.map((feed, index) => (
            <FeedCard
              key={index}
              name={feed.first_name}
              category={feed.category}
              location={feed.location}
              fee={feed.price}
              experience={feed.experience}
              successRate={feed.success_rate}
              rating={feed.rating}
              onClick={() => handleFeedClick(feed)}
            />
          ))
        ) : (
          <p className="text-white text-center col-span-full">No lawyers found matching the selected filters.</p>
        )}
      </div>

      {isModalOpen && <FeedModal lawyer={selectedFeed} onClose={handleCloseModal} />}
    </section>
  );
};

export default Filter;