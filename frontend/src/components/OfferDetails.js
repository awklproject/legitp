import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchActivityDetails, fetchPackageDetails, fetchTourDetails, createActivityBooking, createPackageBooking, createTourBooking } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Card, CardContent, Typography, Button, TextField, CardMedia } from '@mui/material';
import { DatePicker, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, format } from 'date-fns';
import './OfferDetails.css';

const OfferDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [bookingData, setBookingData] = useState({ start_date: null, start_time: '' });
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const path = window.location.pathname;
        let response;
        if (path.includes('activity')) {
          response = await fetchActivityDetails(id);
          setType('activity');
        } else if (path.includes('package')) {
          response = await fetchPackageDetails(id);
          setType('package');
        } else if (path.includes('tour')) {
          response = await fetchTourDetails(id);
          setType('tour');
        }
        setOffer(response.data);
        setAvailableDates(getAvailableDates(response.data.available_from, response.data.available_to, response.data.days_off));
      } catch (error) {
        console.error(error);
      }
    };

    fetchDetails();
  }, [id]);

  const getAvailableDates = (from, to, daysOff) => {
    const availableDates = [];
    const startDate = new Date(from);
    const endDate = new Date(to);
    const dayOffs = daysOff.split(',').map(day => day.trim());

    for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
      const day = format(d, 'EEEE');
      if (!dayOffs.includes(day)) {
        availableDates.push(new Date(d));
      }
    }
    return availableDates;
  };

  const handleBooking = async () => {
    setError('');
    let response;
    try {
      if (!token) {
        setError('You must be logged in to make a booking');
        return;
      }

      // Format the date and time correctly
      const formattedDate = format(new Date(bookingData.start_date), 'yyyy-MM-dd');
      const formattedTime = bookingData.start_time;

      const bookingPayload = {
        start_date: formattedDate,
        start_time: formattedTime,
      };

      if (type === 'activity') {
        response = await createActivityBooking(id, bookingPayload, token);
      } else if (type === 'package') {
        response = await createPackageBooking(id, bookingPayload, token);
      } else if (type === 'tour') {
        response = await createTourBooking(id, bookingPayload, token);
      }
      if (response.status >= 400 && response.status < 600) {
        setError(response.data.detail || 'Booking failed');
      } else {
        navigate('/dashboard'); // Redirect to dashboard on success
      }
    } catch (error) {
      console.error(error);
      setError('Booking failed. Please try again.');
    }
  };

  const isDateAvailable = (date) => {
    return availableDates.some(availableDate => availableDate.toDateString() === date.toDateString());
  };

  const renderDay = (day, selectedDate, isInCurrentMonth, dayComponent) => {
    const isSelected = isDateAvailable(day);

    return (
      <PickersDay
        {...dayComponent}
        day={day}
        selected={isSelected}
        disabled={!isSelected}
      />
    );
  };

  if (!offer) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div className="offer-details__container">
      <Card className="offer-details__main">
        <CardMedia
          component="img"
          image={offer.image}
          alt={offer.title}
        />
        <CardContent>
          <Typography variant="h4" component="div" className="offer-details__title">
            {offer.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" className="offer-details__description">
            {offer.description}
          </Typography>
          <Typography variant="body1" color="text.secondary" className="offer-details__details">
            Price: ${offer.price}
          </Typography>
          <Typography variant="body1" color="text.secondary" className="offer-details__details">
            Available from: {offer.available_from}
          </Typography>
          <Typography variant="body1" color="text.secondary" className="offer-details__details">
            Available to: {offer.available_to}
          </Typography>
          <Typography variant="body1" color="text.secondary" className="offer-details__details">
            Stock: {offer.stock}
          </Typography>
          <Typography variant="body1" color="text.secondary" className="offer-details__details">
            Days Off: {offer.days_off}
          </Typography>
          <Typography variant="body1" color="text.secondary" className="offer-details__details">
            Period: {offer.period}
          </Typography>
          <Typography variant="body1" color="text.secondary" className="offer-details__categories">
            Categories: {offer.categories.join(', ')}
          </Typography>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>
      {token && (
        <Card className="offer-details__sidebar">
          <CardContent>
            <Typography variant="h5" component="div" className="offer-details__title">
              Book Now
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={bookingData.start_date}
                onChange={(date) => setBookingData({ ...bookingData, start_date: date })}
                shouldDisableDate={(date) => !isDateAvailable(date)}
                renderDay={renderDay}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            {type === 'activity' && (
              <TextField
                label="Start Time"
                type="time"
                value={bookingData.start_time}
                onChange={(e) => setBookingData({ ...bookingData, start_time: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            )}
            <Button variant="contained" color="primary" onClick={handleBooking}>
              Book Now
            </Button>
          </CardContent>
        </Card>
      )}
      {!token && (
        <Typography variant="body2" color="error">
          You must be logged in to make a booking.
        </Typography>
      )}
    </div>
  );
};

export default OfferDetails;
