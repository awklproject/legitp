import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const API_URL = 'http://localhost:8000/api/activities/';

const ActivitiesList = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(API_URL);
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Activities
      </Typography>
      <List>
        {activities.map(activity => (
          <ListItem key={activity.id} component={Link} to={`/activities/${activity.id}`} button>
            <ListItemText primary={activity.title} secondary={`Price: ${activity.price}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ActivitiesList;
