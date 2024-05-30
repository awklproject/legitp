import React from 'react';
import './BookingCard.css';

const BookingCard = ({ booking, type }) => {
  return (
    <div className="card">
      <div className="title">
        {type === 'activity' && booking.activity.title}
        {type === 'package' && booking.package.title}
        {type === 'tour' && booking.tour.title}
      </div>
      <div className="date">
        Date: {booking.start_date}
      </div>
      {type === 'activity' && (
        <div className="time">
          Time: {booking.start_time} - {booking.end_time}
        </div>
      )}
      <div className="confirmed">
        Confirmed: {booking.confirmed ? 'Yes' : 'No'}
      </div>
    </div>
  );
};

export default BookingCard;
