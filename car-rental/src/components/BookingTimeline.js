import React from "react";
import "./BookingTimeline.css";

const BookingTimeline = ({ date, bookings }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const isBooked = (hour) => {
    const startHour = new Date(date);
    startHour.setUTCHours(hour, 0, 0, 0);
    const endHour = new Date(startHour);
    endHour.setUTCHours(hour + 1);

    return bookings.some(({ start, end }) => {
      const startTime = new Date(start);
      const endTime = new Date(end);
      return startHour < endTime && startTime < endHour;
    });
  };

  return (
    <div className="timeline-container">
      <h4>{date.toDateString()}</h4>
      <div className="timeline">
        {hours.map((hour) => (
          <div
            key={hour}
            className={`hour-block ${isBooked(hour) ? "booked" : "free"}`}
            title={`${hour}:00 - ${hour + 1}:00`}
          >
            {hour}:00
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingTimeline;
