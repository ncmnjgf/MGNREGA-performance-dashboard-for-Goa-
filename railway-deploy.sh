#!/bin/bash

# Railway Deployment Helper Script for MGNREGA Goa Dashboard
# This script helps prepare and deploy the application to Railway

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════${NC}\n"
}

# Check if Railway CLI is installed
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found"
        print_info "Installing Railway CLI..."

        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install railway
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            curl -fsSL https://railway.app/install.sh | sh
        else
            print_error "Please install Railway CLI manually from https://docs.railway.app/develop/cli"
            exit 1
        fi
    else
        print_success "Railway CLI is installed"
    fi
}

# Check if Git is installed and repository is initialized
check_git() {
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi

    if [ ! -d .git ]; then
        print_warning "Git repository not initialized"
        print_info "Initializing Git repository..."
        git init
        print_success "Git repository initialized"
    else
        print_success "Git repository found"
    fi
}

# Check Node.js version
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
        exit 1
    fi

    print_success "Node.js $(node -v) detected"
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"

    print_info "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    print_success "Backend dependencies installed"

    print_info "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    print_success "Frontend dependencies installed"
}

# Test backend locally
test_backend() {
    print_header "Testing Backend Locally"

    print_info "Starting backend test..."
    cd backend

    # Create temporary .env if it doesn't exist
    if [ ! -f .env ]; then
        print_warning ".env file not found, creating temporary one..."
        cat > .env << EOL
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mgnrega-goa-dashboard
CORS_ORIGIN=http://localhost:3000
EOL
        print_success "Temporary .env created"
    fi

    # Start backend in background
    print_info "Starting backend server..."
    node src/server.js &
    BACKEND_PID=$!

    # Wait for backend to start
    sleep 5

    # Test health endpoint
    print_info "Testing health endpoint..."
    HEALTH_RESPONSE=$(curl -s http://localhost:5000/health || echo "failed")

    if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
        print_success "Backend is working correctly!"
    else
        print_warning "Backend health check returned unexpected response"
    fi

    # Kill backend process
    kill $BACKEND_PID 2>/dev/null || true

    cd ..
}

# Create .gitignore if it doesn't exist
create_gitignore() {
    if [ ! -f .gitignore ]; then
        print_info "Creating .gitignore..."
        cat > .gitignore << 'EOL'
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local
.env.production
.env.*.local

# Build outputs
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/

# Railway
.railway/
EOL
        print_success ".gitignore created"
    fi
}

# Commit changes
commit_changes() {
    print_header "Preparing Git Repository"

    create_gitignore

    git add .

    if git diff-index --quiet HEAD --; then
        print_info "No changes to commit"
    else
        print_info "Committing changes..."
        git commit -m "Prepare for Railway deployment" || print_warning "Nothing to commit"
        print_success "Changes committed"
    fi
}

# Deploy to Railway
deploy_to_railway() {
    print_header "Deploying to Railway"

    print_info "Logging in to Railway..."
    railway login

    print_info "Initializing Railway project..."
    railway init

    print_warning "\n⚠️  IMPORTANT: You need to set up TWO services in Railway:"
    print_info "1. Backend Service (root directory: /backend)"
    print_info "2. Frontend Service (root directory: /frontend)"
    print_info "\nPlease follow these steps in Railway dashboard:"
    echo ""
    echo "Backend Service:"
    echo "  - Root Directory: /backend"
    echo "  - Environment Variables:"
    echo "    NODE_ENV=production"
    echo "    MONGODB_URI=your_mongodb_connection_string"
    echo "    CORS_ORIGIN=https://your-frontend-url.railway.app"
    echo ""
    echo "Frontend Service:"
    echo "  - Root Directory: /frontend"
    echo "  - Environment Variables:"
    echo "    NODE_ENV=production"
    echo "    VITE_API_URL=https://your-backend-url.railway.app"
    echo ""

    read -p "Press Enter once you've set up the services in Railway dashboard..."

    print_success "Deployment initiated!"
    print_info "Monitor your deployment at: https://railway.app/dashboard"
}

# Print deployment checklist
print_checklist() {
    print_header "Post-Deployment Checklist"

    echo "✓ Check backend health endpoint: https://your-backend-url.railway.app/health"
    echo "✓ Verify frontend loads: https://your-frontend-url.railway.app"
    echo "✓ Test API connectivity from frontend"
    echo "✓ Test district selection and data loading"
    echo "✓ Verify charts render correctly"
    echo "✓ Test on mobile devices"
    echo ""
    echo "Environment Variables to Set:"
    echo ""
    echo "Backend:"
    echo "  - NODE_ENV=production"
    echo "  - MONGODB_URI=<your-mongodb-uri>"
    echo "  - CORS_ORIGIN=<frontend-url>"
    echo ""
    echo "Frontend:"
    echo "  - NODE_ENV=production"
    echo "  - VITE_API_URL=<backend-url>"
    echo ""
}

# Main menu
show_menu() {
    print_header "MGNREGA Goa Dashboard - Railway Deployment Helper"

    echo "Select an option:"
    echo "1) Full setup and deploy (recommended for first-time)"
    echo "2) Just install dependencies"
    echo "3) Test backend locally"
    echo "4) Commit changes to Git"
    echo "5) Deploy to Railway"
    echo "6) Show deployment checklist"
    echo "7) Exit"
    echo ""
    read -p "Enter your choice [1-7]: " choice

    case $choice in
        1)
            check_node
            check_git
            check_railway_cli
            install_dependencies
            test_backend
            commit_changes
            deploy_to_railway
            print_checklist
            ;;
        2)
            check_node
            install_dependencies
            ;;
        3)
            check_node
            test_backend
            ;;
        4)
            check_git
            commit_changes
            ;;
        5)
            check_railway_cli
            deploy_to_railway
            ;;
        6)
            print_checklist
            ;;
        7)
            print_success "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid option"
            show_menu
            ;;
    esac
}

# Run main menu
show_menu
