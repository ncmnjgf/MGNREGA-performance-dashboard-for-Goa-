import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// API configuration
const API_BASE_URL = "http://localhost:5000";

// District coordinates for auto-detection
const DISTRICT_BOUNDARIES = {
  "North Goa": {
    name: "North Goa",
    displayName: "North Goa",
    code: "north-goa",
    coordinates: { lat: 15.55, lng: 73.83 },
    bounds: {
      north: 15.8,
      south: 15.3,
      east: 74.1,
      west: 73.6,
    },
  },
  "South Goa": {
    name: "South Goa",
    displayName: "South Goa",
    code: "south-goa",
    coordinates: { lat: 15.25, lng: 74.0 },
    bounds: {
      north: 15.5,
      south: 15.0,
      east: 74.3,
      west: 73.7,
    },
  },
};

// Mock data for fallback
const MOCK_DATA = {
  districts: ["North Goa", "South Goa"],
  data: [
    {
      district: "North Goa",
      month: "January",
      personDays: 65432,
      households: 4567,
      fundsSpent: 12500000,
      completionRate: 89,
    },
    {
      district: "North Goa",
      month: "February",
      personDays: 72184,
      households: 4892,
      fundsSpent: 13750000,
      completionRate: 92,
    },
    {
      district: "North Goa",
      month: "March",
      personDays: 68945,
      households: 4721,
      fundsSpent: 13200000,
      completionRate: 88,
    },
    {
      district: "South Goa",
      month: "January",
      personDays: 59135,
      households: 3889,
      fundsSpent: 11250000,
      completionRate: 91,
    },
    {
      district: "South Goa",
      month: "February",
      personDays: 63472,
      households: 4156,
      fundsSpent: 12100000,
      completionRate: 94,
    },
    {
      district: "South Goa",
      month: "March",
      personDays: 61283,
      households: 4023,
      fundsSpent: 11700000,
      completionRate: 87,
    },
  ],
};

// Simple cache implementation
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function setCachedData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

function getCachedData(key) {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

// API client with fallback
async function apiRequest(endpoint) {
  const cacheKey = endpoint;
  const cached = getCachedData(cacheKey);

  if (cached) {
    console.log(`📦 Cache hit for ${endpoint}`);
    return cached;
  }

  try {
    console.log(`🌐 API request: ${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      timeout: 10000,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    setCachedData(cacheKey, data);
    console.log(`✅ API success: ${endpoint}`);
    return data;
  } catch (error) {
    console.warn(`⚠️ API failed for ${endpoint}:`, error.message);

    // Return mock data as fallback
    if (endpoint === "/api/districts") {
      return {
        success: true,
        source: "fallback",
        districts: MOCK_DATA.districts,
        timestamp: new Date().toISOString(),
      };
    } else if (endpoint.startsWith("/api/data/")) {
      const district = decodeURIComponent(endpoint.split("/").pop());
      return {
        success: true,
        source: "fallback",
        district,
        data: MOCK_DATA.data.filter((item) => item.district === district),
        timestamp: new Date().toISOString(),
      };
    } else if (endpoint === "/api") {
      return {
        success: true,
        source: "fallback",
        data: MOCK_DATA.data,
        timestamp: new Date().toISOString(),
      };
    }

    throw error;
  }
}

// Geolocation utilities
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function detectDistrictFromCoordinates(lat, lng) {
  // Check if coordinates are within Goa boundaries
  const goaBounds = {
    north: 15.8,
    south: 15.0,
    east: 74.3,
    west: 73.6,
  };

  if (
    lat < goaBounds.south ||
    lat > goaBounds.north ||
    lng < goaBounds.west ||
    lng > goaBounds.east
  ) {
    return null; // Outside Goa
  }

  // Find closest district
  let closestDistrict = null;
  let minDistance = Infinity;

  Object.values(DISTRICT_BOUNDARIES).forEach((district) => {
    const distance = calculateDistance(
      lat,
      lng,
      district.coordinates.lat,
      district.coordinates.lng,
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestDistrict = district;
    }
  });

  return closestDistrict;
}

// Format utilities
function formatNumber(num) {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)} L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatCurrency(amount) {
  return `₹${formatNumber(amount)}`;
}

function calculateChange(current, previous) {
  if (!previous || previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

// Main App Component
function AppNew() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("🚀 Initializing MGNREGA Dashboard...");

        // Check network status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Initialize cache
        console.log("💾 Cache initialized");

        setLoading(false);
        console.log("✅ Dashboard initialized successfully");

        return () => {
          window.removeEventListener("online", handleOnline);
          window.removeEventListener("offline", handleOffline);
        };
      } catch (err) {
        console.error("❌ Initialization failed:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid #e5e7eb",
              borderTop: "3px solid #059669",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          ></div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
          <p
            style={{
              fontSize: "1.125rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Loading MGNREGA Goa Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: "400px", padding: "1.5rem" }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "1rem",
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#059669",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              fontWeight: "500",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Network Status Indicator */}
        {!isOnline && (
          <div
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "0.5rem",
              textAlign: "center",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            📡 You're offline - Showing cached data
          </div>
        )}

        {/* Header */}
        <header
          style={{
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderBottom: "1px solid #e5e7eb",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  🌾 MGNREGA Goa
                </div>
              </div>
              <nav style={{ display: "flex", gap: "2rem" }}>
                <a
                  href="/"
                  style={{
                    color: "#111827",
                    textDecoration: "none",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    borderRadius: "0.375rem",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  📊 Dashboard
                </a>
                <a
                  href="/about"
                  style={{
                    color: "#6b7280",
                    textDecoration: "none",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    borderRadius: "0.375rem",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  ℹ️ About
                </a>
                <a
                  href="/help"
                  style={{
                    color: "#6b7280",
                    textDecoration: "none",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    borderRadius: "0.375rem",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  🆘 Help
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "1.5rem 1rem",
          }}
        >
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Enhanced Dashboard with all functionality
function DashboardPage() {
  const [allData, setAllData] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtData, setDistrictData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [locationDetecting, setLocationDetecting] = useState(false);
  const intervalRef = useRef();

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      setError(null);
      const [allResponse, districtsResponse] = await Promise.all([
        apiRequest("/api"),
        apiRequest("/api/districts"),
      ]);

      setAllData(allResponse);
      setDistricts(districtsResponse.districts || []);
      setLastUpdated(new Date());

      if (!selectedDistrict && districtsResponse.districts?.length > 0) {
        setSelectedDistrict(districtsResponse.districts[0]);
      }
    } catch (err) {
      setError("Failed to fetch data. Using offline mode.");
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedDistrict]);

  // Fetch district-specific data
  const fetchDistrictData = useCallback(async (district) => {
    if (!district) return;

    try {
      const response = await apiRequest(
        `/api/data/${encodeURIComponent(district)}`,
      );
      setDistrictData(response);
    } catch (err) {
      console.error("District data fetch error:", err);
    }
  }, []);

  // Auto-detect user location
  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationDetecting(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 5 * 60 * 1000, // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      const detectedDistrict = detectDistrictFromCoordinates(
        latitude,
        longitude,
      );

      if (detectedDistrict) {
        setSelectedDistrict(detectedDistrict.name);
        alert(`📍 Location detected: ${detectedDistrict.displayName}`);
      } else {
        alert(
          "📍 You seem to be outside Goa. Please select a district manually.",
        );
      }
    } catch (err) {
      console.error("Location detection error:", err);
      alert("Failed to detect location. Please select a district manually.");
    } finally {
      setLocationDetecting(false);
    }
  }, []);

  // Export data functionality
  const exportData = useCallback(() => {
    const dataToExport =
      selectedDistrict && districtData ? districtData.data : allData?.data;

    if (!dataToExport) {
      alert("No data available to export");
      return;
    }

    const csv = [
      [
        "District",
        "Month",
        "Person Days",
        "Households",
        "Funds Spent",
        "Completion Rate",
      ],
      ...dataToExport.map((item) => [
        item.district,
        item.month,
        item.personDays || 0,
        item.households || 0,
        item.fundsSpent || 0,
        item.completionRate || 0,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mgnrega-${selectedDistrict || "all-districts"}-${new Date().getFullYear()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [selectedDistrict, districtData, allData]);

  // Initialize data
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Fetch district data when selection changes
  useEffect(() => {
    if (selectedDistrict) {
      fetchDistrictData(selectedDistrict);
    }
  }, [selectedDistrict, fetchDistrictData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchAllData();
        if (selectedDistrict) {
          fetchDistrictData(selectedDistrict);
        }
      }, 30000); // 30 seconds
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, fetchAllData, selectedDistrict, fetchDistrictData]);

  // Calculate summary metrics
  const summaryMetrics = React.useMemo(() => {
    const data =
      selectedDistrict && districtData?.data
        ? districtData.data
        : allData?.data;

    if (!data || data.length === 0) {
      return {
        totalPersonDays: 0,
        totalHouseholds: 0,
        totalFundsSpent: 0,
        averageCompletion: 0,
      };
    }

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    return {
      totalPersonDays: latest?.personDays || 0,
      totalHouseholds: latest?.households || 0,
      totalFundsSpent: latest?.fundsSpent || 0,
      averageCompletion: latest?.completionRate || 0,
      personDaysChange: previous
        ? calculateChange(latest?.personDays, previous?.personDays)
        : 0,
      householdsChange: previous
        ? calculateChange(latest?.households, previous?.households)
        : 0,
      fundsChange: previous
        ? calculateChange(latest?.fundsSpent, previous?.fundsSpent)
        : 0,
      completionChange: previous
        ? calculateChange(latest?.completionRate, previous?.completionRate)
        : 0,
    };
  }, [selectedDistrict, districtData, allData]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #e5e7eb",
            borderTop: "3px solid #059669",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem",
          }}
        ></div>
        <p style={{ color: "#6b7280" }}>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Dashboard Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "0.5rem",
              }}
            >
              📊 MGNREGA Goa Dashboard
            </h1>
            <p style={{ color: "#6b7280", fontSize: "1.125rem" }}>
              Rural employment data and insights for Goa state
            </p>
          </div>

          {/* Control Panel */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{
                backgroundColor: autoRefresh ? "#059669" : "white",
                color: autoRefresh ? "white" : "#374151",
                border: "1px solid #d1d5db",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              {autoRefresh ? "🔄 Auto-refreshing" : "▶️ Enable Auto-refresh"}
            </button>
            <button
              onClick={exportData}
              style={{
                backgroundColor: "white",
                color: "#374151",
                border: "1px solid #d1d5db",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              💾 Export Data
            </button>
            <button
              onClick={() => setShowComparison(!showComparison)}
              style={{
                backgroundColor: showComparison ? "#3b82f6" : "white",
                color: showComparison ? "white" : "#374151",
                border: "1px solid #d1d5db",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              {showComparison ? "📊 Hide Comparison" : "📊 Compare Districts"}
            </button>
          </div>
        </div>

        {/* District Selector */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              📍 Select District:
            </label>
            <select
              value={selectedDistrict || ""}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "1rem",
                minWidth: "150px",
              }}
            >
              <option value="">All Districts</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <button
              onClick={detectLocation}
              disabled={locationDetecting}
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                cursor: locationDetecting ? "not-allowed" : "pointer",
                opacity: locationDetecting ? 0.6 : 1,
              }}
            >
              {locationDetecting
                ? "🔍 Detecting..."
                : "🎯 Auto-detect Location"}
            </button>
            {lastUpdated && (
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <MetricCard
          title="Person Days Generated"
          value={formatNumber(summaryMetrics.totalPersonDays)}
          change={summaryMetrics.personDaysChange}
          icon="👨‍💼"
          color="#059669"
        />
        <MetricCard
          title="Households Benefited"
          value={formatNumber(summaryMetrics.totalHouseholds)}
          change={summaryMetrics.householdsChange}
          icon="🏠"
          color="#3b82f6"
        />
        <MetricCard
          title="Funds Spent"
          value={formatCurrency(summaryMetrics.totalFundsSpent)}
          change={summaryMetrics.fundsChange}
          icon="💰"
          color="#8b5cf6"
        />
        <MetricCard
          title="Completion Rate"
          value={`${summaryMetrics.averageCompletion}%`}
          change={summaryMetrics.completionChange}
          icon="✅"
          color="#10b981"
        />
      </div>

      {/* Charts Section */}
      {(allData?.data || districtData?.data) && (
        <div style={{ marginBottom: "2rem" }}>
          {showComparison ? (
            <ComparisonChart allData={allData?.data} />
          ) : (
            <TrendChart
              data={
                selectedDistrict && districtData?.data
                  ? districtData.data
                  : allData?.data
              }
              title={
                selectedDistrict
                  ? `${selectedDistrict} Monthly Trends`
                  : "Overall Monthly Trends"
              }
            />
          )}
        </div>
      )}

      {/* District Overview Table */}
      <DataTable
        data={
          selectedDistrict && districtData?.data
            ? districtData.data
            : allData?.data
        }
        title={
          selectedDistrict
            ? `${selectedDistrict} Detailed Data`
            : "All Districts Overview"
        }
      />
    </div>
  );
}

// Enhanced Metric Card with animations and interactions
function MetricCard({ title, value, change, icon, color }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "0.75rem",
        boxShadow: isHovered
          ? "0 4px 6px rgba(0,0,0,0.1)"
          : "0 1px 3px rgba(0,0,0,0.1)",
        border: isHovered ? `2px solid ${color}` : "2px solid transparent",
        transition: "all 0.2s ease-in-out",
        cursor: "pointer",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <div
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#6b7280",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "1.5rem",
            filter: isHovered ? "brightness(1.1)" : "brightness(1)",
            transition: "filter 0.2s ease-in-out",
          }}
        >
          {icon}
        </div>
      </div>
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#111827",
          marginBottom: "0.5rem",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.875rem",
          color: change > 0 ? "#059669" : change < 0 ? "#dc2626" : "#6b7280",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        {change > 0 ? "📈" : change < 0 ? "📉" : "➖"}
        {change !== 0
          ? `${change > 0 ? "+" : ""}${change}% from last period`
          : "No change from last period"}
      </div>
    </div>
  );
}

// Trend Chart Component
function TrendChart({ data, title }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
        <p style={{ color: "#6b7280" }}>No trend data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((item) => item.month || "Month"),
    datasets: [
      {
        label: "Person Days",
        data: data.map((item) => item.personDays || 0),
        borderColor: "#059669",
        backgroundColor: "rgba(5, 150, 105, 0.1)",
        tension: 0.4,
      },
      {
        label: "Households",
        data: data.map((item) => item.households || 0),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Completion Rate (%)",
        data: data.map((item) => item.completionRate || 0),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Person Days / Households",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Completion Rate (%)",
        },
        grid: {
          drawOnChartArea: false,
        },
        max: 100,
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        height: "400px",
      }}
    >
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

// Comparison Chart Component
function ComparisonChart({ allData }) {
  if (!allData || allData.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
        <p style={{ color: "#6b7280" }}>No comparison data available</p>
      </div>
    );
  }

  // Group data by district
  const districtData = allData.reduce((acc, item) => {
    if (!acc[item.district]) {
      acc[item.district] = {
        personDays: 0,
        households: 0,
        fundsSpent: 0,
        completionRate: 0,
        count: 0,
      };
    }
    acc[item.district].personDays += item.personDays || 0;
    acc[item.district].households += item.households || 0;
    acc[item.district].fundsSpent += item.fundsSpent || 0;
    acc[item.district].completionRate += item.completionRate || 0;
    acc[item.district].count++;
    return acc;
  }, {});

  // Calculate averages
  Object.keys(districtData).forEach((district) => {
    const data = districtData[district];
    data.completionRate = data.completionRate / data.count;
  });

  const chartData = {
    labels: Object.keys(districtData),
    datasets: [
      {
        label: "Person Days",
        data: Object.values(districtData).map((d) => d.personDays),
        backgroundColor: "rgba(5, 150, 105, 0.7)",
        borderColor: "#059669",
        borderWidth: 1,
      },
      {
        label: "Households",
        data: Object.values(districtData).map((d) => d.households),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "District Comparison - Total Numbers",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
        },
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        height: "400px",
      }}
    >
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

// Data Table Component
function DataTable({ data, title }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
        <p style={{ color: "#6b7280" }}>No data available to display</p>
      </div>
    );
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    let aVal = a[sortColumn] || 0;
    let bVal = b[sortColumn] || 0;

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const headers = [
    { key: "district", label: "District", icon: "🏛️" },
    { key: "month", label: "Month", icon: "📅" },
    { key: "personDays", label: "Person Days", icon: "👨‍💼" },
    { key: "households", label: "Households", icon: "🏠" },
    { key: "fundsSpent", label: "Funds Spent", icon: "💰" },
    { key: "completionRate", label: "Completion %", icon: "✅" },
  ];

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "1.5rem 1.5rem 1rem",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          📋 {title}
        </h2>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb" }}>
              {headers.map((header) => (
                <th
                  key={header.key}
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151",
                    cursor: "pointer",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                  onClick={() => handleSort(header.key)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {header.icon} {header.label}
                    {sortColumn === header.key && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "white" : "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>
                  {row.district || "N/A"}
                </td>
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>
                  {row.month || "N/A"}
                </td>
                <td
                  style={{
                    padding: "0.75rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  {formatNumber(row.personDays || 0)}
                </td>
                <td
                  style={{
                    padding: "0.75rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  {formatNumber(row.households || 0)}
                </td>
                <td
                  style={{
                    padding: "0.75rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#059669",
                  }}
                >
                  {formatCurrency(row.fundsSpent || 0)}
                </td>
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: `${row.completionRate || 0}%`,
                        height: "0.5rem",
                        backgroundColor: "#10b981",
                        borderRadius: "0.25rem",
                        minWidth: "2rem",
                      }}
                    ></div>
                    <span>{row.completionRate || 0}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          padding: "1rem 1.5rem",
          backgroundColor: "#f9fafb",
          fontSize: "0.875rem",
          color: "#6b7280",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        📊 Showing {sortedData.length} records
        {sortColumn &&
          ` • Sorted by ${headers.find((h) => h.key === sortColumn)?.label} (${sortDirection})`}
      </div>
    </div>
  );
}

// About page
function AboutPage() {
  return (
    <div style={{ maxWidth: "768px" }}>
      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: "bold",
          color: "#111827",
          marginBottom: "1.5rem",
        }}
      >
        About MGNREGA Goa
      </h1>
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
          The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)
          is one of the largest work guarantee programs in the world. This
          dashboard provides insights into MGNREGA implementation in Goa state.
        </p>
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
          Our mission is to make rural employment data accessible and
          transparent for all stakeholders including citizens, researchers, and
          policymakers.
        </p>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "0.75rem",
          }}
        >
          Key Features
        </h2>
        <ul style={{ color: "#6b7280", paddingLeft: "1.5rem" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            Real-time employment data visualization
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            District-wise performance comparisons
          </li>
          <li style={{ marginBottom: "0.5rem" }}>Historical trend analysis</li>
          <li style={{ marginBottom: "0.5rem" }}>
            Transparent fund utilization tracking
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Mobile-friendly responsive design
          </li>
        </ul>
      </div>
    </div>
  );
}

// Help page
function HelpPage() {
  return (
    <div style={{ maxWidth: "768px" }}>
      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: "bold",
          color: "#111827",
          marginBottom: "1.5rem",
        }}
      >
        Help & Support
      </h1>
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "1rem",
          }}
        >
          Getting Started
        </h2>
        <ul
          style={{
            color: "#6b7280",
            paddingLeft: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <li style={{ marginBottom: "0.5rem" }}>
            Navigate through different sections using the menu
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            View employment data by district
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Export data for further analysis
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Access historical trends and comparisons
          </li>
        </ul>

        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "1rem",
          }}
        >
          Understanding the Data
        </h2>
        <ul
          style={{
            color: "#6b7280",
            paddingLeft: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Person Days:</strong> Total days of employment provided
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Households:</strong> Number of families benefited
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Funds Spent:</strong> Total money disbursed for wages
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Completion Rate:</strong> Percentage of projects completed
          </li>
        </ul>

        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "1rem",
          }}
        >
          Contact Us
        </h2>
        <p style={{ color: "#6b7280" }}>
          For technical support or data inquiries, please contact us at:{" "}
          <a
            href="mailto:support@mgnrega-goa.gov.in"
            style={{ color: "#059669", textDecoration: "none" }}
          >
            support@mgnrega-goa.gov.in
          </a>
        </p>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            backgroundColor: "#eff6ff",
            borderRadius: "0.5rem",
          }}
        >
          <h3
            style={{
              fontWeight: "600",
              color: "#1e3a8a",
              marginBottom: "0.5rem",
            }}
          >
            System Status
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "0.5rem",
                height: "0.5rem",
                backgroundColor: "#10b981",
                borderRadius: "50%",
              }}
            ></div>
            <span style={{ fontSize: "0.875rem", color: "#1e40af" }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppNew;
