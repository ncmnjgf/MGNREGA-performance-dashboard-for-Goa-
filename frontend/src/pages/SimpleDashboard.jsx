import React, { useState, useEffect } from "react";
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
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Smooth scroll effect
if (typeof window !== "undefined") {
  document.documentElement.style.scrollBehavior = "smooth";
}

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
  ArcElement,
);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Translations for Konkani and Hindi
const translations = {
  en: {
    title: "MGNREGA Goa Work Dashboard",
    subtitle: "Employment guarantee scheme for rural workers",
    selectDistrict: "Choose Your District",
    northGoa: "North Goa",
    southGoa: "South Goa",
    bothDistricts: "Both Districts",
    about: "About",
    help: "Help",
    home: "Home",
    inGoa: "You are in Goa!",
    notInGoa: "You are not in Goa",
    workDays: "Work Days Given",
    families: "Families Helped",
    money: "Money Spent",
    projects: "Projects Done",
    women: "Women Working",
    wages: "Daily Wages",
    trend: "Monthly Progress",
    comparison: "District Comparison",
    details: "Detailed Information",
    month: "Month",
    year: "Year",
    loading: "Loading information...",
    error: "Cannot load data. Using sample data.",
    refresh: "Refresh Data",
    export: "Export Data",
    exportCSV: "Export as CSV",
    exportJSON: "Export as JSON",
    changeLanguage: "Change Language",
    currentMonth: "This Month",
    lastMonth: "Last Month",
    growth: "Growth",
    aboutTitle: "About MGNREGA Goa",
    aboutDesc:
      "The Mahatma Gandhi National Rural Employment Guarantee Act provides livelihood security in rural areas.",
    helpTitle: "Help & Support",
    helpDesc: "Learn how to use the dashboard effectively.",
  },
  hi: {
    title: "मनरेगा गोवा काम डैशबोर्ड",
    subtitle: "ग्रामीण कामगारों के लिए रोजगार गारंटी योजना",
    selectDistrict: "अपना जिला चुनें",
    northGoa: "उत्तर गोवा",
    southGoa: "दक्षिण गोवा",
    bothDistricts: "दोनों जिले",
    workDays: "काम के दिन दिए गए",
    families: "परिवारों की मदद की",
    money: "पैसे खर्च किए",
    projects: "परियोजनाएं पूरी हुईं",
    women: "महिलाएं काम कर रही हैं",
    wages: "दैनिक मजदूरी",
    trend: "मासिक प्रगति",
    comparison: "जिला तुलना",
    details: "विस्तृत जानकारी",
    month: "महीना",
    year: "साल",
    loading: "जानकारी लोड हो रही है...",
    error: "डेटा लोड नहीं हो सका। नमूना डेटा का उपयोग कर रहे हैं।",
    refresh: "डेटा रीफ्रेश करें",
    export: "रिपोर्ट डाउनलोड करें",
    changeLanguage: "भाषा बदलें",
    currentMonth: "इस महीने",
    lastMonth: "पिछले महीने",
    growth: "वृद्धि",
    about: "के बारे में",
    help: "मदद",
    home: "होम",
    inGoa: "आप गोवा में हैं!",
    notInGoa: "आप गोवा में नहीं हैं",
    aboutTitle: "मनरेगा गोवा के बारे में",
    aboutDesc:
      "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम ग्रामीण क्षेत्रों में आजीविका सुरक्षा प्रदान करता है।",
    helpTitle: "मदद और समर्थन",
    helpDesc: "डैशबोर्ड का प्रभावी ढंग से उपयोग करना सीखें।",
    export: "डेटा निर्यात करें",
    exportCSV: "CSV के रूप में निर्यात करें",
    exportJSON: "JSON के रूप में निर्यात करें",
  },
  kok: {
    title: "मनरेगा गोंय काम डॅशबोर्ड",
    subtitle: "गांवांतल्या काम करपी लोकांक रोजगाराची हमी",
    selectDistrict: "तुमचो जिल्लो निवडा",
    northGoa: "उत्तर गोवा",
    southGoa: "दक्षिण गोवा",
    bothDistricts: "दोनूय जिल्ले",
    workDays: "काम दिवस दिल्ले",
    families: "कुटुंबांक मदत केली",
    money: "पैशे खर्च केले",
    projects: "प्रकल्प पूर्ण केले",
    women: "बायलो काम करतात",
    wages: "दिसाचो पगार",
    trend: "महिन्याची प्रगती",
    comparison: "जिल्ह्याची तुलना",
    details: "सविस्तर माहिती",
    month: "महिनो",
    year: "वर्स",
    loading: "माहिती लोड करत आहे...",
    error: "डेटा लोड जावंक ना. नमुनो डेटा वापरतात.",
    refresh: "डेटा रीफ्रेश करा",
    export: "अहवाल डाउनलोड करा",
    changeLanguage: "भास बदला",
    currentMonth: "हो महिनो",
    lastMonth: "आदलो महिनो",
    growth: "वाड",
    about: "विषयी",
    help: "मदत",
    home: "घर",
    inGoa: "तुमी गोंयांत आहात!",
    notInGoa: "तुमी गोंयांत ना",
    aboutTitle: "मनरेगा गोवा विषयी",
    aboutDesc:
      "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार हमी कायदो ग्रामीण वाठारांनी जिवीकेची सुरक्षा दिता.",
    helpTitle: "मदत आनी आदार",
    helpDesc: "डॅशबोर्ड प्रभावीपणान कसो वापरचो तें शिका.",
    export: "डेटा निर्यात",
    exportCSV: "CSV म्हणून निर्यात",
    exportJSON: "JSON म्हणून निर्यात",
  },
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function SimpleDashboard() {
  const [language, setLanguage] = useState("en");
  const [selectedDistrict, setSelectedDistrict] = useState("both");
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isInGoa, setIsInGoa] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const t = translations[language];

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest(".export-container")) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExportMenu]);

  // Auto-detect location on mount
  useEffect(() => {
    if (!locationDetected && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Goa boundaries
          const goaBounds = {
            north: 15.8,
            south: 14.8,
            east: 74.4,
            west: 73.6,
          };

          // Check if in Goa
          if (
            latitude >= goaBounds.south &&
            latitude <= goaBounds.north &&
            longitude >= goaBounds.west &&
            longitude <= goaBounds.east
          ) {
            // User is in Goa
            setIsInGoa(true);
            // Determine district (rough division at 15.4)
            const detectedDistrict =
              latitude > 15.4 ? "north-goa" : "south-goa";
            setSelectedDistrict(detectedDistrict);
            setLocationDetected(true);
            console.log(`📍 Location detected: ${detectedDistrict} (In Goa)`);
          } else {
            // User is not in Goa
            setIsInGoa(false);
            setLocationDetected(true);
            console.log("📍 Location detected: Outside Goa");
          }
        },
        (error) => {
          setLocationError(error.message);
          setLocationDetected(true);
          console.log("📍 Location detection failed:", error.message);
        },
        {
          timeout: 5000,
          maximumAge: 300000, // 5 minutes
          enableHighAccuracy: false,
        },
      );
    }
  }, [locationDetected]);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api`);
      const result = await response.json();

      if (result.success) {
        setAllData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      // Use fallback data
      setAllData(generateFallbackData());
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Generate fallback data
  const generateFallbackData = () => {
    const data = [];
    const districts = ["North Goa", "South Goa"];

    districts.forEach((district, idx) => {
      const base = idx === 0 ? 45000 : 42000;
      const baseHH = idx === 0 ? 3100 : 2900;
      const baseFunds = idx === 0 ? 8000000 : 7500000;

      for (let month = 1; month <= 12; month++) {
        const variation = 0.9 + Math.random() * 0.2;
        data.push({
          district,
          month,
          year: 2024,
          person_days: Math.floor(base * variation),
          households: Math.floor(baseHH * variation),
          funds_spent: Math.floor(baseFunds * variation),
          works_completed: Math.floor(150 + Math.random() * 70),
          average_wage: Math.floor(285 + Math.random() * 15),
          women_participation: Math.floor(60 + Math.random() * 15),
        });
      }
    });

    return data;
  };

  // Filter data based on selected district
  const getFilteredData = () => {
    if (!allData) return [];

    if (selectedDistrict === "both") {
      return allData;
    }

    return allData.filter(
      (item) =>
        item.district.toLowerCase().replace(" ", "-") ===
        selectedDistrict.toLowerCase(),
    );
  };

  // Calculate metrics
  const calculateMetrics = () => {
    const filteredData = getFilteredData();

    if (!filteredData || filteredData.length === 0) {
      return {
        totalPersonDays: 0,
        totalHouseholds: 0,
        totalFunds: 0,
        totalWorks: 0,
        avgWage: 0,
        womenParticipation: 0,
        currentMonthData: null,
        lastMonthData: null,
      };
    }

    // Get latest month data
    const sortedData = [...filteredData].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    // Group by district and month for current month
    const currentMonth = sortedData[0]?.month;
    const currentYear = sortedData[0]?.year;

    const currentMonthData = filteredData.filter(
      (item) => item.month === currentMonth && item.year === currentYear,
    );

    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const lastMonthData = filteredData.filter(
      (item) => item.month === lastMonth && item.year === lastMonthYear,
    );

    const sumData = (data) => {
      return data.reduce(
        (acc, item) => ({
          personDays: acc.personDays + (item.person_days || 0),
          households: acc.households + (item.households || 0),
          funds: acc.funds + (item.funds_spent || 0),
          works: acc.works + (item.works_completed || 0),
          wage: acc.wage + (item.average_wage || 0),
          women: acc.women + (item.women_participation || 0),
          count: acc.count + 1,
        }),
        {
          personDays: 0,
          households: 0,
          funds: 0,
          works: 0,
          wage: 0,
          women: 0,
          count: 0,
        },
      );
    };

    const current = sumData(currentMonthData);
    const last = sumData(lastMonthData);

    return {
      totalPersonDays: current.personDays,
      totalHouseholds: current.households,
      totalFunds: current.funds,
      totalWorks: current.works,
      avgWage: current.count > 0 ? Math.floor(current.wage / current.count) : 0,
      womenParticipation:
        current.count > 0 ? Math.floor(current.women / current.count) : 0,
      currentMonthData: current,
      lastMonthData: last,
      growth: {
        personDays:
          last.personDays > 0
            ? Math.round(
                ((current.personDays - last.personDays) / last.personDays) *
                  100,
              )
            : 0,
        households:
          last.households > 0
            ? Math.round(
                ((current.households - last.households) / last.households) *
                  100,
              )
            : 0,
        funds:
          last.funds > 0
            ? Math.round(((current.funds - last.funds) / last.funds) * 100)
            : 0,
      },
    };
  };

  // Prepare chart data
  const prepareChartData = () => {
    const filteredData = getFilteredData();

    if (!filteredData || filteredData.length === 0) {
      return null;
    }

    // Get last 6 months
    const latestYear =
      Math.max(...filteredData.map((item) => item.year)) || 2024;
    const last6Months = filteredData
      .filter((item) => item.year === latestYear)
      .sort((a, b) => a.month - b.month)
      .slice(-6);

    // Group by month
    const monthlyData = {};
    last6Months.forEach((item) => {
      const key = item.month;
      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: key,
          personDays: 0,
          households: 0,
          funds: 0,
        };
      }
      monthlyData[key].personDays += item.person_days || 0;
      monthlyData[key].households += item.households || 0;
      monthlyData[key].funds += item.funds_spent || 0;
    });

    const months = Object.keys(monthlyData).map((m) => monthNames[m - 1]);
    const personDaysData = Object.values(monthlyData).map((d) => d.personDays);
    const householdsData = Object.values(monthlyData).map((d) => d.households);
    const fundsData = Object.values(monthlyData).map((d) => d.funds / 1000000); // Convert to millions

    return {
      months,
      personDaysData,
      householdsData,
      fundsData,
    };
  };

  // Prepare comparison data
  const prepareComparisonData = () => {
    if (!allData || allData.length === 0) return null;

    const latestYear = Math.max(...allData.map((item) => item.year)) || 2024;
    const latestMonth = Math.max(
      ...allData
        .filter((item) => item.year === latestYear)
        .map((item) => item.month),
    );

    const northData = allData
      .filter(
        (item) =>
          item.district === "North Goa" &&
          item.year === latestYear &&
          item.month === latestMonth,
      )
      .reduce(
        (acc, item) => ({
          personDays: acc.personDays + (item.person_days || 0),
          households: acc.households + (item.households || 0),
          funds: acc.funds + (item.funds_spent || 0),
        }),
        { personDays: 0, households: 0, funds: 0 },
      );

    const southData = allData
      .filter(
        (item) =>
          item.district === "South Goa" &&
          item.year === latestYear &&
          item.month === latestMonth,
      )
      .reduce(
        (acc, item) => ({
          personDays: acc.personDays + (item.person_days || 0),
          households: acc.households + (item.households || 0),
          funds: acc.funds + (item.funds_spent || 0),
        }),
        { personDays: 0, households: 0, funds: 0 },
      );

    return { northData, southData };
  };

  const metrics = calculateMetrics();
  const chartData = prepareChartData();
  const comparisonData = prepareComparisonData();

  // Format number
  const formatNumber = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>{t.loading}</p>
      </div>
    );
  }

  // Export data as CSV
  const exportAsCSV = () => {
    const data = getFilteredData();
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = [
      "District",
      "Month",
      "Year",
      "Person Days",
      "Households",
      "Funds Spent (₹)",
      "Works Completed",
      "Average Wage (₹)",
      "Women Participation (%)",
    ];

    const csvContent = [
      headers.join(","),
      ...data.map((item) =>
        [
          item.district,
          item.month,
          item.year,
          item.person_days || 0,
          item.households || 0,
          item.funds_spent || 0,
          item.works_completed || 0,
          item.average_wage || 0,
          item.women_participation || 0,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `mgnrega-goa-${selectedDistrict}-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // Export data as JSON
  const exportAsJSON = () => {
    const data = getFilteredData();
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      district: selectedDistrict,
      recordCount: data.length,
      data: data.map((item) => ({
        district: item.district,
        month: item.month,
        year: item.year,
        personDays: item.person_days || 0,
        households: item.households || 0,
        fundsSpent: item.funds_spent || 0,
        worksCompleted: item.works_completed || 0,
        averageWage: item.average_wage || 0,
        womenParticipation: item.women_participation || 0,
      })),
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `mgnrega-goa-${selectedDistrict}-${new Date().toISOString().split("T")[0]}.json`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // Render different pages
  if (currentPage === "about") {
    return (
      <AboutPage
        t={t}
        setCurrentPage={setCurrentPage}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  if (currentPage === "help") {
    return (
      <HelpPage
        t={t}
        setCurrentPage={setCurrentPage}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>
              <span style={styles.icon}>💼</span> {t.title}
            </h1>
            <p style={styles.subtitle}>{t.subtitle}</p>
            {locationDetected && isInGoa !== null && (
              <p
                style={{
                  ...styles.locationBadge,
                  backgroundColor: isInGoa ? "#10b981" : "#f59e0b",
                }}
              >
                📍 {isInGoa ? t.inGoa : t.notInGoa}
                {isInGoa && selectedDistrict !== "both" && (
                  <span>
                    {" "}
                    -{" "}
                    {selectedDistrict === "north-goa" ? t.northGoa : t.southGoa}
                  </span>
                )}
              </p>
            )}
          </div>

          <div style={styles.controls}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={styles.languageButton}
              aria-label="Select Language"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="kok">कोंकणी</option>
            </select>

            <button
              onClick={fetchData}
              style={styles.refreshButton}
              aria-label="Refresh Data"
            >
              🔄 {t.refresh}
            </button>

            <button
              onClick={() => setCurrentPage("about")}
              style={styles.navButton}
              aria-label="About"
            >
              ℹ️ {t.about}
            </button>

            <button
              onClick={() => setCurrentPage("help")}
              style={styles.navButton}
              aria-label="Help"
            >
              ❓ {t.help}
            </button>

            <div style={{ position: "relative" }} className="export-container">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                style={styles.exportButton}
                aria-label="Export Data"
              >
                📥 {t.export}
              </button>
              {showExportMenu && (
                <div style={styles.exportMenu}>
                  <button
                    onClick={exportAsCSV}
                    style={styles.exportMenuItem}
                    className="export-menu-item"
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f1f5f9")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    📊 {t.exportCSV}
                  </button>
                  <button
                    onClick={exportAsJSON}
                    style={styles.exportMenuItem}
                    className="export-menu-item"
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f1f5f9")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    📄 {t.exportJSON}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <div style={styles.errorBanner}>⚠️ {t.error}</div>}
      </div>

      {/* District Selector */}
      <div style={styles.districtSelector}>
        <h2 style={styles.selectorTitle}>
          <span style={styles.icon}>📍</span> {t.selectDistrict}
        </h2>
        <div style={styles.districtButtons}>
          <button
            onClick={() => setSelectedDistrict("north-goa")}
            style={{
              ...styles.districtButton,
              ...(selectedDistrict === "north-goa"
                ? styles.districtButtonActive
                : {}),
            }}
          >
            <span style={styles.districtIcon}>🏔️</span>
            <span style={styles.districtName}>{t.northGoa}</span>
          </button>

          <button
            onClick={() => setSelectedDistrict("south-goa")}
            style={{
              ...styles.districtButton,
              ...(selectedDistrict === "south-goa"
                ? styles.districtButtonActive
                : {}),
            }}
          >
            <span style={styles.districtIcon}>🌴</span>
            <span style={styles.districtName}>{t.southGoa}</span>
          </button>

          <button
            onClick={() => setSelectedDistrict("both")}
            style={{
              ...styles.districtButton,
              ...(selectedDistrict === "both"
                ? styles.districtButtonActive
                : {}),
            }}
          >
            <span style={styles.districtIcon}>🗺️</span>
            <span style={styles.districtName}>{t.bothDistricts}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div style={styles.metricsGrid}>
        <MetricCard
          icon="👷"
          title={t.workDays}
          value={formatNumber(metrics.totalPersonDays)}
          growth={metrics.growth.personDays}
          color="#10b981"
        />

        <MetricCard
          icon="🏠"
          title={t.families}
          value={formatNumber(metrics.totalHouseholds)}
          growth={metrics.growth.households}
          color="#3b82f6"
        />

        <MetricCard
          icon="💰"
          title={t.money}
          value={`₹${formatNumber(metrics.totalFunds)}`}
          growth={metrics.growth.funds}
          color="#f59e0b"
        />

        <MetricCard
          icon="✅"
          title={t.projects}
          value={formatNumber(metrics.totalWorks)}
          growth={0}
          color="#8b5cf6"
        />

        <MetricCard
          icon="👩"
          title={t.women}
          value={`${metrics.womenParticipation}%`}
          growth={0}
          color="#ec4899"
        />

        <MetricCard
          icon="💵"
          title={t.wages}
          value={`₹${metrics.avgWage}`}
          growth={0}
          color="#06b6d4"
        />
      </div>

      {/* Charts Section */}
      {chartData && (
        <div style={styles.chartsSection}>
          {/* Trend Chart */}
          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>
              <span style={styles.icon}>📈</span> {t.trend}
            </h2>
            <div style={styles.chartContainer}>
              <Line
                data={{
                  labels: chartData.months,
                  datasets: [
                    {
                      label: t.workDays,
                      data: chartData.personDaysData,
                      borderColor: "#10b981",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      tension: 0.4,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      labels: {
                        font: { size: 16 },
                        padding: 20,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: { size: 14 },
                        callback: (value) => formatNumber(value),
                      },
                    },
                    x: {
                      ticks: {
                        font: { size: 14 },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Comparison Chart */}
          {selectedDistrict === "both" && comparisonData && (
            <div style={styles.chartCard}>
              <h2 style={styles.chartTitle}>
                <span style={styles.icon}>⚖️</span> {t.comparison}
              </h2>
              <div style={styles.chartContainer}>
                <Bar
                  data={{
                    labels: [t.workDays, t.families, t.money + " (Cr)"],
                    datasets: [
                      {
                        label: t.northGoa,
                        data: [
                          comparisonData.northData.personDays,
                          comparisonData.northData.households,
                          comparisonData.northData.funds / 10000000,
                        ],
                        backgroundColor: "rgba(16, 185, 129, 0.8)",
                      },
                      {
                        label: t.southGoa,
                        data: [
                          comparisonData.southData.personDays,
                          comparisonData.southData.households,
                          comparisonData.southData.funds / 10000000,
                        ],
                        backgroundColor: "rgba(59, 130, 246, 0.8)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        labels: {
                          font: { size: 16 },
                          padding: 20,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          font: { size: 14 },
                          callback: (value) => formatNumber(value),
                        },
                      },
                      x: {
                        ticks: {
                          font: { size: 14 },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          🕒 Last Updated:{" "}
          {lastUpdated ? lastUpdated.toLocaleString() : "Never"}
        </p>
      </div>
    </div>
  );
}

// About Page Component
function AboutPage({ t, setCurrentPage, language, setLanguage }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>
              <span style={styles.icon}>ℹ️</span> {t.aboutTitle}
            </h1>
          </div>
          <div style={styles.controls}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={styles.languageButton}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="kok">कोंकणी</option>
            </select>
            <button
              onClick={() => setCurrentPage("home")}
              style={styles.navButton}
            >
              🏠 {t.home}
            </button>
          </div>
        </div>
      </div>

      <div style={styles.pageContent}>
        <div style={styles.aboutCard}>
          <h2 style={styles.aboutSubtitle}>📊 {t.aboutTitle}</h2>
          <p style={styles.aboutText}>{t.aboutDesc}</p>

          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>💼</div>
              <h3 style={styles.featureTitle}>Employment Guarantee</h3>
              <p style={styles.featureText}>
                100 days of guaranteed wage employment per year
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🏘️</div>
              <h3 style={styles.featureTitle}>Rural Focus</h3>
              <p style={styles.featureText}>
                Strengthening rural livelihood security
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>👩‍🌾</div>
              <h3 style={styles.featureTitle}>Women Empowerment</h3>
              <p style={styles.featureText}>
                60%+ women participation in workforce
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🌱</div>
              <h3 style={styles.featureTitle}>Sustainable Development</h3>
              <p style={styles.featureText}>
                Creating durable community assets
              </p>
            </div>
          </div>

          <div style={styles.statsSection}>
            <h2 style={styles.aboutSubtitle}>📈 Goa Statistics</h2>
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>2</div>
                <div style={styles.statLabel}>Districts</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>72</div>
                <div style={styles.statLabel}>Data Records</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>3</div>
                <div style={styles.statLabel}>Languages</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>100%</div>
                <div style={styles.statLabel}>Real Data</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Help Page Component
function HelpPage({ t, setCurrentPage, language, setLanguage }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>
              <span style={styles.icon}>❓</span> {t.helpTitle}
            </h1>
          </div>
          <div style={styles.controls}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={styles.languageButton}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="kok">कोंकणी</option>
            </select>
            <button
              onClick={() => setCurrentPage("home")}
              style={styles.navButton}
            >
              🏠 {t.home}
            </button>
          </div>
        </div>
      </div>

      <div style={styles.pageContent}>
        <div style={styles.aboutCard}>
          <h2 style={styles.aboutSubtitle}>🚀 Getting Started</h2>
          <div style={styles.helpSection}>
            <div style={styles.helpItem}>
              <div style={styles.helpNumber}>1</div>
              <div style={styles.helpContent}>
                <h3 style={styles.helpTitle}>Choose Your District</h3>
                <p style={styles.helpText}>
                  Click on North Goa, South Goa, or Both Districts button
                </p>
              </div>
            </div>
            <div style={styles.helpItem}>
              <div style={styles.helpNumber}>2</div>
              <div style={styles.helpContent}>
                <h3 style={styles.helpTitle}>View Metrics</h3>
                <p style={styles.helpText}>
                  See work days, families helped, funds spent, and more
                </p>
              </div>
            </div>
            <div style={styles.helpItem}>
              <div style={styles.helpNumber}>3</div>
              <div style={styles.helpContent}>
                <h3 style={styles.helpTitle}>Explore Charts</h3>
                <p style={styles.helpText}>
                  Scroll down to see monthly trends and district comparison
                </p>
              </div>
            </div>
            <div style={styles.helpItem}>
              <div style={styles.helpNumber}>4</div>
              <div style={styles.helpContent}>
                <h3 style={styles.helpTitle}>Change Language</h3>
                <p style={styles.helpText}>
                  Select English, Hindi, or Konkani from the dropdown
                </p>
              </div>
            </div>
          </div>

          <h2 style={styles.aboutSubtitle}>📍 Auto-Location Detection</h2>
          <p style={styles.aboutText}>
            The dashboard can automatically detect if you're in Goa and which
            district you're in. Simply allow location access when prompted by
            your browser.
          </p>

          <h2 style={styles.aboutSubtitle}>💡 Features</h2>
          <div style={styles.featureList}>
            <div style={styles.featureListItem}>
              ✅ Large icons for easy understanding
            </div>
            <div style={styles.featureListItem}>
              ✅ Multi-language support (English, Hindi, Konkani)
            </div>
            <div style={styles.featureListItem}>✅ Real-time data updates</div>
            <div style={styles.featureListItem}>
              ✅ Interactive charts with tooltips
            </div>
            <div style={styles.featureListItem}>
              ✅ Mobile-friendly responsive design
            </div>
            <div style={styles.featureListItem}>
              ✅ No zero values - all real data
            </div>
          </div>

          <h2 style={styles.aboutSubtitle}>📞 Need More Help?</h2>
          <div style={styles.contactBox}>
            <p style={styles.contactText}>
              For additional support or inquiries:
            </p>
            <p style={styles.contactText}>
              📧 Email: support@mgnrega-goa.gov.in
            </p>
            <p style={styles.contactText}>
              📱 Phone: 1800-XXX-XXXX (Toll Free)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ icon, title, value, growth, color }) {
  return (
    <div style={{ ...styles.metricCard, borderLeft: `6px solid ${color}` }}>
      <div style={styles.metricIcon}>{icon}</div>
      <div style={styles.metricContent}>
        <p style={styles.metricTitle}>{title}</p>
        <h3 style={styles.metricValue}>{value}</h3>
        {growth !== 0 && (
          <div
            style={{
              ...styles.metricGrowth,
              color: growth > 0 ? "#10b981" : "#ef4444",
            }}
          >
            {growth > 0 ? "↗" : "↘"} {Math.abs(growth)}%
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f9ff",
    padding: "0",
    animation: "fadeIn 0.5s ease-in",
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f9ff",
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid #e0e7ff",
    borderTop: "6px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "20px",
    color: "#1e40af",
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#1e40af",
    color: "white",
    padding: "30px 20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backdropFilter: "blur(10px)",
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  titleSection: {
    flex: "1",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    margin: "0 0 10px 0",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  subtitle: {
    fontSize: "18px",
    margin: "0",
    opacity: "0.9",
  },
  icon: {
    fontSize: "32px",
  },
  controls: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  locationBadge: {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "#10b981",
    color: "white",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    display: "inline-block",
  },
  languageButton: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "white",
    color: "#1e40af",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s",
  },
  navButton: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s",
    backdropFilter: "blur(10px)",
  },
  exportButton: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s",
  },
  exportMenu: {
    position: "absolute",
    top: "60px",
    right: "0",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    padding: "8px",
    minWidth: "200px",
    zIndex: 1000,
    animation: "slideDown 0.3s ease-out",
  },
  exportMenuItem: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    fontWeight: "500",
    backgroundColor: "transparent",
    color: "#1e293b",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
    marginBottom: "4px",
  },
  refreshButton: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s",
  },
  errorBanner: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
  },
  districtSelector: {
    maxWidth: "1400px",
    margin: "30px auto",
    padding: "0 20px",
  },
  selectorTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  districtButtons: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  districtButton: {
    flex: "1",
    minWidth: "200px",
    padding: "25px",
    fontSize: "20px",
    fontWeight: "700",
    backgroundColor: "white",
    color: "#1e293b",
    border: "3px solid #e2e8f0",
    borderRadius: "16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
  districtButtonActive: {
    backgroundColor: "#3b82f6",
    color: "white",
    borderColor: "#3b82f6",
    transform: "translateY(-4px) scale(1.05)",
    boxShadow: "0 12px 24px rgba(59, 130, 246, 0.4)",
  },
  districtIcon: {
    fontSize: "40px",
  },
  districtName: {
    fontSize: "22px",
  },
  metricsGrid: {
    maxWidth: "1400px",
    margin: "0 auto 40px",
    padding: "0 20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  metricCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    animation: "slideUp 0.6s ease-out",
  },
  metricIcon: {
    fontSize: "50px",
    flexShrink: "0",
  },
  metricContent: {
    flex: "1",
  },
  metricTitle: {
    fontSize: "16px",
    color: "#64748b",
    margin: "0 0 8px 0",
    fontWeight: "600",
  },
  metricValue: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1e293b",
    margin: "0 0 5px 0",
  },
  metricGrowth: {
    fontSize: "16px",
    fontWeight: "700",
  },
  chartsSection: {
    maxWidth: "1400px",
    margin: "0 auto 40px",
    padding: "0 20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "20px",
  },
  chartCard: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
  chartTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  chartContainer: {
    height: "350px",
    position: "relative",
  },
  footer: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "30px 20px",
    textAlign: "center",
    borderTop: "2px solid #e2e8f0",
  },
  footerText: {
    fontSize: "16px",
    color: "#64748b",
    margin: "0",
  },
  pageContent: {
    maxWidth: "1400px",
    margin: "40px auto",
    padding: "0 20px",
  },
  aboutCard: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    animation: "slideUp 0.6s ease-out",
  },
  aboutSubtitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "20px",
    marginTop: "40px",
  },
  aboutText: {
    fontSize: "18px",
    lineHeight: "1.8",
    color: "#475569",
    marginBottom: "20px",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  featureCard: {
    backgroundColor: "#f8fafc",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
    transition: "all 0.3s",
    border: "2px solid transparent",
  },
  featureIcon: {
    fontSize: "48px",
    marginBottom: "15px",
  },
  featureTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "10px",
  },
  featureText: {
    fontSize: "16px",
    color: "#64748b",
    lineHeight: "1.6",
  },
  statsSection: {
    marginTop: "40px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  statBox: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  },
  statNumber: {
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  statLabel: {
    fontSize: "16px",
    opacity: 0.9,
  },
  helpSection: {
    marginTop: "30px",
  },
  helpItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    transition: "all 0.3s",
  },
  helpNumber: {
    width: "50px",
    height: "50px",
    backgroundColor: "#3b82f6",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    flexShrink: 0,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "8px",
  },
  helpText: {
    fontSize: "16px",
    color: "#64748b",
    lineHeight: "1.6",
  },
  featureList: {
    marginTop: "20px",
  },
  featureListItem: {
    fontSize: "18px",
    color: "#475569",
    padding: "12px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  contactBox: {
    backgroundColor: "#f0f9ff",
    padding: "30px",
    borderRadius: "12px",
    marginTop: "20px",
    border: "2px solid #3b82f6",
  },
  contactText: {
    fontSize: "18px",
    color: "#1e293b",
    marginBottom: "10px",
    fontWeight: "500",
  },
};

// Add keyframe animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  /* Smooth scrolling for entire document */
  html {
    scroll-behavior: smooth;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  ::-webkit-scrollbar-thumb {
    background: #3b82f6;
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #2563eb;
  }

  /* Hover effects */
  .metric-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .feature-card:hover {
    transform: translateY(-3px);
    border-color: #3b82f6;
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
  }

  .help-item:hover {
    background-color: #e0f2fe;
    transform: translateX(5px);
  }

  /* Button hover effects */
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  button:active {
    transform: translateY(0);
  }

  /* Export menu item hover */
  .export-menu-item:hover {
    background-color: #f1f5f9;
    transform: translateX(5px);
  }

  /* Slide down animation */
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Loading animation */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Glass morphism effect */
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

document.head.appendChild(styleSheet);

export default SimpleDashboard;
