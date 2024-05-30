import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const fetchCategories = async () => {
  return axios.get(`${API_URL}categories/`);
};

const fetchFilteredActivities = async (categoryIds) => {
  const params = new URLSearchParams();
  categoryIds.forEach(id => params.append('category_ids', id));
  return axios.get(`${API_URL}activities/`, { params });
};

const fetchActivityDetails = async (id) => {
  return axios.get(`${API_URL}activities/${id}/`);
};

const createActivityBooking = async (activityId, bookingData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}bookings/activities/`,
      {
        activity_id: activityId,
        start_date: bookingData.start_date,
        start_time: bookingData.start_time,
      },
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

const fetchCustomerActivityBookings = async (token) => {
  return axios.get(`${API_URL}bookings/customer/activities/`, {
    headers: { Authorization: `Token ${token}` },
  });
};

const fetchSalesReports = async (token) => {
  return axios.get(`${API_URL}sales/reports/`, {
    headers: { Authorization: `Token ${token}` },
  });
};

const fetchFilteredPackages = async (categoryIds) => {
  const params = new URLSearchParams();
  categoryIds.forEach(id => params.append('category_ids', id));
  return axios.get(`${API_URL}packages/`, { params });
};

const fetchPackageDetails = async (id) => {
  return axios.get(`${API_URL}packages/${id}/`);
};

const createPackageBooking = async (packageId, bookingData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}bookings/packages/`,
      {
        package_id: packageId,
        start_date: bookingData.start_date,
      },
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

const fetchCustomerPackageBookings = async (token) => {
  return axios.get(`${API_URL}bookings/customer/packages/`, {
    headers: { Authorization: `Token ${token}` },
  });
};

const fetchFilteredTours = async (categoryIds) => {
  const params = new URLSearchParams();
  categoryIds.forEach(id => params.append('category_ids', id));
  return axios.get(`${API_URL}tours/`, { params });
};

const fetchTourDetails = async (id) => {
  return axios.get(`${API_URL}tours/${id}/`);
};

const createTourBooking = async (tourId, bookingData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}bookings/tours/`,
      {
        tour_id: tourId,
        start_date: bookingData.start_date,
      },
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

const fetchCustomerTourBookings = async (token) => {
  return axios.get(`${API_URL}bookings/customer/tours/`, {
    headers: { Authorization: `Token ${token}` },
  });
};

// New consolidated fetch function
const fetchSupplierBookings = async (token) => {
  const activities = await axios.get(`${API_URL}bookings/supplier/activities/`, {
    headers: { Authorization: `Token ${token}` },
  });

  const packages = await axios.get(`${API_URL}bookings/supplier/packages/`, {
    headers: { Authorization: `Token ${token}` },
  });

  const tours = await axios.get(`${API_URL}bookings/supplier/tours/`, {
    headers: { Authorization: `Token ${token}` },
  });

  return {
    activities: activities.data,
    packages: packages.data,
    tours: tours.data,
  };
};

// Consolidated confirm function
const confirmBooking = async (bookingType, bookingId, token) => {
  const endpointMap = {
    activity: `${API_URL}bookings/activities/confirm/${bookingId}/`,
    package: `${API_URL}bookings/packages/confirm/${bookingId}/`,
    tour: `${API_URL}bookings/tours/confirm/${bookingId}/`,
  };

  return axios.patch(endpointMap[bookingType], {}, {
    headers: { Authorization: `Token ${token}` },
  });
};

const fetchSupplierUploadedOffers = async (token) => {
  const activities = await axios.get(`${API_URL}supplier/activities/`, {
    headers: { Authorization: `Token ${token}` },
  });

  const packages = await axios.get(`${API_URL}supplier/packages/`, {
    headers: { Authorization: `Token ${token}` },
  });

  const tours = await axios.get(`${API_URL}supplier/tours/`, {
    headers: { Authorization: `Token ${token}` },
  });

  return {
    activities: activities.data,
    packages: packages.data,
    tours: tours.data,
  };
};

const updateOffer = async (offerType, offerId, data, token) => {
  const endpointMap = {
    activities: `${API_URL}activities/${offerId}/update/`,
    packages: `${API_URL}packages/${offerId}/update/`,
    tours: `${API_URL}tours/${offerId}/update/`,
  };

  return axios.patch(endpointMap[offerType], data, {
    headers: { Authorization: `Token ${token}` },
  });
};

export {
  fetchSupplierUploadedOffers,
  updateOffer,
  fetchCategories,
  fetchFilteredActivities,
  fetchActivityDetails,
  createActivityBooking,
  fetchCustomerActivityBookings,
  fetchSalesReports,
  fetchFilteredPackages,
  fetchPackageDetails,
  createPackageBooking,
  fetchCustomerPackageBookings,
  fetchFilteredTours,
  fetchTourDetails,
  createTourBooking,
  fetchCustomerTourBookings,
  fetchSupplierBookings, // New export
  confirmBooking, // New export
};
