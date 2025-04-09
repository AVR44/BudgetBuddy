# Student Expense Tracker

A MERN stack application for tracking student expenses with features like expense management, budget tracking, and expense analysis.

## Features

- User Authentication (Register/Login)
- Add, view, edit, and delete expenses
- Set monthly budget
- View expense reports with charts
- Filter and search expenses
- Dashboard with expense summary

## Tech Stack

- MongoDB - Database
- Express.js - Backend framework
- React.js - Frontend library
- Node.js - Runtime environment
- Chart.js - Data visualization

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your-secret-key
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Register a new account or login with existing credentials
2. Set your monthly budget in the dashboard
3. Add expenses with category, amount, and description
4. View your expenses in the expenses list
5. Use the reports page to analyze your spending patterns
6. Filter and search expenses as needed

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Expenses
- GET /api/expenses - Get all expenses
- POST /api/expenses - Add new expense
- PUT /api/expenses/:id - Update expense
- DELETE /api/expenses/:id - Delete expense

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
