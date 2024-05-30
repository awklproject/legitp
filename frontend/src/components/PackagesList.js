import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const API_URL = 'http://localhost:8000/api/packages/';

const PackagesList = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(API_URL);
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Packages
      </Typography>
      <List>
        {packages.map(pkg => (
          <ListItem key={pkg.id} component={Link} to={`/packages/${pkg.id}`} button>
            <ListItemText primary={pkg.title} secondary={`Price: ${pkg.price}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default PackagesList;

