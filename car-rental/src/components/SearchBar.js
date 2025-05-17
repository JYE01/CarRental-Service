import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCars } from '../FirebaseApi';
import './SearchBar.css';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCars().then(setAllCars);
  }, []);

  useEffect(() => {
    if (search.length >= 1) {
      const filtered = allCars.filter(car =>
        `${car.brand} ${car.carModel}`.toLowerCase().includes(search.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [search, allCars]);

  const handleSearch = () => {
    const match = allCars.find(car =>
      `${car.brand} ${car.carModel}`.toLowerCase() === search.toLowerCase()
    );
    if (match) {
      navigate(`/car/${match.carModel}`);
    } else {
      alert("Car not found.");
    }
  };

  const handleSelect = (car) => {
    setSearch(`${car.brand} ${car.carModel}`);
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  const handleAdvancedSearch = () => {
    navigate('/advancedSearch');
  };

  return (
    <div className="search-container">
      <div className="search-input-group">
        <button className="advanced-search-btn" onClick={handleAdvancedSearch}>
          Advanced Search
        </button>

        <input
          type="text"
          className={`search-input ${isFocused ? 'expanded' : ''}`}
          placeholder="Search car brand or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
        />
        
        <button onClick={handleSearch}>Search</button>
      </div>

      {suggestions.length > 0 && isFocused && (
        <ul className="autocomplete-list">
          {suggestions.map(car => (
            <li key={car.id} onClick={() => handleSelect(car)}>
              {car.brand} {car.carModel}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar