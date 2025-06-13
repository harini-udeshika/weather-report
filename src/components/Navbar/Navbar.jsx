import React from 'react';
import './Navbar.css'; // Import the CSS file for styling
import appLogo from '../../assets/weather-app.png'
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={appLogo} alt="App Logo" className="logo" /> {/* Replace with your logo */}
        <h1 className="app-name">WeatherApp</h1> {/* Replace with your app name */}
      </div>
      <div className="navbar-right">
        <span className="date">13th June | 1:42 AM</span>
      </div>
    </nav>
  );
};

export default Navbar;
