#!/bin/bash

# E-Cell Email Service Setup Script

echo "🚀 E-Cell Email Service Setup"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -c 2-)
REQUIRED_VERSION="18.0.0"

if [[ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install v18 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION is compatible"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup backend
echo "🔧 Setting up backend..."
cd backend

if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration before running the app"
fi

echo "📦 Installing backend dependencies..."
npm install

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
fi

echo "📦 Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure your environment variables:"
echo "   - Edit backend/.env with your MongoDB, Gmail API, and Cloudinary settings"
echo "   - Edit frontend/.env if needed"
echo ""
echo "2. Start MongoDB (if running locally)"
echo ""
echo "3. Seed the database with sample data:"
echo "   cd backend && npm run seed"
echo ""
echo "4. Start the development servers:"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "🔐 Default Admin Credentials:"
echo "   Email: admin@kccoe.edu.in"
echo "   Password: ECell@123"
echo ""
echo "📚 Check README.md for detailed setup instructions"
echo "🚀 Check DEPLOYMENT.md for production deployment guide"
