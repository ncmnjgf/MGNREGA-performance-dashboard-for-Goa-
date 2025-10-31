#!/bin/bash

# MGNREGA Goa Dashboard - Production Deployment Script
# This script automates the deployment process for production environments

set -e  # Exit on error

echo "🚀 Starting MGNREGA Goa Dashboard Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    print_success "Node.js found"

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm found"

    if ! command -v docker &> /dev/null; then
        print_warning "Docker not found (optional)"
    else
        print_success "Docker found"
    fi
}

# Install dependencies
install_dependencies() {
    echo ""
    echo "📦 Installing dependencies..."

    # Backend
    echo "Installing backend dependencies..."
    cd backend
    npm ci --only=production
    cd ..
    print_success "Backend dependencies installed"

    # Frontend
    echo "Installing frontend dependencies..."
    cd frontend
    npm ci
    cd ..
    print_success "Frontend dependencies installed"
}

# Build frontend
build_frontend() {
    echo ""
    echo "🔨 Building frontend..."
    cd frontend
    npm run build
    cd ..
    print_success "Frontend built successfully"
}

# Run tests
run_tests() {
    echo ""
    echo "🧪 Running tests..."

    # Backend health check
    cd backend
    if npm test &> /dev/null; then
        print_success "Backend tests passed"
    else
        print_warning "Backend tests skipped or failed"
    fi
    cd ..
}

# Create production directories
create_directories() {
    echo ""
    echo "📁 Creating necessary directories..."

    mkdir -p backend/logs
    mkdir -p backend/src/data

    print_success "Directories created"
}

# Check environment files
check_env_files() {
    echo ""
    echo "🔐 Checking environment files..."

    if [ ! -f "backend/.env.production" ]; then
        print_warning "backend/.env.production not found"
        echo "Creating from example..."
        cp backend/.env.production backend/.env.production || true
    else
        print_success "Backend .env.production found"
    fi

    if [ ! -f "frontend/.env.production" ]; then
        print_warning "frontend/.env.production not found"
        echo "Creating from example..."
        cp frontend/.env.production frontend/.env.production || true
    else
        print_success "Frontend .env.production found"
    fi
}

# Docker deployment
deploy_with_docker() {
    echo ""
    echo "🐳 Deploying with Docker..."

    if command -v docker-compose &> /dev/null; then
        docker-compose down
        docker-compose build
        docker-compose up -d
        print_success "Docker containers started"

        # Wait for services to be ready
        echo "Waiting for services to start..."
        sleep 10

        # Check backend health
        if curl -f http://localhost:5000/health &> /dev/null; then
            print_success "Backend is healthy"
        else
            print_warning "Backend health check failed"
        fi

    else
        print_error "docker-compose not found"
        exit 1
    fi
}

# Manual deployment
deploy_manual() {
    echo ""
    echo "📦 Starting manual deployment..."

    # Start backend
    echo "Starting backend..."
    cd backend
    NODE_ENV=production npm start &
    BACKEND_PID=$!
    cd ..
    print_success "Backend started (PID: $BACKEND_PID)"

    # Serve frontend
    echo "Starting frontend..."
    cd frontend/dist
    if command -v python3 &> /dev/null; then
        python3 -m http.server 3000 &
        FRONTEND_PID=$!
        print_success "Frontend started (PID: $FRONTEND_PID)"
    elif command -v python &> /dev/null; then
        python -m SimpleHTTPServer 3000 &
        FRONTEND_PID=$!
        print_success "Frontend started (PID: $FRONTEND_PID)"
    else
        print_warning "Python not found, install http-server: npm install -g http-server"
    fi
    cd ../..

    # Save PIDs
    echo $BACKEND_PID > backend.pid
    echo $FRONTEND_PID > frontend.pid

    echo ""
    print_success "Deployment complete!"
    echo "Backend: http://localhost:5000"
    echo "Frontend: http://localhost:3000"
    echo ""
    echo "To stop services, run: ./stop.sh"
}

# Verify deployment
verify_deployment() {
    echo ""
    echo "✅ Verifying deployment..."

    # Check backend
    if curl -f http://localhost:5000/health &> /dev/null; then
        print_success "Backend is responding"
    else
        print_error "Backend is not responding"
    fi

    # Check frontend
    if curl -f http://localhost:3000 &> /dev/null; then
        print_success "Frontend is responding"
    else
        print_warning "Frontend is not responding"
    fi
}

# Main deployment flow
main() {
    echo "╔════════════════════════════════════════════╗"
    echo "║  MGNREGA Goa Dashboard Deployment         ║"
    echo "║  Production Ready                          ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""

    # Ask deployment type
    echo "Select deployment type:"
    echo "1) Docker (Recommended)"
    echo "2) Manual"
    echo ""
    read -p "Enter choice (1 or 2): " choice

    check_requirements
    check_env_files
    create_directories
    install_dependencies
    build_frontend

    case $choice in
        1)
            deploy_with_docker
            verify_deployment
            ;;
        2)
            deploy_manual
            verify_deployment
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac

    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║  Deployment Complete! 🎉                   ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    echo "📝 Next steps:"
    echo "1. Configure environment variables"
    echo "2. Set up domain and SSL"
    echo "3. Configure CDN (optional)"
    echo "4. Set up monitoring"
    echo ""
    echo "🌐 Access your dashboard:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5000"
    echo ""
    echo "📚 Documentation: README.md"
    echo ""
}

# Run main function
main
