import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expenseService } from '../services/api';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryIcons = {
    'Food': '🍔',
    'Transportation': '🚗',
    'Entertainment': '🎬',
    'Education': '📚',
    'Shopping': '🛍️',
    'Bills': '📄',
    'Other': '📌'
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getExpenses();
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError('Failed to load expenses');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setExpenseToDelete(id);
    setShowConfirmModal(true);
  };

  const deleteExpense = async () => {
    try {
      await expenseService.deleteExpense(expenseToDelete);
      await fetchExpenses(); // Refresh the list after deletion
      setShowConfirmModal(false);
      setNotificationMessage('Expense deleted successfully');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      setError('Failed to delete expense');
      console.error('Error deleting expense:', err);
    }
  };

  const cancelDelete = () => {
    setExpenseToDelete(null);
    setShowConfirmModal(false);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesFilter =
      filter === 'all' || expense.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'amount') {
      return sortDirection === 'asc'
        ? a.amount - b.amount
        : b.amount - a.amount;
    } else if (sortBy === 'category') {
      return sortDirection === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    } else if (sortBy === 'description') {
      return sortDirection === 'asc'
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description);
    }
    return 0;
  });

  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Calculate total amount for filtered expenses
  const totalAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="expense-list">
      <h2>Expenses</h2>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      {showNotification && (
        <div className="alert alert-success">{notificationMessage}</div>
      )}
      
      {loading ? (
        <div className="loading">Loading expenses...</div>
      ) : (
        <>
          <div className="filters">
            <div className="search">
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="category-filter">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Education">Education</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="expense-actions">
            <Link to="/add-expense" className="btn btn-primary">
              <i className="icon-plus"></i> Add New Expense
            </Link>
            
            <div className="expense-summary">
              <span className="summary-text">
                Showing {filteredExpenses.length} of {expenses.length} expenses
              </span>
              <span className="summary-amount">
                Total: <strong>₹{totalAmount.toFixed(2)}</strong>
              </span>
            </div>
          </div>

          {showConfirmModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this expense?</p>
                <div className="modal-actions">
                  <button onClick={deleteExpense} className="btn btn-danger">Delete</button>
                  <button onClick={cancelDelete} className="btn">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {filteredExpenses.length === 0 ? (
            <div className="no-expenses">
              <p>No expenses found</p>
              <p>Try adjusting your filters or add a new expense</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('date')} className="sortable-header">
                      Date {getSortIcon('date')}
                    </th>
                    <th onClick={() => handleSort('category')} className="sortable-header">
                      Category {getSortIcon('category')}
                    </th>
                    <th onClick={() => handleSort('description')} className="sortable-header">
                      Description {getSortIcon('description')}
                    </th>
                    <th onClick={() => handleSort('amount')} className="sortable-header">
                      Amount {getSortIcon('amount')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExpenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>{new Date(expense.date).toLocaleDateString()}</td>
                      <td>
                        <span className="category-icon">
                          {categoryIcons[expense.category]}
                        </span>
                        {expense.category}
                      </td>
                      <td>{expense.description}</td>
                      <td className="amount">₹{expense.amount.toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => confirmDelete(expense._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpenseList; 