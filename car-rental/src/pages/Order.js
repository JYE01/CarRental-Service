import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Order.css';

const Order = () => {
  const [order, setOrder] = useState(null);
  const [car, setCar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('reservationForm'));
    if (data) setOrder(data);
    const carData = JSON.parse(localStorage.getItem('bookingDetails'));
    if (carData) setCar(carData);
  }, []);

  if (!order) return <div>Loading order...</div>;

    return (
        <div className="order-container">
            <h2>Booking Confirmation</h2>
            <div className="order-details">
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Driver's License:</strong> {order.license}</p>
            <p><strong>Car:</strong> {car.brand} {car.model} ({car.year})</p>
            <p><strong>Pickup Location:</strong> {car.pickupLocation}</p>
            <p><strong>Pickup City: </strong>{car.pickupCity}</p>
            <p><strong>Pickup Date & Time:</strong> {new Date(car.start).toLocaleString()}</p>
            <p><strong>Return Date & Time:</strong> {new Date(car.end).toLocaleString()}</p>
            <p><strong>Total Price:</strong> ${car.pricePerDay}</p>
            </div>

            <button className="order-home-btn" onClick={() => navigate('/')}>
            Back to Home
            </button>
        </div>
    );
};

export default Order;
