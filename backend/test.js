import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, url, expectedStatus = 200) {
  try {
    log(`\n🧪 Testing ${name}...`, 'blue');
    log(`   URL: ${url}`, 'cyan');

    const startTime = Date.now();
    const response = await axios.get(url, { timeout: 10000 });
    const duration = Date.now() - startTime;

    if (response.status === expectedStatus) {
      log(`   ✅ Success: ${response.status} (${duration}ms)`, 'green');

      // Log some response details
      if (response.data) {
        if (response.data.success !== undefined) {
          log(`   📊 Success: ${response.data.success}`, 'cyan');
        }
        if (response.data.source) {
          log(`   📄 Source: ${response.data.source}`, 'cyan');
        }
        if (response.data.count !== undefined) {
          log(`   🔢 Count: ${response.data.count}`, 'cyan');
        }
        if (response.data.districts && Array.isArray(response.data.districts)) {
          log(`   📍 Districts: ${response.data.districts.join(', ')}`, 'cyan');
        }
        if (response.data.data && Array.isArray(response.data.data)) {
          log(`   📋 Records: ${response.data.data.length}`, 'cyan');
        }
      }

      return { success: true, status: response.status, data: response.data, duration };
    } else {
      log(`   ❌ Unexpected status: ${response.status} (expected ${expectedStatus})`, 'red');
      return { success: false, status: response.status, duration };
    }

  } catch (error) {
    const duration = Date.now() - startTime;

    if (error.response) {
      log(`   ❌ HTTP Error: ${error.response.status} (${duration}ms)`, 'red');
      log(`   📝 Message: ${error.response.data?.message || error.message}`, 'yellow');
      return { success: false, status: error.response.status, error: error.response.data, duration };
    } else if (error.code === 'ECONNREFUSED') {
      log(`   ❌ Connection refused - Is the server running?`, 'red');
      return { success: false, error: 'Server not running' };
    } else {
      log(`   ❌ Error: ${error.message}`, 'red');
      return { success: false, error: error.message };
    }
  }
}

async function runTests() {
  log('🚀 MGNREGA Goa Dashboard API Tests', 'cyan');
  log('=' .repeat(50), 'cyan');

  const tests = [
    {
      name: 'Server Health Check',
      url: `${BASE_URL}/health`
    },
    {
      name: 'Server Root',
      url: `${BASE_URL}/`
    },
    {
      name: 'All MGNREGA Data',
      url: `${BASE_URL}/api`
    },
    {
      name: 'Districts List',
      url: `${BASE_URL}/api/districts`
    },
    {
      name: 'North Goa Data',
      url: `${BASE_URL}/api/data/North Goa`
    },
    {
      name: 'South Goa Data',
      url: `${BASE_URL}/api/data/South Goa`
    },
    {
      name: 'Invalid District (should still work with mock data)',
      url: `${BASE_URL}/api/data/Invalid District`
    },
    {
      name: 'Non-existent Route (404 test)',
      url: `${BASE_URL}/nonexistent`,
      expectedStatus: 404
    }
  ];

  const results = [];

  for (const test of tests) {
    const result = await testEndpoint(
      test.name,
      test.url,
      test.expectedStatus || 200
    );
    results.push({ ...test, ...result });

    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  log('\n📋 Test Summary', 'cyan');
  log('=' .repeat(30), 'cyan');

  const successful = results.filter(r => r.success).length;
  const total = results.length;

  log(`✅ Successful: ${successful}/${total}`, successful === total ? 'green' : 'yellow');

  if (successful < total) {
    log('\n❌ Failed Tests:', 'red');
    results
      .filter(r => !r.success)
      .forEach(r => {
        log(`   • ${r.name}: ${r.error || `HTTP ${r.status}`}`, 'red');
      });
  }

  log('\n⚡ Performance Summary:', 'cyan');
  const avgDuration = results
    .filter(r => r.duration)
    .reduce((sum, r) => sum + r.duration, 0) / results.filter(r => r.duration).length;

  log(`   Average response time: ${avgDuration.toFixed(0)}ms`, 'cyan');

  const slowTests = results
    .filter(r => r.duration && r.duration > 1000)
    .map(r => `${r.name} (${r.duration}ms)`);

  if (slowTests.length > 0) {
    log(`   ⚠️  Slow responses: ${slowTests.join(', ')}`, 'yellow');
  }

  log('\n🎯 Test completed!', 'cyan');

  // Exit with appropriate code
  process.exit(successful === total ? 0 : 1);
}

// Handle script interruption
process.on('SIGINT', () => {
  log('\n\n⏹️  Test interrupted by user', 'yellow');
  process.exit(1);
});

// Run tests
log('⏳ Starting tests in 2 seconds...', 'yellow');
log('   Make sure the server is running: npm run dev', 'yellow');

setTimeout(runTests, 2000);
