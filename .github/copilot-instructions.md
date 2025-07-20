<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# E-Cell Email Service - Copilot Instructions

This is a full-stack email service application for K.C. College of Engineering's E-Cell with the following architecture:

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Email Service**: Gmail API (Google OAuth2)
- **Image Storage**: Cloudinary
- **Deployment**: Netlify (Frontend + Functions), Railway/Render (Backend)

## Key Features

- Admin authentication with JWT
- User management (CRUD operations)
- Email template system with dynamic placeholders
- Rich HTML email composition
- Image upload and management via Cloudinary
- Email logging and analytics
- Responsive admin dashboard

## Project Structure

- `/frontend` - React TypeScript application
- `/backend` - Express.js API server
- `/netlify` - Serverless functions for deployment

## Development Guidelines

- Use TypeScript for type safety
- Follow React hooks patterns and functional components
- Implement proper error handling and validation
- Use environment variables for sensitive data
- Follow REST API conventions
- Implement proper authentication middleware
- Use MongoDB aggregation for analytics
- Optimize images through Cloudinary transformations

## Authentication Flow

- JWT-based authentication for admin users
- Protected routes on both frontend and backend
- Refresh token implementation for security

## Email Templates

- Support dynamic content with {{placeholder}} syntax
- HTML templates with embedded images
- Template preview functionality
- Batch email sending capabilities
