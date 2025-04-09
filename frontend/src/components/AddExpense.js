import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { expenseService } from '../services/api';

const AddExpense = () => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { amount, category, description, date } = formData;

  const categoryIcons = {
    'Food': '🍔',
    'Transportation': '🚗',
    'Entertainment': '🎬',
    'Education': '📚',
    'Shopping': '🛍️',
    'Bills': '📄',
    'Other': '📌'
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear validation error when field is being changed
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      errors.amount = 'Please enter a valid amount';
    }
    if (!category) {
      errors.category = 'Please select a category';
    }
    if (!description.trim()) {
      errors.description = 'Please enter a description';
    }
    if (!date) {
      errors.date = 'Please select a date';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Prepare expense data
        const expenseData = {
          amount: parseFloat(amount),
          category,
          description,
          date: new Date(date)
        };

        // Add expense using API service
        await expenseService.addExpense(expenseData);
        
        // Show success message
        setShowSuccess(true);
        setError(null);
        
        // Reset form
        setFormData({
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
        
        // Hide success message after 2 seconds and navigate
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/expenses');
        }, 2000);
      } catch (err) {
        setError(err.message || 'Failed to add expense');
        setShowSuccess(false);
      }
    }
  };

  const cancelPreview = () => {
    setShowPreview(false);
  };

  return (
    <div className="add-expense">
      <h2>Add New Expense</h2>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      {showSuccess && (
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark draw"></div>
          </div>
          <p>Expense added successfully!</p>
        </div>
      )}
      
      {!showSuccess && (
        <>
          {showPreview ? (
            <div className="expense-preview">
              <h3>Expense Preview</h3>
              <div className="preview-card">
                <div className="preview-header">
                  <span className="preview-category">
                    {categoryIcons[category]} {category}
                  </span>
                  <span className="preview-date">
                    {new Date(date).toLocaleDateString()}
                  </span>
                </div>
                <div className="preview-amount">₹{parseFloat(amount).toFixed(2)}</div>
                <div className="preview-description">{description}</div>
                
                <div className="preview-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleSubmit}
                  >
                    Confirm & Add
                  </button>
                  <button 
                    className="btn" 
                    onClick={cancelPreview}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePreview}>
              <div className={`form-group ${validationErrors.amount ? 'has-error' : ''}`}>
                <label htmlFor="amount">Amount</label>
                <div className="amount-input">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0.01"
                    name="amount"
                    value={amount}
                    onChange={onChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                {validationErrors.amount && (
                  <span className="error-message">{validationErrors.amount}</span>
                )}
              </div>
              
              <div className={`form-group ${validationErrors.category ? 'has-error' : ''}`}>
                <label htmlFor="category">Category</label>
                <select 
                  id="category"
                  name="category" 
                  value={category} 
                  onChange={onChange} 
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Food">🍔 Food</option>
                  <option value="Transportation">🚗 Transportation</option>
                  <option value="Entertainment">🎬 Entertainment</option>
                  <option value="Education">📚 Education</option>
                  <option value="Shopping">🛍️ Shopping</option>
                  <option value="Bills">📄 Bills</option>
                  <option value="Other">📌 Other</option>
                </select>
                {validationErrors.category && (
                  <span className="error-message">{validationErrors.category}</span>
                )}
              </div>
              
              <div className={`form-group ${validationErrors.description ? 'has-error' : ''}`}>
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={description}
                  onChange={onChange}
                  placeholder="What was this expense for?"
                  required
                />
                {validationErrors.description && (
                  <span className="error-message">{validationErrors.description}</span>
                )}
              </div>
              
              <div className={`form-group ${validationErrors.date ? 'has-error' : ''}`}>
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={date}
                  onChange={onChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                {validationErrors.date && (
                  <span className="error-message">{validationErrors.date}</span>
                )}
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Preview Expense</button>
                <Link to="/expenses" className="btn">Cancel</Link>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default AddExpense; 