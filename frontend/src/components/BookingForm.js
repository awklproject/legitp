import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createBooking } from '../services/api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography, Container } from '@mui/material';

const BookingForm = ({ contentType }) => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [error, setError] = useState('');

  const handleBooking = async () => {
    const response = await createBooking(contentType, id, startDate, startTime, token);
    if (response.error) {
      setError(response.error);
    } else {
      alert('Booking successful');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Book Now
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Start Time"
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleBooking}>
        Book
      </Button>
    </Container>
  );
};

export default BookingForm;
