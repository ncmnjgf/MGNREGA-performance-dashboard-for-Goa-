import axios from "axios";
import DistrictData from "../models/DistrictData.js";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory cache for CSV data
let csvDataCache = null;
let csvCacheTimestamp = null;
const CSV_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Read CSV with caching
const readCSV = (filePath) =>
  new Promise((resolve, reject) => {
    // Check cache first
    if (
      csvDataCache &&
      csvCacheTimestamp &&
      Date.now() - csvCacheTimestamp < CSV_CACHE_DURATION
    ) {
      console.log("📦 Using cached CSV data");
      return resolve(csvDataCache);
    }

    const results = [];
    const absolutePath = path.resolve(__dirname, "..", filePath);

    if (!fs.existsSync(absolutePath)) {
      console.error(`❌ CSV file not found: ${absolutePath}`);
      return reject(new Error(`CSV file not found: ${filePath}`));
    }

    fs.createReadStream(absolutePath)
      .pipe(csv())
      .on("data", (data) => {
        // Parse and clean data
        const cleanedData = {
          district: data.district || "Unknown",
          month: parseInt(data.month) || 1,
          year: parseInt(data.year) || new Date().getFullYear(),
          person_days: parseInt(data.person_days) || 0,
          households: parseInt(data.households) || 0,
          funds_spent: parseInt(data.funds_spent) || 0,
          works_completed: parseInt(data.works_completed) || 0,
          average_wage: parseInt(data.average_wage) || 0,
          women_participation: parseInt(data.women_participation) || 0,
        };
        results.push(cleanedData);
      })
      .on("end", () => {
        console.log(`✅ CSV loaded: ${results.length} records`);
        // Update cache
        csvDataCache = results;
        csvCacheTimestamp = Date.now();
        resolve(results);
      })
      .on("error", (err) => {
        console.error("❌ CSV parsing error:", err);
        reject(err);
      });
  });

// Fetch all MGNREGA data
export const getAllData = async (req, res) => {
  try {
    console.log("📊 Fetching all MGNREGA data...");

    // Try API first if environment variables are set
    if (process.env.RESOURCE_ID && process.env.API_KEY) {
      try {
        const response = await axios.get(
          `https://api.data.gov.in/resource/${process.env.RESOURCE_ID}?api-key=${process.env.API_KEY}&format=json`,
          { timeout: 10000 },
        );

        const data = response.data.records;
        if (data && data.length > 0) {
          console.log(`✅ API data fetched: ${data.length} records`);

          // Cache the data in MongoDB
          try {
            await cacheDataToMongoDB(data);
          } catch (cacheError) {
            console.warn("⚠️ Failed to cache data:", cacheError.message);
          }

          return res.json({
            success: true,
            source: "API",
            count: data.length,
            data: data,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (apiError) {
        console.warn("⚠️ API fetch failed:", apiError.message);
      }
    }

    // Fallback to CSV
    try {
      console.log("📄 Using CSV fallback data...");
      const csvData = await readCSV("data/goa_mgnrega.csv");

      return res.json({
        success: true,
        source: "CSV",
        count: csvData.length,
        data: csvData,
        timestamp: new Date().toISOString(),
      });
    } catch (csvError) {
      console.warn("⚠️ CSV read failed:", csvError.message);
    }

    // Try MongoDB cache
    try {
      const cachedData = await DistrictData.find()
        .sort({ year: -1, month: -1 })
        .limit(1000);
      if (cachedData.length > 0) {
        console.log(`✅ Using MongoDB cache: ${cachedData.length} records`);
        return res.json({
          success: true,
          source: "MongoDB cache",
          count: cachedData.length,
          data: cachedData,
          timestamp: new Date().toISOString(),
          note: "Using cached data due to CSV unavailability",
        });
      }
    } catch (dbError) {
      console.error("❌ Database fallback failed:", dbError.message);
    }

    // Final fallback - return realistic mock data
    const mockData = generateRealisticMockData();
    console.log("📝 Using generated realistic data");
    res.json({
      success: true,
      source: "generated",
      count: mockData.length,
      data: mockData,
      timestamp: new Date().toISOString(),
      note: "Using generated data - all sources unavailable",
    });
  } catch (error) {
    console.error("❌ Error in getAllData:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch data",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

// Get list of districts
export const getDistricts = async (req, res) => {
  try {
    console.log("📍 Fetching districts list...");

    let districts = [];

    // Try CSV first
    try {
      const csvData = await readCSV("data/goa_mgnrega.csv");
      districts = [...new Set(csvData.map((d) => d.district))].filter(
        (d) => d && d !== "Unknown",
      );

      if (districts.length > 0) {
        console.log(`✅ Districts from CSV: ${districts.join(", ")}`);
        return res.json({
          success: true,
          source: "CSV",
          count: districts.length,
          districts: districts,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (csvError) {
      console.warn("⚠️ CSV read failed:", csvError.message);
    }

    // Try MongoDB cache
    try {
      const distinctDistricts = await DistrictData.distinct("district");
      if (distinctDistricts.length > 0) {
        console.log(
          `✅ Districts from MongoDB: ${distinctDistricts.join(", ")}`,
        );
        return res.json({
          success: true,
          source: "MongoDB cache",
          count: distinctDistricts.length,
          districts: distinctDistricts,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (dbError) {
      console.warn("⚠️ MongoDB query failed:", dbError.message);
    }

    // Final fallback - return Goa districts
    const goaDistricts = ["North Goa", "South Goa"];
    console.log("📋 Using default Goa districts");

    res.json({
      success: true,
      source: "default",
      count: goaDistricts.length,
      districts: goaDistricts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in getDistricts:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch districts",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

// Get data for specific district
export const getDistrictData = async (req, res) => {
  try {
    const { district } = req.params;
    console.log(`📊 Fetching data for district: ${district}`);

    if (!district) {
      return res.status(400).json({
        success: false,
        error: "District parameter is required",
        timestamp: new Date().toISOString(),
      });
    }

    let districtData = [];

    // Try CSV first
    try {
      const csvData = await readCSV("data/goa_mgnrega.csv");
      districtData = csvData.filter(
        (d) =>
          d.district &&
          d.district.toLowerCase().includes(district.toLowerCase()),
      );

      if (districtData.length > 0) {
        console.log(
          `✅ Found ${districtData.length} records for ${district} in CSV`,
        );
        return res.json({
          success: true,
          source: "CSV",
          district: district,
          count: districtData.length,
          data: districtData,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (csvError) {
      console.warn("⚠️ CSV read failed:", csvError.message);
    }

    // Try MongoDB cache
    try {
      const cachedData = await DistrictData.find({
        district: { $regex: district, $options: "i" },
      }).sort({ year: -1, month: -1 });

      if (cachedData.length > 0) {
        console.log(
          `✅ Found ${cachedData.length} cached records for ${district}`,
        );
        return res.json({
          success: true,
          source: "MongoDB cache",
          district: district,
          count: cachedData.length,
          data: cachedData,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (dbError) {
      console.warn("⚠️ MongoDB query failed:", dbError.message);
    }

    // Generate realistic mock data for the district
    const mockData = generateRealisticDistrictData(district);
    console.log(`📝 Generated realistic data for ${district}`);

    res.json({
      success: true,
      source: "generated",
      district: district,
      count: mockData.length,
      data: mockData,
      timestamp: new Date().toISOString(),
      note: "Using generated data due to unavailability of real data",
    });
  } catch (error) {
    console.error(`❌ Error fetching data for ${district}:`, error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch district data",
      district: req.params.district,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

// Helper function to cache data to MongoDB
const cacheDataToMongoDB = async (apiData) => {
  try {
    const cachePromises = apiData.map(async (record) => {
      const districtData = new DistrictData({
        district: record.district_name || record.district || "Unknown",
        month: parseInt(record.month) || new Date().getMonth() + 1,
        year: parseInt(record.year) || new Date().getFullYear(),
        person_days:
          parseInt(record.person_days) ||
          parseInt(record.persondays_generated) ||
          0,
        households:
          parseInt(record.households) || parseInt(record.total_households) || 0,
        funds_spent:
          parseFloat(record.funds_spent) ||
          parseFloat(record.total_expenditure) ||
          0,
        raw: record,
        fetched_at: new Date(),
      });

      // Use upsert to avoid duplicates
      return DistrictData.findOneAndUpdate(
        {
          district: districtData.district,
          month: districtData.month,
          year: districtData.year,
        },
        districtData,
        { upsert: true, new: true },
      );
    });

    await Promise.all(cachePromises);
    console.log(`💾 Cached ${apiData.length} records to MongoDB`);
  } catch (error) {
    console.error("❌ Error caching to MongoDB:", error.message);
    throw error;
  }
};

// Generate realistic mock data (no zeros)
const generateRealisticMockData = () => {
  const districts = ["North Goa", "South Goa"];
  const mockData = [];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  districts.forEach((district, districtIndex) => {
    // Base values vary by district
    const basePersonDays = 40000 + districtIndex * 5000;
    const baseHouseholds = 2800 + districtIndex * 300;
    const baseFunds = 7000000 + districtIndex * 1000000;

    for (let year = 2022; year <= 2024; year++) {
      // Year growth factor
      const yearGrowth = (year - 2022) * 0.15;

      for (let month = 1; month <= 12; month++) {
        // Seasonal variation (higher in summer months)
        const seasonalFactor =
          month >= 4 && month <= 8
            ? 1.1
            : month >= 11 || month <= 2
              ? 0.95
              : 1.0;

        // Add random variation
        const randomVariation = 0.9 + Math.random() * 0.2;

        const personDays = Math.floor(
          basePersonDays * (1 + yearGrowth) * seasonalFactor * randomVariation,
        );
        const households = Math.floor(
          baseHouseholds * (1 + yearGrowth) * seasonalFactor * randomVariation,
        );
        const fundsSpent = Math.floor(
          baseFunds * (1 + yearGrowth) * seasonalFactor * randomVariation,
        );

        mockData.push({
          district: district,
          month: month,
          monthName: monthNames[month - 1],
          year: year,
          person_days: personDays,
          households: households,
          funds_spent: fundsSpent,
          works_completed: Math.floor(120 + Math.random() * 100),
          average_wage: Math.floor(270 + Math.random() * 30),
          women_participation: Math.floor(55 + Math.random() * 20),
          fetched_at: new Date(),
        });
      }
    }
  });

  return mockData;
};

// Generate realistic mock data for specific district
const generateRealisticDistrictData = (district) => {
  const mockData = [];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Determine base values based on district
  const isSouthGoa = district.toLowerCase().includes("south");
  const basePersonDays = isSouthGoa ? 42000 : 45000;
  const baseHouseholds = isSouthGoa ? 2900 : 3100;
  const baseFunds = isSouthGoa ? 7500000 : 8000000;

  for (let year = 2022; year <= 2024; year++) {
    const yearGrowth = (year - 2022) * 0.15;

    for (let month = 1; month <= 12; month++) {
      const seasonalFactor =
        month >= 4 && month <= 8 ? 1.1 : month >= 11 || month <= 2 ? 0.95 : 1.0;
      const randomVariation = 0.9 + Math.random() * 0.2;

      const personDays = Math.floor(
        basePersonDays * (1 + yearGrowth) * seasonalFactor * randomVariation,
      );
      const households = Math.floor(
        baseHouseholds * (1 + yearGrowth) * seasonalFactor * randomVariation,
      );
      const fundsSpent = Math.floor(
        baseFunds * (1 + yearGrowth) * seasonalFactor * randomVariation,
      );

      mockData.push({
        district: district,
        month: month,
        monthName: monthNames[month - 1],
        year: year,
        person_days: personDays,
        households: households,
        funds_spent: fundsSpent,
        works_completed: Math.floor(120 + Math.random() * 100),
        average_wage: Math.floor(270 + Math.random() * 30),
        women_participation: Math.floor(55 + Math.random() * 20),
        fetched_at: new Date(),
      });
    }
  }

  return mockData;
};

// Clear cache (utility function for testing)
export const clearCache = async (req, res) => {
  try {
    csvDataCache = null;
    csvCacheTimestamp = null;
    console.log("🗑️ Cache cleared");
    res.json({
      success: true,
      message: "Cache cleared successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to clear cache",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
