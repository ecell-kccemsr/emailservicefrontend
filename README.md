# E-Cell Email Service - K.C. College of Engineering

A comprehensive email management system for the Entrepreneurship Cell (E-Cell) of K.C. College of Engineering. This application provides a complete solution for managing users, creating email templates, and sending bulk emails with analytics.

## 🚀 Features

### Authentication & Security

- JWT-based admin authentication
- Role-based access control (Admin/Super Admin)
- Secure password hashing with bcrypt
- Protected API routes with middleware

### User Management

- Complete CRUD operations for users
- Bulk operations (subscribe/unsubscribe, tag management, delete)
- Advanced filtering and search capabilities
- User statistics and analytics
- Import/export functionality
- Department and year-wise categorization

### Email Template System

- Rich HTML email templates with WYSIWYG editor
- Dynamic placeholder support ({{name}}, {{event_link}}, etc.)
- Template preview functionality
- Image management with Cloudinary integration
- Template cloning and versioning
- Usage analytics per template

### Email Campaigns

- Single and bulk email sending
- Gmail API integration for reliable delivery
- Campaign management and tracking
- Automatic unsubscribe handling
- Email scheduling and queuing
- Delivery status tracking

### Analytics & Reporting

- Comprehensive email analytics
- Campaign performance metrics
- User engagement tracking
- Success/failure rates
- Detailed email logs
- Export reports to CSV

### Image Management

- Cloudinary integration for image hosting
- Image optimization and transformation
- Template image gallery
- Drag-and-drop image uploads

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for HTTP requests
- **React Hook Form** for form management
- **Lucide React** for icons

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Gmail API** for email delivery
- **Cloudinary** for image management
- **Rate limiting** and security middleware

### Deployment

- **Frontend**: Netlify
- **Backend**: Railway/Render with Netlify Functions
- **Database**: MongoDB Atlas
- **Images**: Cloudinary CDN

## 📁 Project Structure

```
emailservice/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── package.json
├── backend/                 # Node.js Express API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── services/           # Business logic services
│   ├── server.js          # Main server file
│   └── package.json
├── netlify/                # Serverless functions
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Gmail account with API access
- Cloudinary account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd emailservice
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Environment Configuration

#### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecell-email-service
JWT_SECRET=your-super-secret-jwt-key
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token
GMAIL_USER=your-email@gmail.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Gmail API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API
4. Create credentials (OAuth 2.0 Client ID)
5. Use [OAuth Playground](https://developers.google.com/oauthplayground) to get refresh token

### Running the Application

1. **Start Backend**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**

   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Initial Admin Setup

Create the first admin user by sending a POST request to `/api/auth/register`:

```bash
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@kccoe.edu.in",
    "password": "yourpassword",
    "name": "Admin Name",
    "role": "super_admin"
  }'
```

## 📖 API Documentation

### Authentication

- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register new admin
- `GET /api/auth/me` - Get current admin profile
- `PUT /api/auth/change-password` - Change password

### Users

- `GET /api/users` - Get users with pagination and filters
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/bulk` - Bulk operations
- `GET /api/users/stats/overview` - User statistics

### Templates

- `GET /api/templates` - Get templates
- `POST /api/templates` - Create template
- `GET /api/templates/:id` - Get template by ID
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template
- `POST /api/templates/:id/clone` - Clone template
- `POST /api/templates/:id/preview` - Preview template

### Emails

- `POST /api/emails/send` - Send single email
- `POST /api/emails/send-bulk` - Send bulk emails
- `GET /api/emails/logs` - Get email logs
- `GET /api/emails/stats` - Get email statistics
- `GET /api/emails/test-connection` - Test email connection

## 🔒 Security Features

- **Input Validation**: Comprehensive validation on all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured CORS policies
- **Helmet Security**: Security headers with Helmet.js
- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Security**: Secure token generation and validation
- **Environment Variables**: Sensitive data in environment variables

## 🚀 Deployment

### Frontend (Netlify)

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

### Backend (Railway/Render)

1. Connect your GitHub repository
2. Set start command: `npm start`
3. Add environment variables
4. Configure MongoDB Atlas connection

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Configure network access and database users
3. Get connection string and add to environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support and questions:

- Email: ecell@kccoe.edu.in
- GitHub Issues: Create an issue in this repository

## 🙏 Acknowledgments

- K.C. College of Engineering E-Cell team
- Gmail API documentation
- MongoDB and Mongoose communities
- React and Node.js communities
- All open-source contributors

---

**Made with ❤️ for E-Cell, K.C. College of Engineering**
