import React, { useEffect, useState, useContext } from 'react';
import { fetchSupplierUploadedOffers, updateOffer } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const UploadedOffers = () => {
  const { token } = useContext(AuthContext);
  const [offers, setOffers] = useState({ activities: [], packages: [], tours: [] });
  const [editMode, setEditMode] = useState({});
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    const getUploadedOffers = async () => {
      try {
        const response = await fetchSupplierUploadedOffers(token);
        setOffers(response);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      getUploadedOffers();
    }
  }, [token]);

  const handleEditClick = (offerType, offerId) => {
    setEditMode((prevState) => ({ ...prevState, [`${offerType}_${offerId}`]: true }));
  };

  const handleCancelClick = (offerType, offerId) => {
    setEditMode((prevState) => ({ ...prevState, [`${offerType}_${offerId}`]: false }));
  };

  const handleInputChange = (e, offerType, offerId) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({
      ...prevState,
      [`${offerType}_${offerId}`]: { ...prevState[`${offerType}_${offerId}`], [name]: value },
    }));
  };

  const handleSaveClick = async (offerType, offerId) => {
    try {
      await updateOffer(offerType, offerId, updatedData[`${offerType}_${offerId}`], token);
      alert('Offer updated successfully');
      setEditMode((prevState) => ({ ...prevState, [`${offerType}_${offerId}`]: false }));
      setOffers((prevState) => ({
        ...prevState,
        [offerType]: prevState[offerType].map((offer) =>
          offer.id === offerId
            ? { ...offer, ...updatedData[`${offerType}_${offerId}`] }
            : offer
        ),
      }));
    } catch (error) {
      console.error(error);
      alert('Failed to update offer');
    }
  };

  const renderOffers = (offerType, offersList) => (
    offersList.map((offer) => (
      <Grid item xs={12} sm={6} md={4} key={offer.id}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {offer.title}
            </Typography>
            {editMode[`${offerType}_${offer.id}`] ? (
              <>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={updatedData[`${offerType}_${offer.id}`]?.price || offer.price}
                  onChange={(e) => handleInputChange(e, offerType, offer.id)}
                />
                <TextField
                  label="Stock"
                  name="stock"
                  type="number"
                  value={updatedData[`${offerType}_${offer.id}`]?.stock || offer.stock}
                  onChange={(e) => handleInputChange(e, offerType, offer.id)}
                />
                <TextField
                  label="Available From"
                  type="date"
                  name="available_from"
                  value={updatedData[`${offerType}_${offer.id}`]?.available_from || offer.available_from}
                  onChange={(e) => handleInputChange(e, offerType, offer.id)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Available To"
                  type="date"
                  name="available_to"
                  value={updatedData[`${offerType}_${offer.id}`]?.available_to || offer.available_to}
                  onChange={(e) => handleInputChange(e, offerType, offer.id)}
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSaveClick(offerType, offer.id)}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleCancelClick(offerType, offer.id)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary">
                  Price: ${offer.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock: {offer.stock}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available From: {offer.available_from}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available To: {offer.available_to}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditClick(offerType, offer.id)}
                >
                  Edit
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    ))
  );

  return (
    <Grid container spacing={2}>
      {renderOffers('activities', offers.activities)}
      {renderOffers('packages', offers.packages)}
      {renderOffers('tours', offers.tours)}
    </Grid>
  );
};

export default UploadedOffers;
