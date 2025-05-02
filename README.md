# Library Management System

A comprehensive Library Management System built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### User Roles
- **Admin**: Full system access
- **Librarian**: Manage books, members, borrowings, and reservations
- **User**: Browse books, view borrowing history

### Functionality
- User authentication and authorization
- Book management (add, update, delete, search)
- Member management
- Book borrowing and returning
- Reservations system
- Fine management
- Dashboard with statistics

## Technology Stack

### Frontend
- React (with Vite)
- React Router for navigation
- Tailwind CSS with Shadcn UI components
- React Query for data fetching
- Formik for form handling
- Yup for form validation

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- RESTful API design

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd library-management-system
   ```

2. **Install backend dependencies**
   ```
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```
   cd ../frontend
   npm install
   ```

4. **Create environment variables**

   Backend (create a `.env` file in the backend directory):
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

### Running the Application

1. **Start the backend server**
   ```
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```
   cd frontend
   npm run dev
   ```

3. **Access the application**
   
   Frontend: `http://localhost:5173`
   
   Backend API: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Books
- `GET /api/books` - Get all books (with filtering, pagination)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Add a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `GET /api/books/stats/overview` - Get book statistics

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Add a new member
- `PUT /api/members/:id` - Update a member
- `DELETE /api/members/:id` - Delete a member
- `GET /api/members/:id/borrowed-books` - Get borrowed books for a member
- `POST /api/members/:id/pay-fine` - Process fine payment

### Borrowed Books
- `GET /api/borrowed` - Get all borrowed books
- `GET /api/borrowed/:id` - Get borrowed book by ID
- `POST /api/borrowed` - Issue a book
- `PUT /api/borrowed/:id/return` - Return a book
- `PUT /api/borrowed/:id/renew` - Renew a borrowed book
- `GET /api/borrowed/stats/overview` - Get borrowing statistics

### Reservations
- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/:id` - Get reservation by ID
- `POST /api/reservations` - Create a reservation
- `PUT /api/reservations/:id` - Update reservation status
- `DELETE /api/reservations/:id` - Delete a reservation
- `GET /api/reservations/book/:bookId/pending` - Get pending reservations for a book

## License

This project is licensed under the MIT License.