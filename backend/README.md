# MGNREGA Goa Dashboard - Backend API Server

A Node.js + Express backend server for the MGNREGA Goa Dashboard that fetches data from data.gov.in APIs with CSV fallback and MongoDB caching.

## 🚀 Quick Start

```bash
# Clone and setup
cd goa/backend

# Run automated setup
node setup.js

# Start development server
npm run dev

# Test the API
curl http://localhost:5000/api/districts
```

## ✨ Features

- **3 Main API Routes**: `/api`, `/api/districts`, `/api/data/:district`
- **Multiple Data Sources**: data.gov.in API → CSV fallback → MongoDB cache
- **Smart Fallbacks**: Always returns data even if API is unavailable
- **ES6 Modules**: Modern JavaScript with import/export
- **CSV Data Included**: Sample MGNREGA data for Goa districts
- **MongoDB Caching**: Optional caching for improved performance
- **Error Handling**: Comprehensive error handling and logging
- **Rate Limiting**: Built-in API protection
- **Security**: CORS, Helmet, and other security middleware

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (optional - server works without it)

### Setup Steps

1. **Quick Setup (Recommended)**
   ```bash
   node setup.js
   ```

2. **Manual Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Start server
   npm run dev
   ```

## 📊 API Endpoints

### Core Routes

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| GET | `/api` | All MGNREGA data for all districts | `curl http://localhost:5000/api` |
| GET | `/api/districts` | List of districts in Goa | `curl http://localhost:5000/api/districts` |
| GET | `/api/data/:district` | Data for specific district | `curl "http://localhost:5000/api/data/North%20Goa"` |

### Additional Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/` | Server information |

## 📁 Project Structure

```
src/
├── controllers/
│   └── mgnrega.controller.js    # API logic with fallbacks
├── models/
│   └── DistrictData.js         # MongoDB schema
├── routes/
│   └── mgnrega.routes.js       # Route definitions
├── data/
│   └── goa_mgnrega.csv         # Sample data
└── server.js                   # Main application
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB (Optional)
MONGODB_URI=mongodb://localhost:27017/mgnrega-goa-dashboard

# data.gov.in API (Optional)
API_KEY=your_api_key_here
RESOURCE_ID=your_resource_id_here

# Security
CORS_ORIGIN=http://localhost:3000
```

### Data Sources Priority

1. **data.gov.in API** (if API_KEY and RESOURCE_ID configured)
2. **CSV Fallback** (included sample data)
3. **MongoDB Cache** (if MongoDB is available)
4. **Mock Data** (as last resort)

## 🧪 Testing

### Automated Tests
```bash
# Run comprehensive API tests
node test.js

# Setup and test
node setup.js --test
```

### Manual Testing
```bash
# Health check
curl http://localhost:5000/health

# Get all districts
curl http://localhost:5000/api/districts

# Get North Goa data
curl "http://localhost:5000/api/data/North%20Goa"

# Get South Goa data  
curl "http://localhost:5000/api/data/South%20Goa"

# Get all data
curl http://localhost:5000/api
```

## 📋 Sample API Responses

### Districts List (`/api/districts`)
```json
{
  "success": true,
  "source": "CSV",
  "count": 2,
  "districts": ["North Goa", "South Goa"],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### District Data (`/api/data/North%20Goa`)
```json
{
  "success": true,
  "source": "CSV",
  "district": "North Goa",
  "count": 36,
  "data": [
    {
      "district": "North Goa",
      "month": 1,
      "year": 2024,
      "person_days": 12500,
      "households": 850,
      "funds_spent": 2500000,
      "scheme_name": "MGNREGA",
      "block_name": "Pernem",
      "panchayat_name": "Arambol"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🗄️ MongoDB Schema

```javascript
const districtDataSchema = new mongoose.Schema({
  district: { type: String, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  person_days: { type: Number, default: 0 },
  households: { type: Number, default: 0 },
  funds_spent: { type: Number, default: 0 },
  raw: { type: Object }, // store original API response
  fetched_at: { type: Date, default: Date.now }
});
```

## 🔌 External API Integration

### data.gov.in Setup (Optional)

1. **Get API Key**
   - Visit [data.gov.in](https://data.gov.in/)
   - Register for an account
   - Get API key from dashboard

2. **Find MGNREGA Dataset**
   - Search for "MGNREGA" datasets
   - Copy the resource ID from dataset URL

3. **Update .env**
   ```env
   API_KEY=your_actual_api_key
   RESOURCE_ID=your_actual_resource_id
   ```

4. **API URL Format**
   ```
   https://api.data.gov.in/resource/{RESOURCE_ID}?api-key={API_KEY}&format=json&filters[state]=Goa
   ```

## 🚢 Deployment

### Docker (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t mgnrega-backend .
docker run -p 5000:5000 mgnrega-backend
```

### Traditional Deployment
```bash
# Install dependencies
npm ci --only=production

# Set environment
export NODE_ENV=production
export PORT=5000
export MONGODB_URI=your_production_mongo_uri

# Start server
npm start
```

## 🔍 Development

### Available Scripts
```bash
npm run dev     # Development with auto-reload
npm start       # Production server
npm test        # Run tests (use node test.js)
```

### Development Workflow
1. Make changes to source files
2. Server auto-reloads (if using `npm run dev`)
3. Test endpoints manually or with `node test.js`
4. Check logs for errors

### Adding New Routes
1. Add route in `src/routes/mgnrega.routes.js`
2. Add controller function in `src/controllers/mgnrega.controller.js`
3. Test the new endpoint

## 🛡️ Security Features

- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Parameter validation
- **Error Handling**: No sensitive data in error responses

## 📈 Performance

- **Caching**: MongoDB caching for API responses
- **Fallbacks**: Multiple data sources for reliability
- **Response Times**: Typical response under 100ms for cached data
- **Rate Limiting**: Prevents API abuse

## 🔧 Troubleshooting

### Common Issues

1. **Port 5000 in use**
   ```bash
   # Change port in .env
   PORT=5001
   ```

2. **MongoDB connection failed**
   ```bash
   # Start MongoDB
   # Windows: net start MongoDB
   # macOS/Linux: sudo systemctl start mongod
   # Docker: docker run -d -p 27017:27017 mongo
   ```

3. **CSV file not found**
   ```bash
   # Ensure file exists
   ls src/data/goa_mgnrega.csv
   ```

4. **Module import errors**
   ```bash
   # Verify package.json has "type": "module"
   # Use .js extensions in imports
   ```

### Debug Mode
```bash
NODE_ENV=development npm run dev
```

### Health Check
```bash
curl http://localhost:5000/health
```

## 📚 API Documentation

### Error Responses
All errors follow this format:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Response Headers
- `X-Response-Time`: Response time in milliseconds
- `Content-Type`: `application/json`

### Query Parameters
- `refresh=true`: Force refresh cache (where applicable)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Issues**: Create GitHub issue
- **Setup Help**: Run `node setup.js --help`
- **API Testing**: Use `node test.js`

---

**🎯 Ready to start?** Run `node setup.js` and follow the instructions!