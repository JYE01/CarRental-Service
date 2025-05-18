import React, { useEffect, useState } from 'react';
import { getCars } from '../FirebaseApi';
import { useNavigate } from 'react-router-dom';
import './AdvancedSearch.css';

const AdvancedSearch = () => {
  const [allCars, setAllCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [filters, setFilters] = useState({
    brand: '',
    carModel: '',
    carType: '',
    fuelType: '',
    pickup: '',
    pickupCity: '',
    transmission: '',
    pricePerDayMax: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    getCars().then(setAllCars);
  }, []);

  useEffect(() => {
    let filtered = [...allCars];

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '') {
        if (key === 'pricePerDayMax') {
          filtered = filtered.filter(car => car.pricePerDay <= parseFloat(value));
        } else {
          filtered = filtered.filter(car =>
            String(car[key]).toLowerCase() === value.toLowerCase()
          );
        }
      }
    });

    setFilteredCars(filtered);
  }, [filters, allCars]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters(prev => {
      const updated = { ...prev, [name]: value };

      Object.keys(updated).forEach(key => {
        if (key !== name && key !== 'pricePerDayMax') {
          const dependentFiltered = getFilteredCarsExcluding(key, updated);
          const validValues = getUniqueValues(key, dependentFiltered);
          if (!validValues.includes(updated[key])) {
            updated[key] = '';
          }
        }
      });

      return updated;
    });
  };

  const getFilteredCarsExcluding = (excludeKey, currentFilters) => {
    let filtered = [...allCars];
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== '' && key !== excludeKey) {
        if (key === 'pricePerDayMax') {
          filtered = filtered.filter(car => car.pricePerDay <= parseFloat(value));
        } else {
          filtered = filtered.filter(car =>
            String(car[key]).toLowerCase() === value.toLowerCase()
          );
        }
      }
    });
    return filtered;
  };

  const getUniqueValues = (key, carsSubset = filteredCars) => {
    const values = carsSubset
      .map(car => car[key])
      .filter(value => value !== undefined && value !== null && value !== '');
    return [...new Set(values.map(v => String(v)))];
  };

  const fields = [
    { label: 'Brand', name: 'brand' },
    { label: 'Type', name: 'carType' },
    { label: 'Model', name: 'carModel' },
    { label: 'Fuel Type', name: 'fuelType' },
    { label: 'Pickup Location', name: 'pickup' },
    { label: 'Pickup City', name: 'pickupCity' },
    { label: 'Transmission', name: 'transmission' },
  ];

  const priceSubset = getFilteredCarsExcluding('pricePerDayMax', filters);
  const maxPrice = priceSubset.length > 0 ? Math.max(...priceSubset.map(car => car.pricePerDay)) : 0;

  return (
    <div className="advanced-search-container">
      <h2>Advanced Search</h2>
      <div className="filters-grid">
        {fields.map(field => {
          const carsSubset = getFilteredCarsExcluding(field.name, filters);

          let options;
          if (field.options) {
            options = field.options;
          } else {
            options = getUniqueValues(field.name, carsSubset).map(value => ({
              label: value,
              value
            }));
          }

          return (
            <div key={field.name} className="filter-item">
              <label>{field.label}</label>
              <select
                name={field.name}
                value={filters[field.name]}
                onChange={handleChange}
              >
                <option value="">All</option>
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
        <div className="filter-item">
          <label>
            Price Per Day (Max: ${maxPrice})
          </label>
          <input
            type="number"
            name="pricePerDayMax"
            value={filters.pricePerDayMax}
            onChange={handleChange}
            placeholder={`Up to $${maxPrice}`}
            min="0"
            max={maxPrice}
          />
        </div>
      </div>

      <div className="results">
        <h3>Matching Cars ({filteredCars.length})</h3>
        {filteredCars.length > 0 ? (
            <ul className="car-list">
                {filteredCars.map(car => (
                    <li
                    key={car.id}
                    className="car-item"
                    onClick={() => navigate(`/car/${encodeURIComponent(car.carModel)}`)}
                    style={{ cursor: 'pointer' }}
                    >
                    <img
                        src={`/images/${car.carModel}.jpg`}
                        alt={`${car.brand} ${car.carModel}`}
                        className="car-image"
                    />
                    <div className="car-details">
                        <strong>{car.brand} {car.carModel}</strong> - ${car.pricePerDay}/day - {car.fuelType} - {car.pickup} - {car.pickupCity} - {car.transmission}
                    </div>
                    </li>
                ))}
            </ul>
        ) : (
          <p>There are no matching cars.</p>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
