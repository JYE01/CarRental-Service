import React, { useEffect, useState } from "react";
import { getCars } from "../FirebaseApi"
import { useNavigate } from "react-router-dom";
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
  }, []);

  useEffect(() => {
    getCars().then((data) => setCars(data));
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

    localStorage.setItem("bookingDetails", JSON.stringify({
      pickupLocation,
      start: startISOString,
      end: endISOString,
    }));

    navigate("/availableCars");
  };

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
          <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
          <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
          <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
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
    </div>
  )
}

export default Home