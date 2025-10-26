import axios from "axios";
import DistrictData from "../models/DistrictData.js";
import fs from "fs";
import csv from "csv-parser";

// Read fallback CSV
const readCSV = (filePath) => new Promise((resolve, reject) => {
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", data => results.push(data))
    .on("end", () => resolve(results))
    .on("error", err => reject(err));
});

// Fetch API + fallback
export const getAllData = async (req, res) => {
  try {
    console.log("📊 Fetching all MGNREGA data...");

    // Try API first if environment variables are set
    if (process.env.RESOURCE_ID && process.env.API_KEY) {
      try {
        const response = await axios.get(
          `https://api.data.gov.in/resource/${process.env.RESOURCE_ID}?api-key=${process.env.API_KEY}&format=json`,
          { timeout: 10000 }
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
            timestamp: new Date().toISOString()
          });
        }
      } catch (apiError) {
        console.warn("⚠️ API fetch failed:", apiError.message);
      }
    }

    // Fallback to CSV
    console.log("📄 Using CSV fallback data...");
    const csvData = await readCSV("./src/data/goa_mgnrega.csv");

    res.json({
      success: true,
      source: "CSV fallback",
      count: csvData.length,
      data: csvData,
      timestamp: new Date().toISOString(),
      note: "Using fallback data due to API unavailability"
    });

  } catch (error) {
    console.error("❌ Error in getAllData:", error.message);

    // Try to return cached data from MongoDB as last resort
    try {
      const cachedData = await DistrictData.find().sort({ fetched_at: -1 }).limit(1000);
      if (cachedData.length > 0) {
        return res.json({
          success: true,
          source: "MongoDB cache",
          count: cachedData.length,
          data: cachedData,
          timestamp: new Date().toISOString(),
          note: "Using cached data due to API and CSV unavailability"
        });
      }
    } catch (dbError) {
      console.error("❌ Database fallback failed:", dbError.message);
    }

    // Final fallback - return mock data
    const mockData = generateMockData();
    res.status(503).json({
      success: false,
      source: "mock data",
      count: mockData.length,
      data: mockData,
      error: "All data sources unavailable",
      timestamp: new Date().toISOString()
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
      const csvData = await readCSV("./src/data/goa_mgnrega.csv");
      districts = [...new Set(csvData.map(d => d.district))].filter(d => d);

      if (districts.length > 0) {
        console.log(`✅ Districts from CSV: ${districts.join(', ')}`);
        return res.json({
          success: true,
          source: "CSV",
          count: districts.length,
          districts: districts,
          timestamp: new Date().toISOString()
        });
      }
    } catch (csvError) {
      console.warn("⚠️ CSV read failed:", csvError.message);
    }

    // Try MongoDB cache
    try {
      const distinctDistricts = await DistrictData.distinct('district');
      if (distinctDistricts.length > 0) {
        console.log(`✅ Districts from MongoDB: ${distinctDistricts.join(', ')}`);
        return res.json({
          success: true,
          source: "MongoDB cache",
          count: distinctDistricts.length,
          districts: distinctDistricts,
          timestamp: new Date().toISOString()
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
      note: "Using default Goa districts"
    });

  } catch (error) {
    console.error("❌ Error in getDistricts:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch districts",
      message: error.message,
      timestamp: new Date().toISOString()
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
        timestamp: new Date().toISOString()
      });
    }

    let districtData = [];

    // Try CSV first
    try {
      const csvData = await readCSV("./src/data/goa_mgnrega.csv");
      districtData = csvData.filter(d =>
        d.district && d.district.toLowerCase().includes(district.toLowerCase())
      );

      if (districtData.length > 0) {
        console.log(`✅ Found ${districtData.length} records for ${district} in CSV`);
        return res.json({
          success: true,
          source: "CSV",
          district: district,
          count: districtData.length,
          data: districtData,
          timestamp: new Date().toISOString()
        });
      }
    } catch (csvError) {
      console.warn("⚠️ CSV read failed:", csvError.message);
    }

    // Try MongoDB cache
    try {
      const cachedData = await DistrictData.find({
        district: { $regex: district, $options: 'i' }
      }).sort({ year: -1, month: -1 });

      if (cachedData.length > 0) {
        console.log(`✅ Found ${cachedData.length} cached records for ${district}`);
        return res.json({
          success: true,
          source: "MongoDB cache",
          district: district,
          count: cachedData.length,
          data: cachedData,
          timestamp: new Date().toISOString()
        });
      }
    } catch (dbError) {
      console.warn("⚠️ MongoDB query failed:", dbError.message);
    }

    // Generate mock data for the district
    const mockData = generateMockDistrictData(district);
    console.log(`📝 Generated mock data for ${district}`);

    res.json({
      success: true,
      source: "mock data",
      district: district,
      count: mockData.length,
      data: mockData,
      timestamp: new Date().toISOString(),
      note: "Using generated data due to unavailability of real data"
    });

  } catch (error) {
    console.error(`❌ Error fetching data for ${district}:`, error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch district data",
      district: req.params.district,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Helper function to cache data to MongoDB
const cacheDataToMongoDB = async (apiData) => {
  try {
    const cachePromises = apiData.map(async (record) => {
      const districtData = new DistrictData({
        district: record.district_name || record.district || 'Unknown',
        month: parseInt(record.month) || new Date().getMonth() + 1,
        year: parseInt(record.year) || new Date().getFullYear(),
        person_days: parseInt(record.person_days) || parseInt(record.persondays_generated) || 0,
        households: parseInt(record.households) || parseInt(record.total_households) || 0,
        funds_spent: parseFloat(record.funds_spent) || parseFloat(record.total_expenditure) || 0,
        raw: record,
        fetched_at: new Date()
      });

      // Use upsert to avoid duplicates
      return DistrictData.findOneAndUpdate(
        {
          district: districtData.district,
          month: districtData.month,
          year: districtData.year
        },
        districtData,
        { upsert: true, new: true }
      );
    });

    await Promise.all(cachePromises);
    console.log(`💾 Cached ${apiData.length} records to MongoDB`);
  } catch (error) {
    console.error("❌ Error caching to MongoDB:", error.message);
    throw error;
  }
};

// Generate mock data for testing
const generateMockData = () => {
  const districts = ["North Goa", "South Goa"];
  const mockData = [];

  districts.forEach(district => {
    for (let year = 2022; year <= 2024; year++) {
      for (let month = 1; month <= 12; month++) {
        mockData.push({
          district: district,
          month: month,
          year: year,
          person_days: Math.floor(Math.random() * 10000) + 1000,
          households: Math.floor(Math.random() * 500) + 100,
          funds_spent: Math.floor(Math.random() * 1000000) + 100000,
          raw: {},
          fetched_at: new Date()
        });
      }
    }
  });

  return mockData;
};

// Generate mock data for specific district
const generateMockDistrictData = (district) => {
  const mockData = [];

  for (let year = 2022; year <= 2024; year++) {
    for (let month = 1; month <= 12; month++) {
      mockData.push({
        district: district,
        month: month,
        year: year,
        person_days: Math.floor(Math.random() * 5000) + 500,
        households: Math.floor(Math.random() * 300) + 50,
        funds_spent: Math.floor(Math.random() * 500000) + 50000,
        raw: {},
        fetched_at: new Date()
      });
    }
  }

  return mockData;
};
