import React, { useEffect, useState, useContext } from 'react';
import { fetchSupplierBookings, confirmBooking } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const SupplierBookings = () => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState({ activities: [], packages: [], tours: [] });

  useEffect(() => {
    const getSupplierBookings = async () => {
      try {
        const response = await fetchSupplierBookings(token);
        setBookings(response);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      getSupplierBookings();
    }
  }, [token]);

  const handleConfirm = async (bookingType, bookingId) => {
    try {
      await confirmBooking(bookingType, bookingId, token);
      setBookings((prevBookings) => ({
        ...prevBookings,
        [bookingType]: prevBookings[bookingType].map((booking) =>
          booking.id === bookingId ? { ...booking, confirmed: true } : booking
        ),
      }));
      alert('Booking confirmed');
    } catch (error) {
      console.error(error);
      alert('Failed to confirm booking');
    }
  };

  const renderBookings = (bookingType, bookingsList) => (
    bookingsList.map((booking) => (
      <Grid item xs={12} sm={6} md={4} key={booking.id}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} Booking ID: {booking.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Offer ID: {booking.offer}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Booking Date: {booking.booking_date}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confirmed: {booking.confirmed ? 'Yes' : 'No'}
            </Typography>
            {!booking.confirmed && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleConfirm(bookingType, booking.id)}
              >
                Confirm Booking
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>
    ))
  );

  return (
    <Grid container spacing={2}>
      {renderBookings('activities', bookings.activities)}
      {renderBookings('packages', bookings.packages)}
      {renderBookings('tours', bookings.tours)}
    </Grid>
  );
};

export default SupplierBookings;
