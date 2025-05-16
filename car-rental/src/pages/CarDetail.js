import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getCars } from '../FirebaseApi';
import SearchBar from "../components/SearchBar";
import { toast, ToastContainer } from "react-toastify";
import "./CarDetail.css";

const CarDetail = () => {
    const { name } = useParams();
    const [car, setCar] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const allCars = await getCars();
            const current = allCars.find(car => car.carModel.toLowerCase() === decodeURIComponent(name).toLowerCase());
            setCar(current);
        };
        fetchData();
    }, [name]);

    return (
        <div className="home-container" style={{ padding: "20px" }}>
            <div className="title-search-container">
                <SearchBar />
            </div>

            {car ? (
                <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
                    <img src={`/images/${car.carModel}.jpg`} alt={`${car.brand} ${car.carModel}`} className="car-detail-image"/>
                    <h2 style={{ textAlign: 'left' }}>{car.carModel}</h2>
                    <p><strong>Brand:</strong> {car.brand}</p>
                    <p><strong>Type:</strong> {car.carType}</p>
                    <p><strong>Fuel:</strong> {car.fuelType}</p>
                    <p><strong>Year:</strong> {car.yearOfManufacture}</p>
                    <p><strong>Mileage:</strong> {car.mileage}</p>
                    <p><strong>VIN:</strong> {car.vin}</p>
                    <p><strong>Description:</strong> {car.description}</p>
                    <p><strong>Price per Day:</strong> ${car.pricePerDay}</p>     
                </div>
            ) : (
                <p>Loading car details...</p>
            )}
            <ToastContainer />
        </div>
    )
}

export default CarDetail