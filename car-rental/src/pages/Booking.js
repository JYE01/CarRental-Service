import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {addOrderToFirestore, updateCarBookings} from '../FirebaseApi';

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

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email || !form.license || !bookingDetails) {
      alert('Please fill all required fields.');
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
      await addOrderToFirestore(order);

      // Update bookings array in Cars collection
      await updateCarBookings(order.vin, {
        start: bookingDetails.start,
        end: bookingDetails.end,
      });

      alert('Order submitted successfully!');
      localStorage.removeItem('reservationForm');
      localStorage.removeItem('bookingDetails');
      navigate('/');
    } catch (error) {
      console.error('Failed to submit order or update bookings:', error);
      alert('Failed to submit order.');
    }
  };

  if (!bookingDetails) return <div>Loading booking details...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Confirm Your Booking</h2>
      <p><strong>Car:</strong> {bookingDetails.brand} ({bookingDetails.year})</p>
      <p><strong>Pickup:</strong> {bookingDetails.pickupLocation}</p>
      <p><strong>From:</strong> {new Date(bookingDetails.start).toISOString().replace('T', ' ').substring(0, 16)}</p>
      <p><strong>To:</strong> {new Date(bookingDetails.end).toISOString().replace('T', ' ').substring(0, 16)}</p>
      <p><strong>Total Price:</strong> ${price}</p>

      <div style={{ marginTop: '1rem' }}>
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" /><br />
        <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" /><br />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" /><br />
        <input type="text" name="license" value={form.license} onChange={handleChange} placeholder="Driver's License" /><br />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleCancel} style={{ marginLeft: '1rem' }}>Cancel</button>
      </div>
    </div>
  );
};

export default Booking;
