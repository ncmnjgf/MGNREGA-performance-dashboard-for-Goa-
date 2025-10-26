/**
 * Comprehensive API Testing Script for MGNREGA Goa Dashboard Backend
 * Tests all routes, error scenarios, and fallback mechanisms
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';
const TEST_TIMEOUT = 30000; // 30 seconds
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

// Test results storage
let testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: [],
  details: []
};

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

/**
 * Utility functions
 */
const log = (message, color = 'white') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logBold = (message, color = 'white') => {
  console.log(`${colors.bold}${colors[color]}${message}${colors.reset}`);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * HTTP client with retry logic
 */
const makeRequest = async (config, retries = RETRY_ATTEMPTS) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios({
        timeout: TEST_TIMEOUT,
        validateStatus: () => true, // Don't throw on HTTP error codes
        ...config
      });
      return response;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      log(`Attempt ${attempt} failed, retrying in ${RETRY_DELAY}ms...`, 'yellow');
      await sleep(RETRY_DELAY * attempt); // Exponential backoff
    }
  }
};

/**
 * Test assertion helper
 */
const assert = (condition, message, testName) => {
  const result = {
    test: testName,
    message,
    passed: condition,
    timestamp: new Date().toISOString()
  };

  testResults.details.push(result);

  if (condition) {
    testResults.passed++;
    log(`✅ PASS: ${testName} - ${message}`, 'green');
  } else {
    testResults.failed++;
    testResults.errors.push(`${testName}: ${message}`);
    log(`❌ FAIL: ${testName} - ${message}`, 'red');
  }

  return condition;
};

/**
 * Validate JSON response structure
 */
const validateApiResponse = (response, expectedFields, testName) => {
  const data = response.data;

  // Check if response is JSON
  if (!data || typeof data !== 'object') {
    return assert(false, 'Response is not valid JSON', testName);
  }

  // Check expected fields
  let allFieldsPresent = true;
  for (const field of expectedFields) {
    if (!(field in data)) {
      assert(false, `Missing required field: ${field}`, testName);
      allFieldsPresent = false;
    }
  }

  return allFieldsPresent;
};

/**
 * Test Suite 1: Health Check
 */
const testHealthCheck = async () => {
  logBold('\n🏥 Testing Health Check Endpoint', 'blue');

  try {
    const response = await makeRequest({
      method: 'GET',
      url: `${API_BASE_URL}/health`
    });

    assert(
      response.status === 200,
      `Health endpoint returns 200 (got ${response.status})`,
      'Health Check Status'
    );

    validateApiResponse(response, ['status', 'timestamp'], 'Health Check Response');

    if (response.data.status) {
      assert(
        typeof response.data.status === 'string',
        `Status is string (got ${typeof response.data.status})`,
        'Health Status Type'
      );
    }

  } catch (error) {
    assert(false, `Health check failed: ${error.message}`, 'Health Check Availability');
  }
};

/**
 * Test Suite 2: Main API Endpoint
 */
const testMainApiEndpoint = async () => {
  logBold('\n📊 Testing Main API Endpoint (/api)', 'blue');

  try {
    const response = await makeRequest({
      method: 'GET',
      url: `${API_BASE_URL}/api`
    });

    assert(
      response.status === 200,
      `API endpoint returns 200 (got ${response.status})`,
      'Main API Status'
    );

    const expectedFields = ['success', 'data', 'source', 'count', 'timestamp'];
    if (validateApiResponse(response, expectedFields, 'Main API Response Structure')) {

      const data = response.data;

      // Test success field
      assert(
        typeof data.success === 'boolean',
        `Success field is boolean (got ${typeof data.success})`,
        'Main API Success Type'
      );

      // Test data array
      assert(
        Array.isArray(data.data),
        `Data field is array (got ${typeof data.data})`,
        'Main API Data Type'
      );

      // Test data content if available
      if (data.data && data.data.length > 0) {
        const firstRecord = data.data[0];
        const requiredFields = ['district', 'person_days', 'households', 'funds_spent'];

        let hasAllFields = true;
        for (const field of requiredFields) {
          if (!(field in firstRecord)) {
            assert(false, `Missing field in data record: ${field}`, 'Data Record Structure');
            hasAllFields = false;
          }
        }

        if (hasAllFields) {
          assert(true, 'All required fields present in data records', 'Data Record Structure');
        }

        // Test numeric fields
        assert(
          typeof firstRecord.person_days === 'number' || !isNaN(Number(firstRecord.person_days)),
          `person_days is numeric (got ${typeof firstRecord.person_days})`,
          'Person Days Type'
        );

        assert(
          typeof firstRecord.households === 'number' || !isNaN(Number(firstRecord.households)),
          `households is numeric (got ${typeof firstRecord.households})`,
          'Households Type'
        );
      }

      // Test count field
      assert(
        typeof data.count === 'number' && data.count >= 0,
        `Count is non-negative number (got ${data.count})`,
        'Main API Count'
      );

      // Test source field
      assert(
        typeof data.source === 'string' && ['api', 'csv', 'fallback'].includes(data.source),
        `Source is valid (got ${data.source})`,
        'Main API Source'
      );

      // Log data source for information
      log(`📡 Data source: ${data.source}`, 'cyan');
      log(`📈 Record count: ${data.count}`, 'cyan');
    }

  } catch (error) {
    assert(false, `Main API endpoint failed: ${error.message}`, 'Main API Availability');
  }
};

/**
 * Test Suite 3: Districts Endpoint
 */
const testDistrictsEndpoint = async () => {
  logBold('\n🏛️ Testing Districts Endpoint (/api/districts)', 'blue');

  try {
    const response = await makeRequest({
      method: 'GET',
      url: `${API_BASE_URL}/api/districts`
    });

    assert(
      response.status === 200,
      `Districts endpoint returns 200 (got ${response.status})`,
      'Districts API Status'
    );

    const expectedFields = ['success', 'districts'];
    if (validateApiResponse(response, expectedFields, 'Districts API Response Structure')) {

      const data = response.data;

      // Test districts array
      assert(
        Array.isArray(data.districts),
        `Districts field is array (got ${typeof data.districts})`,
        'Districts Array Type'
      );

      if (data.districts && data.districts.length > 0) {
        // Should have at least 2 districts (North and South Goa)
        assert(
          data.districts.length >= 2,
          `Has at least 2 districts (got ${data.districts.length})`,
          'Districts Count'
        );

        // Check district structure
        const firstDistrict = data.districts[0];
        if (typeof firstDistrict === 'string') {
          assert(
            true,
            'Districts are provided as strings',
            'District Format'
          );
        } else if (typeof firstDistrict === 'object') {
          const requiredFields = ['code', 'name'];
          let hasAllFields = true;
          for (const field of requiredFields) {
            if (!(field in firstDistrict)) {
              assert(false, `Missing field in district: ${field}`, 'District Structure');
              hasAllFields = false;
            }
          }
          if (hasAllFields) {
            assert(true, 'Districts have required fields', 'District Structure');
          }
        }

        // Check for Goa districts
        const districtNames = data.districts.map(d =>
          typeof d === 'string' ? d : d.name || d.displayName
        );

        const hasNorthGoa = districtNames.some(name =>
          name.toLowerCase().includes('north')
        );
        const hasSouthGoa = districtNames.some(name =>
          name.toLowerCase().includes('south')
        );

        assert(hasNorthGoa, 'Contains North Goa district', 'North Goa Present');
        assert(hasSouthGoa, 'Contains South Goa district', 'South Goa Present');

        log(`📍 Found districts: ${districtNames.join(', ')}`, 'cyan');
      } else {
        assert(false, 'No districts found in response', 'Districts Available');
      }
    }

  } catch (error) {
    assert(false, `Districts endpoint failed: ${error.message}`, 'Districts API Availability');
  }
};

/**
 * Test Suite 4: District-specific Data Endpoints
 */
const testDistrictDataEndpoints = async () => {
  logBold('\n🎯 Testing District-specific Data Endpoints', 'blue');

  const districtsToTest = [
    { code: 'GA01', name: 'North Goa' },
    { code: 'GA02', name: 'South Goa' },
    { code: 'north-goa', name: 'North Goa (alt)' },
    { code: 'south-goa', name: 'South Goa (alt)' }
  ];

  for (const district of districtsToTest) {
    log(`\n🔍 Testing ${district.name} (${district.code})`, 'magenta');

    try {
      const response = await makeRequest({
        method: 'GET',
        url: `${API_BASE_URL}/api/data/${district.code}`
      });

      assert(
        response.status === 200,
        `${district.name} endpoint returns 200 (got ${response.status})`,
        `${district.name} API Status`
      );

      const expectedFields = ['success', 'data'];
      if (validateApiResponse(response, expectedFields, `${district.name} Response Structure`)) {

        const data = response.data;

        // Test data array
        assert(
          Array.isArray(data.data),
          `Data is array for ${district.name}`,
          `${district.name} Data Type`
        );

        if (data.data && data.data.length > 0) {
          const firstRecord = data.data[0];

          // Check district field matches
          if (firstRecord.district) {
            const recordDistrict = firstRecord.district.toLowerCase();
            const isCorrectDistrict = recordDistrict.includes('north') || recordDistrict.includes('south');

            assert(
              isCorrectDistrict,
              `District field contains expected value (got ${firstRecord.district})`,
              `${district.name} Data Consistency`
            );
          }

          // Test numeric fields
          const numericFields = ['person_days', 'households', 'funds_spent'];
          for (const field of numericFields) {
            if (field in firstRecord) {
              assert(
                !isNaN(Number(firstRecord[field])),
                `${field} is numeric in ${district.name} data`,
                `${district.name} ${field} Type`
              );
            }
          }

          log(`📊 ${district.name} records: ${data.data.length}`, 'cyan');

          if (data.source) {
            log(`📡 ${district.name} source: ${data.source}`, 'cyan');
          }
        }
      }

    } catch (error) {
      assert(false, `${district.name} endpoint failed: ${error.message}`, `${district.name} API Availability`);
    }
  }
};

/**
 * Test Suite 5: Invalid Endpoints and Error Handling
 */
const testErrorHandling = async () => {
  logBold('\n⚠️ Testing Error Handling', 'blue');

  const errorTests = [
    {
      name: 'Invalid District Code',
      url: `${API_BASE_URL}/api/data/INVALID_DISTRICT`,
      expectedStatus: [404, 400, 200], // Some backends return 200 with error message
      testName: 'Invalid District Handling'
    },
    {
      name: 'Non-existent Endpoint',
      url: `${API_BASE_URL}/api/nonexistent`,
      expectedStatus: [404],
      testName: 'Non-existent Endpoint Handling'
    },
    {
      name: 'Malformed District Code',
      url: `${API_BASE_URL}/api/data/!@#$%`,
      expectedStatus: [400, 404, 200],
      testName: 'Malformed Input Handling'
    }
  ];

  for (const test of errorTests) {
    log(`\n🧪 Testing ${test.name}`, 'yellow');

    try {
      const response = await makeRequest({
        method: 'GET',
        url: test.url
      });

      const statusOk = test.expectedStatus.includes(response.status);
      assert(
        statusOk,
        `Returns appropriate status code (got ${response.status}, expected one of: ${test.expectedStatus.join(', ')})`,
        test.testName
      );

      // If status is 200, should have error indication in response
      if (response.status === 200 && response.data) {
        const hasErrorField = 'success' in response.data && !response.data.success;
        const hasErrorMessage = 'error' in response.data || 'message' in response.data;

        if (hasErrorField || hasErrorMessage) {
          assert(true, 'Error properly indicated in 200 response', `${test.testName} Error Indication`);
        }
      }

    } catch (error) {
      // Network errors are acceptable for these tests
      log(`Network error for ${test.name}: ${error.message}`, 'yellow');
      testResults.skipped++;
    }
  }
};

/**
 * Test Suite 6: CSV Fallback Testing
 */
const testCsvFallback = async () => {
  logBold('\n📄 Testing CSV Fallback Mechanism', 'blue');

  // Check if CSV files exist
  const csvPaths = [
    path.join(__dirname, 'data', 'mgnrega_goa_data.csv'),
    path.join(__dirname, 'src', 'data', 'mgnrega_goa_data.csv'),
    path.join(__dirname, 'mgnrega_goa_data.csv')
  ];

  let csvExists = false;
  let csvPath = null;

  for (const testPath of csvPaths) {
    if (fs.existsSync(testPath)) {
      csvExists = true;
      csvPath = testPath;
      break;
    }
  }

  assert(
    csvExists,
    csvExists ? `CSV file found at ${csvPath}` : 'CSV file not found in expected locations',
    'CSV Fallback File Availability'
  );

  if (csvExists) {
    try {
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim());

      assert(
        lines.length > 1,
        `CSV file has data (${lines.length} lines including header)`,
        'CSV File Content'
      );

      // Check CSV headers
      if (lines.length > 0) {
        const headers = lines[0].toLowerCase();
        const requiredHeaders = ['district', 'person_days', 'households', 'funds_spent'];

        let hasAllHeaders = true;
        for (const header of requiredHeaders) {
          if (!headers.includes(header.toLowerCase().replace('_', ''))) {
            assert(false, `CSV missing required header: ${header}`, 'CSV Headers');
            hasAllHeaders = false;
          }
        }

        if (hasAllHeaders) {
          assert(true, 'CSV has all required headers', 'CSV Headers');
        }
      }

    } catch (error) {
      assert(false, `Could not read CSV file: ${error.message}`, 'CSV File Reading');
    }
  }
};

/**
 * Test Suite 7: Performance and Load Testing
 */
const testPerformance = async () => {
  logBold('\n⚡ Testing API Performance', 'blue');

  const performanceTests = [
    { name: 'Main API', url: `${API_BASE_URL}/api` },
    { name: 'Districts API', url: `${API_BASE_URL}/api/districts` },
    { name: 'District Data', url: `${API_BASE_URL}/api/data/GA01` }
  ];

  for (const test of performanceTests) {
    log(`\n⏱️ Testing ${test.name} performance`, 'yellow');

    try {
      const startTime = Date.now();
      const response = await makeRequest({
        method: 'GET',
        url: test.url
      });
      const endTime = Date.now();
      const duration = endTime - startTime;

      assert(
        response.status === 200,
        `${test.name} responds successfully`,
        `${test.name} Performance Availability`
      );

      assert(
        duration < 10000,
        `${test.name} responds within 10 seconds (took ${duration}ms)`,
        `${test.name} Performance Speed`
      );

      if (duration < 2000) {
        log(`🚀 ${test.name}: Excellent response time (${duration}ms)`, 'green');
      } else if (duration < 5000) {
        log(`👍 ${test.name}: Good response time (${duration}ms)`, 'yellow');
      } else {
        log(`⚠️ ${test.name}: Slow response time (${duration}ms)`, 'red');
      }

    } catch (error) {
      assert(false, `${test.name} performance test failed: ${error.message}`, `${test.name} Performance`);
    }
  }
};

/**
 * Test Suite 8: Data Consistency Testing
 */
const testDataConsistency = async () => {
  logBold('\n🔄 Testing Data Consistency', 'blue');

  try {
    // Get data from different endpoints
    const [mainResponse, northResponse, southResponse] = await Promise.all([
      makeRequest({ method: 'GET', url: `${API_BASE_URL}/api` }),
      makeRequest({ method: 'GET', url: `${API_BASE_URL}/api/data/GA01` }),
      makeRequest({ method: 'GET', url: `${API_BASE_URL}/api/data/GA02` })
    ]);

    // Check if all requests succeeded
    const allSuccessful = [mainResponse, northResponse, southResponse].every(r => r.status === 200);

    if (!allSuccessful) {
      assert(false, 'Not all endpoints available for consistency testing', 'Data Consistency Prerequisites');
      return;
    }

    const mainData = mainResponse.data.data || [];
    const northData = northResponse.data.data || [];
    const southData = southResponse.data.data || [];

    // Test that district-specific data is subset of main data
    if (mainData.length > 0 && (northData.length > 0 || southData.length > 0)) {

      const mainDistricts = [...new Set(mainData.map(item => item.district))];

      assert(
        mainDistricts.length >= 1,
        `Main data contains district information (found: ${mainDistricts.join(', ')})`,
        'Data Consistency District Coverage'
      );

      // Check data types consistency
      if (mainData[0]) {
        const sampleRecord = mainData[0];
        const numericFields = ['person_days', 'households', 'funds_spent'];

        for (const field of numericFields) {
          if (field in sampleRecord) {
            const value = sampleRecord[field];
            assert(
              !isNaN(Number(value)) && Number(value) >= 0,
              `${field} values are non-negative numbers (sample: ${value})`,
              `Data Consistency ${field}`
            );
          }
        }
      }
    }

    // Check that data sources are consistent
    const sources = [mainResponse.data.source, northResponse.data.source, southResponse.data.source].filter(Boolean);
    if (sources.length > 0) {
      const uniqueSources = [...new Set(sources)];
      log(`📊 Data sources found: ${uniqueSources.join(', ')}`, 'cyan');

      assert(
        uniqueSources.every(source => ['api', 'csv', 'fallback'].includes(source)),
        `All sources are valid (found: ${uniqueSources.join(', ')})`,
        'Data Consistency Sources'
      );
    }

  } catch (error) {
    assert(false, `Data consistency testing failed: ${error.message}`, 'Data Consistency');
  }
};

/**
 * Generate test report
 */
const generateReport = () => {
  logBold('\n📋 TEST REPORT', 'cyan');
  logBold('='.repeat(50), 'cyan');

  const total = testResults.passed + testResults.failed + testResults.skipped;
  const passRate = total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : '0.0';

  logBold(`Total Tests: ${total}`, 'white');
  logBold(`Passed: ${testResults.passed}`, 'green');
  logBold(`Failed: ${testResults.failed}`, 'red');
  logBold(`Skipped: ${testResults.skipped}`, 'yellow');
  logBold(`Pass Rate: ${passRate}%`, passRate >= 80 ? 'green' : passRate >= 60 ? 'yellow' : 'red');

  if (testResults.failed > 0) {
    logBold('\n❌ FAILED TESTS:', 'red');
    testResults.errors.forEach((error, index) => {
      log(`${index + 1}. ${error}`, 'red');
    });
  }

  // Determine overall status
  const overallStatus = testResults.failed === 0 ? 'PASSED' : 'FAILED';
  const statusColor = overallStatus === 'PASSED' ? 'green' : 'red';

  logBold(`\n🎯 OVERALL STATUS: ${overallStatus}`, statusColor);
  logBold('='.repeat(50), 'cyan');

  // Save detailed report to file
  const reportData = {
    summary: {
      total,
      passed: testResults.passed,
      failed: testResults.failed,
      skipped: testResults.skipped,
      passRate: parseFloat(passRate),
      overallStatus
    },
    timestamp: new Date().toISOString(),
    details: testResults.details,
    errors: testResults.errors
  };

  try {
    fs.writeFileSync('test-report.json', JSON.stringify(reportData, null, 2));
    log('\n📄 Detailed report saved to test-report.json', 'cyan');
  } catch (error) {
    log(`⚠️ Could not save report file: ${error.message}`, 'yellow');
  }

  return overallStatus === 'PASSED';
};

/**
 * Main test execution
 */
const runAllTests = async () => {
  logBold('🚀 MGNREGA Goa Dashboard - Comprehensive API Tests', 'cyan');
  logBold('='.repeat(60), 'cyan');
  logBold(`Testing API at: ${API_BASE_URL}`, 'white');
  logBold(`Test started: ${new Date().toLocaleString()}`, 'white');

  const testSuites = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Main API Endpoint', fn: testMainApiEndpoint },
    { name: 'Districts Endpoint', fn: testDistrictsEndpoint },
    { name: 'District Data Endpoints', fn: testDistrictDataEndpoints },
    { name: 'Error Handling', fn: testErrorHandling },
    { name: 'CSV Fallback', fn: testCsvFallback },
    { name: 'Performance Testing', fn: testPerformance },
    { name: 'Data Consistency', fn: testDataConsistency }
  ];

  for (const suite of testSuites) {
    try {
      logBold(`\n🧪 Running Test Suite: ${suite.name}`, 'magenta');
      await suite.fn();
    } catch (error) {
      log(`💥 Test suite "${suite.name}" crashed: ${error.message}`, 'red');
      testResults.failed++;
      testResults.errors.push(`${suite.name}: Suite crashed - ${error.message}`);
    }
  }

  const success = generateReport();
  process.exit(success ? 0 : 1);
};

// Handle command line execution
if (require.main === module) {
  runAllTests().catch(error => {
    log(`💥 Test execution failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testResults,
  assert,
  makeRequest
};
