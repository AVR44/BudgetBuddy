import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { expenseService, budgetService } from '../services/api';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch expenses
      const expensesData = await expenseService.getExpenses();
      const sortedExpenses = expensesData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sortedExpenses);
      
      // Calculate total spent from all expenses
      const total = expensesData.reduce((acc, expense) => acc + expense.amount, 0);
      setTotalSpent(total);
      
      // Fetch budget
      const budgetData = await budgetService.getBudget();
      if (budgetData && budgetData.length > 0) {
        setMonthlyBudget(budgetData[0].amount);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetEdit = () => {
    setIsEditingBudget(true);
    setNewBudget(monthlyBudget);
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    const budget = parseFloat(newBudget);
    if (isNaN(budget) || budget <= 0) {
      setAlertMessage('Please enter a valid budget amount');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      // Update budget in database
      const updatedBudget = await budgetService.updateBudget({
        amount: budget,
        period: 'monthly',
        category: 'all'
      });
      
      if (updatedBudget) {
        setMonthlyBudget(updatedBudget.amount);
        setIsEditingBudget(false);
        setAlertMessage('Budget updated successfully!');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (err) {
      console.error('Budget update error:', err);
      setAlertMessage(err.message || 'Failed to update budget. Please try again.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const remainingBudget = monthlyBudget - totalSpent;
  const percentSpent = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      {showAlert && (
        <div className={`alert ${alertMessage.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
          {alertMessage}
        </div>
      )}
      
      <div className="summary-cards">
        <div className="card">
          <h3>Monthly Budget</h3>
          {isEditingBudget ? (
            <form onSubmit={handleBudgetSubmit}>
              <div className="form-group">
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save</button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => setIsEditingBudget(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p>₹{monthlyBudget}</p>
              <button 
                onClick={handleBudgetEdit} 
                className="btn btn-primary btn-sm"
              >
                Edit Budget
              </button>
            </>
          )}
        </div>
        <div className="card">
          <h3>Total Spent</h3>
          <p>₹{totalSpent.toFixed(2)}</p>
          <div className="progress-container">
            <div 
              className="progress-bar"
              style={{ 
                width: `${Math.min(percentSpent, 100)}%`,
                backgroundColor: percentSpent > 80 ? '#e74c3c' : percentSpent > 60 ? '#f39c12' : '#2ecc71'
              }}
            ></div>
          </div>
          <p className="progress-text">{Math.round(percentSpent)}% of budget</p>
        </div>
        <div className="card">
          <h3>Remaining</h3>
          <p className={remainingBudget < 0 ? 'negative' : 'positive'}>
            ₹{remainingBudget.toFixed(2)}
          </p>
          {remainingBudget < 0 && (
            <p className="warning-text">You've exceeded your budget!</p>
          )}
        </div>
      </div>

      <div className="recent-expenses">
        <div className="recent-expenses-header">
          <h3>Recent Expenses</h3>
          <Link to="/add-expense" className="btn btn-primary">
            Add New Expense
          </Link>
        </div>
        {loading ? (
          <div className="loading">Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <p>No expenses recorded yet</p>
        ) : (
          <ul>
            {expenses.slice(0, 5).map((expense) => (
              <li key={expense._id} className="expense-item">
                <span className="amount">₹{expense.amount.toFixed(2)}</span>
                <span className={`category category-${expense.category.toLowerCase()}`}>
                  {expense.category}
                </span>
                <span className="description">{expense.description}</span>
                <span className="date">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link to="/expenses" className="btn">
          View All Expenses
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 