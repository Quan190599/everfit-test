# EverFit API

A RESTful API for tracking fitness metrics with support for unit conversions and role-based access control.

## Features

- User authentication and authorization
- Role-based access control (Admin and Regular users)
- Metric tracking with support for:
  - Distance measurements (meters, centimeters, inches, feet, yards)
  - Temperature measurements (Celsius, Fahrenheit, Kelvin)
- Automatic unit conversion
- Data visualization endpoints for charts
- Pagination and filtering
- Input validation
- Error handling
- Security features (rate limiting, helmet, etc.)

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Class Validator for input validation
- Winston for logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd everfit-test
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/everfit
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Metrics

#### Create Metric
```http
POST /api/metrics
Content-Type: application/json

{
  "type": "distance",
  "value": 100,
  "unit": "m"
}
```

#### Get Metrics
```http
GET /api/metrics?page=1&limit=10&type=distance&startDate=2024-01-01&endDate=2024-12-31&unit=m
```

#### Get Chart Data
```http
GET /api/metrics/charts?interval=daily&type=distance&startDate=2024-01-01&endDate=2024-12-31&unit=m
```

### User Management

#### Get Current User
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Get All Users (Admin only)
```http
GET /api/users
Authorization: Bearer <token>
```

## Unit Conversion

The API supports automatic unit conversion for both distance and temperature measurements:

### Distance Units
- METER: m
- CENTIMETER: cm
- INCH: in
- FEET: ft
- YARD: yd

### Temperature Units
- CELSIUS: C
- FAHRENHEIT: F
- KELVIN: K

To convert units, simply specify the desired unit in the query parameter:
```http
GET /api/metrics?unit=m
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:
```json
{
  "message": "Error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the project
- `npm start`: Start production server

### Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── dto/           # Data Transfer Objects
├── middleware/    # Custom middleware
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
└── utils/         # Utility functions
```

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS enabled
- Helmet for security headers
- Input validation
- Role-based access control

## License

ISC