import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getCars } from '../FirebaseApi';
import { toast, ToastContainer } from "react-toastify";
import BookingTimeline from '../components/BookingTimeline';
import "./CarDetail.css";

const CarDetail = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [returnTime, setReturnTime] = useState('');
    const [timelineDate, setTimelineDate] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            const allCars = await getCars();
            const current = allCars.find(car => car.carModel.toLowerCase() === decodeURIComponent(name).toLowerCase());
            setCar(current);
        };
        fetchData();

        // Load booking details from localStorage if available
        const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
        if (bookingDetails) {
            const start = new Date(bookingDetails.start);
            const end = new Date(bookingDetails.end);

            setPickupDate(start.toISOString().split("T")[0]);
            setPickupTime(start.toISOString().split("T")[1].slice(0, 5)); 
            setReturnDate(end.toISOString().split("T")[0]);
            setReturnTime(end.toISOString().split("T")[1].slice(0, 5));  
        }
    }, [name]);

    const isOverlapping = (start1, end1, start2, end2) => {
        const s1 = new Date(start1);
        const e1 = new Date(end1);
        const s2 = new Date(start2);
        const e2 = new Date(end2);
        return s1 < e2 && s2 < e1;
    };

    const handleBooking = () => {
        if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
            toast.error("Please fill in all booking fields.");
            return;
        }

        const startISOString = `${pickupDate}T${pickupTime}:00.000Z`;
        const endISOString = `${returnDate}T${returnTime}:00.000Z`;

        if (endISOString <= startISOString) {
            toast.error("Return time must be after pickup time.");
            return;
        }

        const hasConflict = car.bookings?.some(booking =>
            isOverlapping(startISOString, endISOString, booking.start, booking.end)
        );

        if (hasConflict) {
            toast.error("This time slot is already booked. Please choose another time.");
            return;
        }

        const bookingData = {
            pickupLocation: car.pickup,
            start: startISOString,
            end: endISOString,
            brand: car.brand,
            type: car.carType,
            fuel: car.fuelType,
            year: car.yearOfManufacture,
            mileage: car.mileage,
            pricePerDay: car.pricePerDay,
        };

        localStorage.setItem("bookingDetails", JSON.stringify(bookingData));
        navigate("/booking");
    };

    return (
        <div className="home-container" style={{ padding: "20px" }}>
            {car ? (
                <div className="car-detail-layout">
                    <div className="car-info">
                        <img src={`/images/${car.carModel}.jpg`} alt={`${car.brand} ${car.carModel}`} className="car-detail-image"/>
                        <h1>{car.carModel}</h1>
                        <h2>
                            <strong>Availability:</strong>{" "}
                            <span style={{ color: car.available ? "green" : "red", fontWeight: "bold" }}>
                                {car.available ? "Yes" : "No"}
                            </span>
                        </h2>
                        <p><strong>Brand:</strong> {car.brand}</p>
                        <p><strong>Type:</strong> {car.carType}</p>
                        <p><strong>Fuel:</strong> {car.fuelType}</p>
                        <p><strong>Year:</strong> {car.yearOfManufacture}</p>
                        <p><strong>Mileage:</strong> {car.mileage}</p>
                        <p><strong>Price per Day:</strong> ${car.pricePerDay}</p>     
                        <p><strong>Description:</strong> {car.description}</p>
                    </div>

                    {car.available ? (
                        <div className="booking-form">
                            <h2>Book this Car</h2>
                            <p><strong>Pickup Location:</strong> {car.pickup} ({car.pickupCity})</p>
                            
                            <div style={{ marginTop: "30px" }}>
                                <h3>Booking Overview for a Day</h3>
                                <input
                                    type="date"
                                    value={timelineDate.toISOString().split("T")[0]}
                                    onChange={(e) => setTimelineDate(new Date(e.target.value))}
                                />
                                <BookingTimeline
                                    date={timelineDate}
                                    bookings={car.bookings || []}
                                />
                            </div>
                            <h3><strong>Pick up</strong></h3>
                            <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} placeholder="Pickup Date" />
                            <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} placeholder="Pickup Time" />
                            <h3><strong>Return</strong></h3>
                            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} placeholder="Return Date" />
                            <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} placeholder="Return Time" />
                            <button onClick={handleBooking}>Rent</button>
                        </div>
                        ) : (
                        <div className="booking-form">
                            <h2>This car is currently unavailable for booking.</h2>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading car details...</p>
            )}
            <ToastContainer />
        </div>
    );
}

export default CarDetail;
