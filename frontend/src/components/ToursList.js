import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const API_URL = 'http://localhost:8000/api/tours/';

const ToursList = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(API_URL);
        setTours(response.data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Tours
      </Typography>
      <List>
        {tours.map(tour => (
          <ListItem key={tour.id} component={Link} to={`/tours/${tour.id}`} button>
            <ListItemText primary={tour.title} secondary={`Price: ${tour.price}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ToursList;

