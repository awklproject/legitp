import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const USER_URL = "http://localhost:8000/"

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        if (token) {
            axios.get(`${USER_URL}users/user/`, {
                headers: { 'Authorization': `Token ${token}` }
            })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        }
    }, [token]);

    const login = (username, password) => {
        return axios.post(`${USER_URL}users/login/`, { username, password })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                setUser(response.data.user);
            });
    };

    const register = (username, email, password) => {
        return axios.post(`${USER_URL}users/register/`, { username, email, password, is_supplier: false, is_customer: true })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                setUser(response.data.user);
            });
    };

    const logout = () => {
        axios.post(`${USER_URL}users/logout/`, {}, {
            headers: { 'Authorization': `Token ${token}` }
        }).then(() => {
            localStorage.removeItem('token');
            setToken('');
            setUser(null);
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
