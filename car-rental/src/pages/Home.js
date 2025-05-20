import React, { useEffect, useState } from "react";
import { getCars } from "../FirebaseApi"
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./Home.css";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  const navigate = useNavigate();

  useEffect(() => { //clear local storage when homepage loaded
    localStorage.removeItem("bookingDetails");
    localStorage.removeItem("reservationForm")
  }, []);

  useEffect(() => {
    getCars().then((data) => setCars(data));
  }, []);

  useEffect(() => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(":").slice(0, 2).join(":");

    setPickupDate(dateStr);
    setPickupTime(timeStr);
  }, []);

  const handleBookingSearch = () => {
    if (!pickupLocation || !pickupDate || !pickupTime || !returnDate || !returnTime) {
      alert("Please fill in all fields.");
      return;
    }

    //use UTC
    const startISOString = `${pickupDate}T${pickupTime}:00.000Z`;
    const endISOString = `${returnDate}T${returnTime}:00.000Z`;
    console.log("Start (UTC ISO):", startISOString);

    if (endISOString <= startISOString) {
      alert("Return time must be after pickup time.");
      return;
    }

    const now = new Date().toISOString();

    if (startISOString <= now) {
      toast.error("You can only book for future events.");
      return;
    }

    localStorage.setItem("bookingDetails", JSON.stringify({
      pickupLocation,
      start: startISOString,
      end: endISOString,
    }));

    navigate("/availableCars");
  };

  const getCurrentTimeString = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const minPickupTime = pickupDate === todayStr ? getCurrentTimeString() : "00:00";
  const minReturnTime = returnDate === todayStr ? getCurrentTimeString() : "00:00";

  return (
    <div className="home-container">
      <div className="booking-section">
        <h2>Start a Booking</h2>
        <div className="booking-form">
          <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
            <option value="">Select Pickup Location</option>
            <option value="Sydney, NSW">Sydney, NSW</option>
            <option value="Melbourne, VIC">Melbourne, VIC</option>
            <option value="Brisbane, QLD">Brisbane, QLD</option>
            <option value="Adelaide, SA">Adelaide, SA</option>
            <option value="Perth, WA">Perth, WA</option>
            <option value="Hobart, TAS">Hobart, TAS</option>
          </select>
          <input type="date" value={pickupDate} min={todayStr} onChange={(e) => setPickupDate(e.target.value)} />
          <input type="time" value={pickupTime} min={minPickupTime} onChange={(e) => setPickupTime(e.target.value)} />
          <input type="date" value={returnDate} min={pickupDate || todayStr} onChange={(e) => setReturnDate(e.target.value)} />
          <input type="time" value={returnTime} min={minReturnTime} onChange={(e) => setReturnTime(e.target.value)} />
          <button onClick={handleBookingSearch}>Search</button>
        </div>
      </div>

      <div className="ads-section">
        <h3>Featured Cars</h3>
        <div className="car-cards">
          {cars.map((car) => (
            <div className="car-card"
              key={car.id}
              onClick={() => navigate(`/car/${encodeURIComponent(car.carModel)}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={`/images/${car.carModel}.jpg`} alt={`${car.brand} ${car.carModel}`} className="car-image"/>
              <h4>{car.brand} {car.carModel}</h4>
              <p>Type: {car.carType}</p>
              <p>Year: {car.yearOfManufacture}</p>
              <p>Mileage: {car.mileage}</p>
              <p>Fuel: {car.fuelType}</p>
              <p className="price">${car.pricePerDay}/day</p>
              <button
                disabled={!car.available}
                onClick={() => navigate(`/car/${encodeURIComponent(car.carModel)}`)}
                style={{
                  backgroundColor: car.available ? "#007bff" : "red",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  cursor: car.available ? "pointer" : "not-allowed",
                  opacity: car.available ? 1 : 0.7,
                }}
              >
                {car.available ? "Book Now" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Home