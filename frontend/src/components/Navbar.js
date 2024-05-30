import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1 }}>
          LebAdvisor
        </Typography>
        <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
        {!user ? (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        ) : (
          <Button color="inherit" onClick={logout}>
            Logout {user.is_supplier ? 'supplier' : 'customer'}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

