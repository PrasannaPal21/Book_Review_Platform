# Book Review Platform

A full-stack web application for book enthusiasts to discover, review, and rate books. Built with React, Node.js, Express, and MongoDB.

## Features

### User Features
- User authentication (register, login, logout)
- User profiles with customizable information
- Profile picture upload
- View and edit personal information

### Book Management
- Browse books with pagination
- Search books by title, author, or genre
- Filter books by various criteria
- View detailed book information
- Book recommendations

### Review System
- Write and submit book reviews
- Rate books (1-5 stars)
- Edit and delete own reviews
- View all reviews for a book
- Sort reviews by date, rating, or helpfulness

### Social Features
- Follow other users
- View other users' profiles and reviews
- Like and comment on reviews
- Share reviews on social media

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- Axios for API requests
- Material-UI for components
- React Hook Form for form handling
- React Query for data fetching

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Express Validator for input validation

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/book-review-platform.git
cd book-review-platform
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
FILE_UPLOAD_PATH=./public/uploads
MAX_FILE_SIZE=1000000
```

5. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/logout - Logout user
- GET /api/auth/me - Get current user

### Books
- GET /api/books - Get all books
- GET /api/books/:id - Get single book
- POST /api/books - Create new book (admin only)
- PUT /api/books/:id - Update book (admin only)
- DELETE /api/books/:id - Delete book (admin only)

### Reviews
- GET /api/books/:bookId/reviews - Get book reviews
- POST /api/books/:bookId/reviews - Create review
- PUT /api/reviews/:id - Update review
- DELETE /api/reviews/:id - Delete review

### Users
- GET /api/users/:id - Get user profile
- PUT /api/users/:id - Update user profile
- PUT /api/users/:id/password - Update password
- POST /api/users/:id/photo - Upload profile photo

## Project Structure

```
book-review-platform/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── .env
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


