import React, { useEffect, useState, useContext } from 'react';
import { fetchCustomerActivityBookings, fetchCustomerPackageBookings, fetchCustomerTourBookings } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Grid from '@mui/material/Grid';
import BookingCard from './BookingCard';

const BookedItems = () => {
  const { token } = useContext(AuthContext);
  const [activityBookings, setActivityBookings] = useState([]);
  const [packageBookings, setPackageBookings] = useState([]);
  const [tourBookings, setTourBookings] = useState([]);

  useEffect(() => {
    const getBookedItems = async () => {
      try {
        const activityResponse = await fetchCustomerActivityBookings(token);
        const packageResponse = await fetchCustomerPackageBookings(token);
        const tourResponse = await fetchCustomerTourBookings(token);
        setActivityBookings(activityResponse.data);
        setPackageBookings(packageResponse.data);
        setTourBookings(tourResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      getBookedItems();
    }
  }, [token]);

  return (
    <Grid container spacing={2}>
      {activityBookings.map((booking) => (
        <Grid item xs={12} sm={6} md={4} key={booking.id}>
          <BookingCard booking={booking} type="activity" />
        </Grid>
      ))}
      {packageBookings.map((booking) => (
        <Grid item xs={12} sm={6} md={4} key={booking.id}>
          <BookingCard booking={booking} type="package" />
        </Grid>
      ))}
      {tourBookings.map((booking) => (
        <Grid item xs={12} sm={6} md={4} key={booking.id}>
          <BookingCard booking={booking} type="tour" />
        </Grid>
      ))}
    </Grid>
  );
};

export default BookedItems;
