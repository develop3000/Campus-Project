# Event Management System API

A Node.js/Express backend API for managing events, handling user registrations, and managing RSVPs with secure authentication and image upload capabilities.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Overview
This system provides a complete backend solution for event management, featuring user authentication, event creation and management, RSVP handling, and image upload capabilities. Built with Node.js and PostgreSQL, it offers secure API endpoints for both admin and regular users.

## Features
- User authentication and authorization
- Event creation and management
- RSVP system
- Image upload for events
- Calendar view integration
- Role-based access control (Admin/User)
- Secure password handling
- PostgreSQL database integration

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Steps
# Clone repository
git clone [your-repository-url]

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Set up environment variables in .env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
PORT=4000
NODE_ENV=development

## Usage

### Starting the Server
# Development mode
npm run dev

# Production mode
npm start

### Default Admin Account
Email: admin@example.com
Password: admin123

## API Reference

### Authentication
# Register new user
POST /register
{
    "name": "string",
    "email": "string",
    "password": "string"
}

# Login
POST /login
{
    "email": "string",
    "password": "string"
}

# Logout
POST /logout

### Events
# Create event (Admin only)
POST /createEvent
{
    "title": "string",
    "description": "string",
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "location": "string",
    "organizer": "string",
    "category": "string",
    "image": File
}

# Get all events
GET /events

# Get specific event
GET /event/:id

# Delete event (Admin only)
DELETE /event/:id

### RSVPs
# Create/Update RSVP
POST /event/:id/rsvp
{
    "status": "ATTENDING" | "UNAVAILABLE"
}

# Get event RSVPs
GET /event/:id/rsvps

# Get user's RSVP for event
GET /event/:id/my-rsvp

## Configuration

### Environment Variables
DATABASE_URL - PostgreSQL connection string
PORT - Server port (default: 4000)
NODE_ENV - Environment (development/production)

### Database Schema
The system automatically creates three main tables:
- Users
- Events
- RSVPs

## Security Features
- JWT authentication
- Password hashing (bcrypt)
- Protected routes
- File upload validation
- CORS configuration
- HTTP-only cookies

## Error Handling
The API returns structured error responses:
{
    "error": "Error type",
    "details": "Detailed error message"
}

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support, please create an issue in the repository or contact [your-email].

## Acknowledgments
- Express.js
- PostgreSQL
- Node.js community
## update
- I fixed my backend issues
- I also made sure to correctly connect my backend to my frontend for smooth operations on the site.
- This is the link to my frontend: https://campus-project-front-end.onrender.com/ 
