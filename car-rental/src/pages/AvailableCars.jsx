import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCars } from '../FirebaseApi';

const AvailableCars = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        getCars().then((data) => {
            setCars(data);
        });
    }, []);

    useEffect(() => {
        const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails") || "{}");
        const { pickupLocation, start, end } = bookingDetails;

        if (!start || !end) return;

        const requestedStart = start;
        const requestedEnd = end;

        const isOverlapping = (start1, end1, start2, end2) => {
            const s1 = new Date(start1);
            const e1 = new Date(end1);
            const s2 = new Date(start2);
            const e2 = new Date(end2);
            return s1 < e2 && s2 < e1;
        };

        const filtered = cars.filter(car => {
            if (car.pickup !== pickupLocation || !car.available) return false;

            if (!car.bookings || car.bookings.length === 0) return true;

            const hasConflict = car.bookings.some(booking =>
                isOverlapping(
                    requestedStart,
                    requestedEnd,
                    booking.start,
                    booking.end
                )
            );

            return !hasConflict;
        });

        setFilteredCars(filtered);
    }, [cars, searchParams]);


    return (
        <div className="available-cars-container">
            <h2>Available Cars</h2>
            {filteredCars.length === 0 ? (
                <p>No cars available at the selected location.</p>
            ) : (
                <div className="car-cards">
                    {filteredCars.map(car => (
                        <div
                            className="car-card"
                            key={car.id}
                            onClick={() => navigate(`/car/${encodeURIComponent(car.carModel)}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={`/images/${car.carModel}.jpg`} alt={`${car.brand} ${car.carModel}`} className="car-image"/>
                            <h4>{car.brand} {car.carModel}</h4>
                            <p>Type: {car.carType}</p>
                            <p>Year: {car.yearOfManufacture}</p>
                            <p>Mileage: {car.mileage}</p>
                            <p>Fuel: {car.fuelType}</p>
                            <p className="price">${car.pricePerDay}/day</p>
                            <button onClick={() => navigate(`/car/${encodeURIComponent(car.carModel)}`)}>View Details</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AvailableCars;
