import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('pie');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    // Mock expenses data - simulate a delay for loading effect
    setTimeout(() => {
      const mockExpenses = [
        {
          _id: '1',
          amount: 150,
          category: 'Food',
          description: 'Grocery shopping',
          date: new Date('2023-08-15')
        },
        {
          _id: '2',
          amount: 50,
          category: 'Transportation',
          description: 'Gas',
          date: new Date('2023-08-14')
        },
        {
          _id: '3',
          amount: 200,
          category: 'Education',
          description: 'Books',
          date: new Date('2023-08-10')
        },
        {
          _id: '4',
          amount: 100,
          category: 'Entertainment',
          description: 'Movie night',
          date: new Date('2023-08-08')
        },
        {
          _id: '5',
          amount: 75,
          category: 'Shopping',
          description: 'Clothes',
          date: new Date('2023-08-05')
        },
        {
          _id: '6',
          amount: 120,
          category: 'Food',
          description: 'Dining out',
          date: new Date('2023-08-03')
        },
        {
          _id: '7',
          amount: 60,
          category: 'Bills',
          description: 'Internet bill',
          date: new Date('2023-08-01')
        }
      ];
  
      setExpenses(mockExpenses);
      setIsLoading(false);
    }, 800);
  }, []);

  const getFilteredExpenses = () => {
    const now = new Date();
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      if (timeRange === 'month') {
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      } else if (timeRange === 'year') {
        return expenseDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
    return filtered;
  };

  const getCategoryData = () => {
    const filteredExpenses = getFilteredExpenses();
    const categories = {};
    filteredExpenses.forEach((expense) => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });

    const backgroundColors = [
      '#FF6384', // Food
      '#36A2EB', // Transportation
      '#FFCE56', // Entertainment
      '#4BC0C0', // Education
      '#9966FF', // Shopping
      '#FF9F40', // Bills
      '#C9CBCF'  // Other
    ];

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          label: 'Expenses by Category',
          data: Object.values(categories),
          backgroundColor: backgroundColors,
          borderWidth: 1,
          borderColor: '#fff',
          hoverOffset: 15
        },
      ],
    };
  };

  const getMonthlyData = () => {
    const filteredExpenses = getFilteredExpenses();
    const months = Array(12).fill(0);
    filteredExpenses.forEach((expense) => {
      const month = new Date(expense.date).getMonth();
      months[month] += expense.amount;
    });

    return {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ],
      datasets: [
        {
          label: 'Monthly Expenses',
          data: months,
          backgroundColor: selectedCategory ? '#36A2EB' : [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#C9CBCF', '#FF6384',
            '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
          ],
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    };
  };

  const getCategoryMonthlyData = () => {
    if (!selectedCategory) return getMonthlyData();

    const filteredExpenses = getFilteredExpenses().filter(
      (expense) => expense.category === selectedCategory
    );
    
    const months = Array(12).fill(0);
    filteredExpenses.forEach((expense) => {
      const month = new Date(expense.date).getMonth();
      months[month] += expense.amount;
    });

    return {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ],
      datasets: [
        {
          label: `${selectedCategory} Expenses`,
          data: months,
          backgroundColor: '#36A2EB',
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    };
  };

  const handlePieChartClick = (_, elements) => {
    if (elements.length === 0) {
      setSelectedCategory(null);
      return;
    }
    
    const categoryIndex = elements[0].index;
    const categoryName = getCategoryData().labels[categoryIndex];
    setSelectedCategory(categoryName);
  };

  // Calculate summary statistics
  const filteredExpenses = getFilteredExpenses();
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageAmount = filteredExpenses.length > 0 
    ? totalAmount / filteredExpenses.length 
    : 0;
  
  // Get highest category
  const categoryTotals = {};
  filteredExpenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });
  
  let highestCategory = { name: 'None', amount: 0 };
  Object.entries(categoryTotals).forEach(([category, amount]) => {
    if (amount > highestCategory.amount) {
      highestCategory = { name: category, amount };
    }
  });

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.formattedValue}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      }
    },
    onClick: () => setSelectedCategory(null)
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = Math.round((value / total) * 100);
            return `₹${value} (${percentage}%)`;
          }
        }
      }
    },
    onClick: handlePieChartClick
  };

  return (
    <div className="reports">
      <h2>Expense Reports</h2>
      
      <div className="report-controls">
        <div className="time-range">
          <label htmlFor="timeRange">Time Period:</label>
          <select 
            id="timeRange"
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        
        <div className="chart-type">
          <label htmlFor="chartType">Chart Type:</label>
          <div className="chart-toggle">
            <button 
              className={`chart-btn ${chartType === 'pie' ? 'active' : ''}`}
              onClick={() => setChartType('pie')}
            >
              Pie Chart
            </button>
            <button 
              className={`chart-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
            >
              Bar Chart
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading expense data...</p>
        </div>
      ) : (
        <>
          <div className="summary-stats">
            <div className="stat-card">
              <h3>Total Expenses</h3>
              <p className="stat-value">₹{totalAmount.toFixed(2)}</p>
              <p className="stat-period">{timeRange === 'month' ? 'This Month' : timeRange === 'year' ? 'This Year' : 'All Time'}</p>
            </div>
            
            <div className="stat-card">
              <h3>Average Expense</h3>
              <p className="stat-value">₹{averageAmount.toFixed(2)}</p>
              <p className="stat-period">Per Transaction</p>
            </div>
            
            <div className="stat-card">
              <h3>Top Category</h3>
              <p className="stat-value">{highestCategory.name}</p>
              <p className="stat-amount">₹{highestCategory.amount.toFixed(2)}</p>
            </div>
          </div>
          
          {selectedCategory && (
            <div className="category-filter-indicator">
              <p>
                Showing data for: <strong>{selectedCategory}</strong>
                <button 
                  className="clear-filter-btn"
                  onClick={() => setSelectedCategory(null)}
                >
                  Clear Filter
                </button>
              </p>
            </div>
          )}

          <div className="charts">
            <div className="chart-container">
              <h3>Expenses by Category</h3>
              {chartType === 'pie' ? (
                <Pie data={getCategoryData()} options={pieOptions} />
              ) : (
                <Bar 
                  data={getCategoryMonthlyData()} 
                  options={barOptions}
                />
              )}
              {chartType === 'pie' && (
                <p className="chart-hint">Click on a category to filter the monthly chart</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports; 