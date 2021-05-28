import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
    render() {
      return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">  
         <Link to="/" className="navbar-brand">Booking App</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
            <Link to="/" className="nav-link">Invoices</Link>
            </li>
            <li className="navbar-item">
            <Link to="/subscribers" className="nav-link">Subscribers</Link>
            </li>
          </ul>
        </div>
        </nav>
      );
    }
  }
