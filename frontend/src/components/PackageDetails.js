import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Container } from '@mui/material';
import BookingForm from './BookingForm';

const API_URL = 'http://localhost:8000/api/packages/';

const PackageDetails = () => {
  const { id } = useParams();
  const [pkg, setPackage] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`${API_URL}${id}/`);
        setPackage(response.data);
      } catch (error) {
        console.error("Error fetching package:", error);
      }
    };

    fetchPackage();
  }, [id]);

  if (!pkg) return <div>Loading...</div>;

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          alt={pkg.title}
          height="140"
          image={pkg.image}
          title={pkg.title}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {pkg.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pkg.description}
          </Typography>
          <Typography variant="h6" component="div">
            Price: {pkg.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Available from {pkg.available_from} to {pkg.available_to}
          </Typography>
        </CardContent>
      </Card>
      <BookingForm contentType="package" />
    </Container>
  );
};

export default PackageDetails;
