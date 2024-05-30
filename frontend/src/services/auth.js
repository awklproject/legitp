import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8000/auth-api/';
const API_URL = 'http://localhost:8000/api/'
const USERS_API = 'http://localhost:8000/users/'

const getCsrfToken = async () => {
  const response = await axios.get(`${API_URL}csrf/`);
  return response.data.csrfToken;
};

const login = async (username, password) => {
  const csrfToken = await getCsrfToken();
  return axios.post(
    `${AUTH_API_URL}login/`,
    { username, password },
    {
      headers: {
        'X-CSRFToken': csrfToken,
      },
      withCredentials: true,
    }
  );
};

const register = (username, email, password, userType) => {
  return axios.post(`${USERS_API}register/${userType}/`, {
    user: { username, email, password },
  });
};

const logout = () => {
  return axios.post(`${AUTH_API_URL}logout/`, {}, { withCredentials: true });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
};
