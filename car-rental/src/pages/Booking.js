import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { getCars, addOrderToFirestore, updateCarBookings } from '../FirebaseApi';
import './Booking.css';

const Booking = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    license: '',
  });

  const [price, setPrice] = useState(0);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const savedForm = JSON.parse(localStorage.getItem('reservationForm'));
    if (savedForm) setForm(savedForm);

    const data = JSON.parse(localStorage.getItem('bookingDetails'));
    if (data) {
      setBookingDetails(data);
      const start = new Date(data.start);
      const end = new Date(data.end);
      const diffMinutes = Math.max((end - start) / (1000 * 60), 0);
      const perMinute = data.pricePerDay / 1440;
      setPrice(parseFloat((diffMinutes * perMinute).toFixed(2)));
    }
  }, []);

  const handleChange = (e) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);
    localStorage.setItem('reservationForm', JSON.stringify(updatedForm));
  };

  const handleCancel = () => {
    localStorage.removeItem('reservationForm');
    setForm({ name: '', phone: '', email: '', license: '' });
    navigate('/');
  };

  const safeBookingTransaction = async (order) => {
    try {
      const cars = await getCars();
      const car = cars.find(c => c.vin === order.vin);

      if (!car) throw new Error('Car not found');

      const existingBookings = car.bookings || [];

      const hasConflict = existingBookings.some(b => {
        const start1 = new Date(order.pickupDateTime);
        const end1 = new Date(order.returnDateTime);
        const start2 = new Date(b.start);
        const end2 = new Date(b.end);
        return start1 < end2 && start2 < end1;
      });

      if (hasConflict) {
        throw new Error('Booking conflict');
      }

      await addOrderToFirestore(order);

      await updateCarBookings(order.vin, {
        start: order.pickupDateTime,
        end: order.returnDateTime,
      });

      return { success: true };
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!form.name || !form.phone || !form.email || !form.license || !bookingDetails) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!phoneRegex.test(form.phone)) {
      toast.error('Phone number must be 10 digits or in numbers only.');
      return;
    }

    const order = {
      customerName: form.name,
      email: form.email,
      licenseNum: form.license,
      phoneNumber: form.phone,
      pickup: bookingDetails.pickupLocation,
      pickupCity: bookingDetails.pickupCity || 'Unknown',
      pickupDateTime: bookingDetails.start,
      returnDateTime: bookingDetails.end,
      totalPrice: price,
      vin: bookingDetails.vin || 'Unknown',
    };

    try {
      await safeBookingTransaction(order);
      toast.success('Order submitted successfully!');
      setTimeout(() => {
        navigate('/order');
      }, 1000);//time delay for show toast message
    } catch (error) {
      if (error.message === 'Booking conflict') {
        toast.error("This time slot is already booked. Please choose another time.");
      } else {
        toast.error("Failed to submit order.");
      }
    }
  };

  if (!bookingDetails) return <div>Loading booking details...</div>;

  return (
    <div className="booking-container">
      <h2>Confirm Your Booking</h2>

      <div className="booking-summary">
        <p><strong>Car:</strong> {bookingDetails.brand} ({bookingDetails.year})</p>
        <p><strong>Pickup:</strong> {bookingDetails.pickupLocation}</p>
        <p><strong>From:</strong> {new Date(bookingDetails.start).toISOString().replace('T', ' ').substring(0, 16)}</p>
        <p><strong>To:</strong> {new Date(bookingDetails.end).toISOString().replace('T', ' ').substring(0, 16)}</p>
        <p><strong>Total Price:</strong> ${price}</p>
      </div>

      <div className="booking-form">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
        <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input type="text" name="license" value={form.license} onChange={handleChange} placeholder="Driver's License" />
      </div>

      <div className="booking-actions">
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Booking;
