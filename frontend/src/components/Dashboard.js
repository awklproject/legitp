import React, { useContext } from 'react';
import { Typography } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import BookedItems from './BookedItems';
import SalesReports from './SalesReports';
import SupplierBookings from './SupplierBookings.js'
import UploadedOffers from './UploadedOffers';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <Typography variant="h3" component="h1" gutterBottom>
        Dashboard
      </Typography>
      {user && user.is_supplier && (
        <div>
          <SalesReports />
          <hr />
          Requested bookings:
          <hr />
          <SupplierBookings />
          <hr />
          My Offers:
          <UploadedOffers />
          <hr />
        </div>
      )}
      {user && user.is_customer && <BookedItems />}
    </div>
  );
};

export default Dashboard;
