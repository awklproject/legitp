import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import OffersList from './components/OffersList';
import OfferDetails from './components/OfferDetails';
import Navbar from './components/Navbar';
import Container from '@mui/material/Container';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Container>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<OffersList />} />
            <Route path="/offers/activity/:id" element={<OfferDetails />} />
            <Route path="/offers/package/:id" element={<OfferDetails />} />
            <Route path="/offers/tour/:id" element={<OfferDetails />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
