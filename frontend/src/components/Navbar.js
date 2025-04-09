import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <>
      <li>
        <Link to="/">Dashboard</Link>
      </li>
      <li>
        <Link to="/add-expense">Add Expense</Link>
      </li>
      <li>
        <Link to="/expenses">Expenses</Link>
      </li>
      <li>
        <Link to="/reports">Reports</Link>
      </li>
      <li>
        <a onClick={onLogout} href="#!">
          Logout
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </>
  );

  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="app-title">
          <Link to="/">BudgetBuddy</Link>
        </h1>
        {user && <span>Welcome, {user.name}</span>}
        <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
      </div>
    </nav>
  );
};

export default Navbar; 