import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Container } from '@mui/material';
import BookingForm from './BookingForm';

const API_URL = 'http://localhost:8000/api/activities/';

const ActivityDetails = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`${API_URL}${id}/`);
        setActivity(response.data);
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    fetchActivity();
  }, [id]);

  if (!activity) return <div>Loading...</div>;

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          alt={activity.title}
          height="140"
          image={activity.image}
          title={activity.title}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {activity.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activity.description}
          </Typography>
          <Typography variant="h6" component="div">
            Price: {activity.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Available from {activity.available_from} to {activity.available_to}
          </Typography>
        </CardContent>
      </Card>
      <BookingForm contentType="activity" />
    </Container>
  );
};

export default ActivityDetails;
