import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Container } from '@mui/material';
import BookingForm from './BookingForm';

const API_URL = 'http://localhost:8000/api/tours/';

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`${API_URL}${id}/`);
        setTour(response.data);
      } catch (error) {
        console.error("Error fetching tour:", error);
      }
    };

    fetchTour();
  }, [id]);

  if (!tour) return <div>Loading...</div>;

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          alt={tour.title}
          height="140"
          image={tour.image}
          title={tour.title}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {tour.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tour.description}
          </Typography>
          <Typography variant="h6" component="div">
            Price: {tour.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Available from {tour.available_from} to {tour.available_to}
          </Typography>
        </CardContent>
      </Card>
      <BookingForm contentType="tour" />
    </Container>
  );
};

export default TourDetails;
