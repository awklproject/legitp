import React, { useEffect, useState } from 'react';
import { fetchFilteredActivities, fetchFilteredPackages, fetchFilteredTours } from '../services/api';
import { Card, CardContent, Typography, Button, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import './OffersList.css';

const OffersList = () => {
  const [activities, setActivities] = useState([]);
  const [packages, setPackages] = useState([]);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const activitiesResponse = await fetchFilteredActivities([]);
        const packagesResponse = await fetchFilteredPackages([]);
        const toursResponse = await fetchFilteredTours([]);
        setActivities(activitiesResponse.data);
        setPackages(packagesResponse.data);
        setTours(toursResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOffers();
  }, []);

  const renderCard = (item, type) => (
    <Card className="card" key={item.id}>
      <CardMedia
        component="img"
        image={item.image}
        alt={item.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" className="title">
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="categories">
          Categories: {item.categories.join(', ')}
        </Typography>
        <Button component={Link} to={`/offers/${type}/${item.id}`} variant="contained" color="primary">
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="offers-section">
        <Typography variant="h4" className="offers-title">Activities</Typography>
        <div className="offers-row">
          {activities.map(activity => renderCard(activity, 'activity'))}
        </div>
      </div>

      <div className="offers-section">
        <Typography variant="h4" className="offers-title">Packages</Typography>
        <div className="offers-row">
          {packages.map(packageItem => renderCard(packageItem, 'package'))}
        </div>
      </div>

      <div className="offers-section">
        <Typography variant="h4" className="offers-title">Tours</Typography>
        <div className="offers-row">
          {tours.map(tour => renderCard(tour, 'tour'))}
        </div>
      </div>
    </div>
  );
};

export default OffersList;
