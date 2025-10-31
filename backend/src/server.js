import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mgnregaRoutes from "./routes/mgnrega.routes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: "Too many requests",
    message: "Rate limit exceeded. Please try again later.",
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Request timing middleware
app.use((req, res, next) => {
  req.startTime = new Date();
  console.log(
    `📥 ${req.method} ${req.url} - ${req.ip} - ${new Date().toISOString()}`,
  );

  const originalSend = res.send;
  res.send = function (data) {
    const duration = new Date() - req.startTime;
    res.set("X-Response-Time", `${duration}ms`);
    console.log(
      `📤 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`,
    );
    originalSend.call(this, data);
  };

  next();
});

// MongoDB connection (optional, needed if caching API data)
const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/mgnrega-goa-dashboard";

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.log("⚠️ MongoDB connection error:", err.message);
    console.log("📄 Server will continue with CSV fallback data");
  }
};

// Connect to database
connectDB();

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const dbStatus =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: NODE_ENV,
      version: "1.0.0",
      services: {
        database: dbStatus,
        api: "healthy",
      },
    };

    res.json(healthStatus);
  } catch (error) {
    console.error("❌ Health check failed:", error.message);
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MGNREGA Goa Dashboard API Server",
    version: "1.0.0",
    documentation: {
      endpoints: {
        health: "/health",
        api: "/api",
        districts: "/api/districts",
        districtData: "/api/data/:district",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use(mgnregaRoutes);

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: {
      health: "/health",
      api: "/api",
      districts: "/api/districts",
      districtData: "/api/data/:district",
    },
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);

  const isDevelopment = NODE_ENV === "development";

  const errorResponse = {
    success: false,
    error: "Internal Server Error",
    message: isDevelopment ? err.message : "Something went wrong",
    timestamp: new Date().toISOString(),
  };

  if (isDevelopment) {
    errorResponse.stack = err.stack;
    errorResponse.details = {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
    };
  }

  res.status(err.status || 500).json(errorResponse);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`🛑 Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log("🔐 HTTP server closed");

    try {
      await mongoose.connection.close();
      console.log("🔐 MongoDB connection closed");
      console.log("✅ Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error("⏰ Forced shutdown after timeout");
    process.exit(1);
  }, 30000);
};

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  console.error("Shutting down server...");
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", err);
  console.error("Shutting down server...");
  server?.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Start server
const server = app.listen(PORT, () => {
  console.log("🎉 MGNREGA Goa Dashboard Server started successfully!");
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`💚 Health check available at http://localhost:${PORT}/health`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log("📝 Server logs will appear below...\n");

  if (NODE_ENV === "development") {
    console.log("🔧 Development mode - detailed logging enabled");
    console.log("📋 Available routes:");
    console.log("   GET  / - Server information");
    console.log("   GET  /health - Health check");
    console.log("   GET  /api - All MGNREGA data");
    console.log("   GET  /api/districts - List of districts");
    console.log("   GET  /api/data/:district - District-specific data");
    console.log("");
    console.log("🧪 Test the API:");
    console.log(`   curl http://localhost:${PORT}/api/districts`);
    console.log(`   curl http://localhost:${PORT}/api/data/North%20Goa`);
    console.log("");
  }
});

// Handle server errors
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error("❌ Server error:", error);
    process.exit(1);
  }
});

export default app;
