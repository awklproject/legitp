import React, { useEffect, useState, useContext } from 'react';
import { fetchSalesReports } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const SalesReports = () => {
  const { token } = useContext(AuthContext);
  const [reports, setReports] = useState({});

  useEffect(() => {
    const getSalesReports = async () => {
      try {
        const response = await fetchSalesReports(token);
        setReports(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      getSalesReports();
    }
  }, [token]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Sales Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Sales: ${reports.total_sales}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sales Today: ${reports.sales_today}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sales This Month: ${reports.sales_this_month}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Bookings: {reports.total_bookings}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Accepted Bookings: {reports.accepted_bookings}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bookings on Hold: {reports.bookings_on_hold}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SalesReports;
