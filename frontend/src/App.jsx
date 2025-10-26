import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import the simple API hooks
import { useHealthCheck } from "./hooks/useApi";

// Basic app component
function App() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { health, check: checkHealth } = useHealthCheck();

  useEffect(() => {
    const initApp = async () => {
      try {
        console.log("🚀 Starting App initialization...");

        // Optional health check
        try {
          if (checkHealth) {
            await checkHealth();
          }
        } catch (healthError) {
          console.warn("⚠️ Health check failed, continuing:", healthError);
        }

        setLoading(false);
        console.log("✅ App initialized successfully");
      } catch (err) {
        console.error("❌ App initialization failed:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    initApp();
  }, [checkHealth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading MGNREGA Goa Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">App Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-green-600">
                  MGNREGA Goa
                </div>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a
                  href="/"
                  className="text-gray-900 hover:text-green-600 px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="/about"
                  className="text-gray-500 hover:text-green-600 px-3 py-2 text-sm font-medium"
                >
                  About
                </a>
                <a
                  href="/help"
                  className="text-gray-500 hover:text-green-600 px-3 py-2 text-sm font-medium"
                >
                  Help
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<SimpleDashboard />} />
            <Route path="/about" element={<SimpleAbout />} />
            <Route path="/help" element={<SimpleHelp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Simple dashboard component for testing
function SimpleDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          MGNREGA Goa Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Rural employment data and insights for Goa state
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">
            Total Person Days
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">1,24,567</div>
          <div className="mt-2 text-sm text-green-600">
            +12% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">
            Households Benefited
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">8,456</div>
          <div className="mt-2 text-sm text-green-600">+8% from last month</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Funds Spent</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">₹45.2L</div>
          <div className="mt-2 text-sm text-green-600">
            +15% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">
            Completion Rate
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">89%</div>
          <div className="mt-2 text-sm text-green-600">+3% from last month</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          District Overview
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="font-medium">North Goa</span>
            <span className="text-green-600 font-semibold">₹24.1L</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="font-medium">South Goa</span>
            <span className="text-green-600 font-semibold">₹21.1L</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleAbout() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        About MGNREGA Goa
      </h1>
      <div className="bg-white p-8 rounded-lg shadow">
        <p className="text-gray-600 mb-4">
          The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)
          is one of the largest work guarantee programs in the world. This
          dashboard provides insights into MGNREGA implementation in Goa state.
        </p>
        <p className="text-gray-600">
          Our mission is to make rural employment data accessible and
          transparent for all stakeholders including citizens, researchers, and
          policymakers.
        </p>
      </div>
    </div>
  );
}

function SimpleHelp() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Help & Support</h1>
      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Getting Started
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
          <li>Navigate through different sections using the menu</li>
          <li>View employment data by district</li>
          <li>Export data for further analysis</li>
          <li>Access historical trends and comparisons</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-600">
          For technical support or data inquiries, please contact us at:{" "}
          <a
            href="mailto:support@mgnrega-goa.gov.in"
            className="text-green-600 hover:underline"
          >
            support@mgnrega-goa.gov.in
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
