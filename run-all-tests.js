/**
 * Master Test Runner for MGNREGA Goa Dashboard
 * Coordinates backend API testing and frontend E2E testing
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const CONFIG = {
  backend: {
    url: process.env.BACKEND_URL || 'http://localhost:5000',
    startCommand: 'npm run dev',
    testScript: 'test-api-comprehensive.js',
    healthEndpoint: '/health',
    startupTimeout: 30000,
    directory: 'backend'
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
    startCommand: 'npm run dev',
    testScript: 'test-frontend-e2e.js',
    startupTimeout: 30000,
    directory: 'frontend'
  },
  test: {
    timeout: 300000, // 5 minutes total timeout
    retries: 2,
    browsers: ['chromium'], // Can add 'firefox', 'webkit'
    parallel: false
  }
};

// Colors for console output
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

const log = (message, color = 'white') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logBold = (message, color = 'white') => {
  console.log(`${colors.bold}${colors[color]}${message}${colors.reset}`);
};

// Global test results
let masterResults = {
  backend: null,
  frontend: null,
  overall: {
    passed: 0,
    failed: 0,
    skipped: 0,
    total: 0,
    startTime: null,
    endTime: null,
    duration: 0
  },
  errors: [],
  summary: null
};

/**
 * Utility functions
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const executeCommand = (command, cwd, timeout = 30000) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, { shell: true, cwd, stdio: 'pipe' });
    let output = '';
    let errorOutput = '';

    const timer = setTimeout(() => {
      process.kill();
      reject(new Error(`Command timed out after ${timeout}ms`));
    }, timeout);

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve({ output, code });
      } else {
        reject(new Error(`Command failed with code ${code}: ${errorOutput}`));
      }
    });

    process.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
};

const checkServerHealth = async (url, timeout = 10000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      // Server not ready yet, wait and retry
    }
    await sleep(2000);
  }
  return false;
};

const startServer = (config, name) => {
  return new Promise((resolve, reject) => {
    logBold(`🚀 Starting ${name} server...`, 'blue');

    const serverProcess = spawn(config.startCommand, {
      shell: true,
      cwd: config.directory,
      stdio: 'pipe',
      detached: true
    });

    let output = '';
    let started = false;

    const startupTimeout = setTimeout(() => {
      if (!started) {
        serverProcess.kill();
        reject(new Error(`${name} server failed to start within ${config.startupTimeout}ms`));
      }
    }, config.startupTimeout);

    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      const dataStr = data.toString();

      // Look for common server startup messages
      if (dataStr.includes('Local:') ||
          dataStr.includes('Server running') ||
          dataStr.includes('ready') ||
          dataStr.includes('listening')) {
        if (!started) {
          started = true;
          clearTimeout(startupTimeout);
          log(`✅ ${name} server started successfully`, 'green');
          resolve({ process: serverProcess, output });
        }
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const errorStr = data.toString();
      if (errorStr.includes('EADDRINUSE') || errorStr.includes('Port') && errorStr.includes('already')) {
        // Server already running - that's okay
        if (!started) {
          started = true;
          clearTimeout(startupTimeout);
          log(`✅ ${name} server already running`, 'yellow');
          resolve({ process: null, output: 'Already running' });
        }
      }
    });

    serverProcess.on('error', (error) => {
      if (!started) {
        clearTimeout(startupTimeout);
        reject(error);
      }
    });
  });
};

const runBackendTests = async () => {
  logBold('\n🧪 Running Backend API Tests', 'magenta');

  try {
    // Check if backend is accessible
    const healthUrl = `${CONFIG.backend.url}${CONFIG.backend.healthEndpoint}`;
    const isHealthy = await checkServerHealth(healthUrl);

    if (!isHealthy) {
      throw new Error('Backend server is not responding to health checks');
    }

    log('✅ Backend server is healthy', 'green');

    // Run backend tests
    const testCommand = `node ${CONFIG.backend.testScript}`;
    const result = await executeCommand(testCommand, CONFIG.backend.directory, CONFIG.test.timeout);

    // Try to read the test report
    const reportPath = path.join(CONFIG.backend.directory, 'test-report.json');
    let testReport = null;

    if (fs.existsSync(reportPath)) {
      const reportData = fs.readFileSync(reportPath, 'utf8');
      testReport = JSON.parse(reportData);
    }

    return {
      success: true,
      output: result.output,
      report: testReport,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    log(`❌ Backend tests failed: ${error.message}`, 'red');
    return {
      success: false,
      error: error.message,
      report: null,
      timestamp: new Date().toISOString()
    };
  }
};

const runFrontendTests = async (browser = 'chromium') => {
  logBold(`\n🖥️ Running Frontend E2E Tests (${browser})`, 'magenta');

  try {
    // Check if frontend is accessible
    const isAccessible = await checkServerHealth(CONFIG.frontend.url);

    if (!isAccessible) {
      throw new Error('Frontend server is not accessible');
    }

    log('✅ Frontend server is accessible', 'green');

    // Run frontend tests
    const testCommand = `node ${CONFIG.frontend.testScript} ${browser}`;
    const result = await executeCommand(testCommand, CONFIG.frontend.directory, CONFIG.test.timeout);

    // Try to read the test report
    const reportPath = path.join(CONFIG.frontend.directory, 'frontend-test-report.json');
    let testReport = null;

    if (fs.existsSync(reportPath)) {
      const reportData = fs.readFileSync(reportPath, 'utf8');
      testReport = JSON.parse(reportData);
    }

    return {
      success: true,
      output: result.output,
      report: testReport,
      browser,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    log(`❌ Frontend tests failed: ${error.message}`, 'red');
    return {
      success: false,
      error: error.message,
      report: null,
      browser,
      timestamp: new Date().toISOString()
    };
  }
};

const generateMasterReport = () => {
  logBold('\n📋 MASTER TEST REPORT', 'cyan');
  logBold('='.repeat(60), 'cyan');

  const duration = masterResults.overall.endTime - masterResults.overall.startTime;

  // Calculate totals
  let totalPassed = 0, totalFailed = 0, totalSkipped = 0, totalTests = 0;

  if (masterResults.backend?.report?.summary) {
    const backend = masterResults.backend.report.summary;
    totalPassed += backend.passed || 0;
    totalFailed += backend.failed || 0;
    totalSkipped += backend.skipped || 0;
    totalTests += backend.total || 0;
  }

  if (masterResults.frontend?.report?.summary) {
    const frontend = masterResults.frontend.report.summary;
    totalPassed += frontend.passed || 0;
    totalFailed += frontend.failed || 0;
    totalSkipped += frontend.skipped || 0;
    totalTests += frontend.total || 0;
  }

  const passRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0.0';

  // Update overall results
  masterResults.overall = {
    ...masterResults.overall,
    passed: totalPassed,
    failed: totalFailed,
    skipped: totalSkipped,
    total: totalTests,
    duration: Math.round(duration / 1000),
    passRate: parseFloat(passRate)
  };

  // Display summary
  logBold(`Test Duration: ${masterResults.overall.duration} seconds`, 'white');
  logBold(`Total Tests: ${totalTests}`, 'white');
  logBold(`Passed: ${totalPassed}`, 'green');
  logBold(`Failed: ${totalFailed}`, 'red');
  logBold(`Skipped: ${totalSkipped}`, 'yellow');
  logBold(`Pass Rate: ${passRate}%`, passRate >= 80 ? 'green' : passRate >= 60 ? 'yellow' : 'red');

  // Backend results
  if (masterResults.backend) {
    logBold('\n🔧 BACKEND RESULTS:', 'blue');
    if (masterResults.backend.success) {
      const report = masterResults.backend.report;
      if (report?.summary) {
        const s = report.summary;
        log(`API Tests: ${s.passed}✅ ${s.failed}❌ ${s.skipped}⏭️ (${s.passRate}%)`,
            s.passRate >= 80 ? 'green' : 'yellow');
      } else {
        log('✅ Backend tests completed successfully', 'green');
      }
    } else {
      log(`❌ Backend tests failed: ${masterResults.backend.error}`, 'red');
    }
  }

  // Frontend results
  if (masterResults.frontend) {
    logBold('\n🖥️ FRONTEND RESULTS:', 'blue');
    if (masterResults.frontend.success) {
      const report = masterResults.frontend.report;
      if (report?.summary) {
        const s = report.summary;
        log(`E2E Tests: ${s.passed}✅ ${s.failed}❌ ${s.skipped}⏭️ (${s.passRate}%)`,
            s.passRate >= 80 ? 'green' : 'yellow');
        if (report.categories) {
          Object.entries(report.categories).forEach(([category, stats]) => {
            const categoryPassRate = ((stats.passed / (stats.passed + stats.failed)) * 100).toFixed(1);
            log(`  ${category}: ${categoryPassRate}%`, categoryPassRate >= 80 ? 'green' : 'yellow');
          });
        }
      } else {
        log('✅ Frontend tests completed successfully', 'green');
      }
    } else {
      log(`❌ Frontend tests failed: ${masterResults.frontend.error}`, 'red');
    }
  }

  // Overall status
  const overallStatus = totalFailed === 0 ? 'PASSED' : 'FAILED';
  const statusColor = overallStatus === 'PASSED' ? 'green' : 'red';

  logBold(`\n🎯 OVERALL STATUS: ${overallStatus}`, statusColor);

  // Recommendations
  logBold('\n💡 RECOMMENDATIONS:', 'cyan');
  if (passRate >= 90) {
    log('🚀 Excellent! Ready for production deployment.', 'green');
  } else if (passRate >= 80) {
    log('👍 Good test coverage. Consider addressing failed tests.', 'yellow');
  } else if (passRate >= 60) {
    log('⚠️ Test coverage needs improvement before production.', 'orange');
  } else {
    log('❌ Significant issues found. Not ready for production.', 'red');
  }

  // Save master report
  const masterReport = {
    summary: masterResults.overall,
    backend: masterResults.backend,
    frontend: masterResults.frontend,
    timestamp: new Date().toISOString(),
    environment: {
      backendUrl: CONFIG.backend.url,
      frontendUrl: CONFIG.frontend.url,
      nodeVersion: process.version,
      platform: process.platform
    }
  };

  try {
    fs.writeFileSync('master-test-report.json', JSON.stringify(masterReport, null, 2));
    log('\n📄 Master report saved to master-test-report.json', 'cyan');
  } catch (error) {
    log(`⚠️ Could not save master report: ${error.message}`, 'yellow');
  }

  logBold('='.repeat(60), 'cyan');

  return overallStatus === 'PASSED';
};

const main = async () => {
  logBold('🚀 MGNREGA Goa Dashboard - Complete Test Suite', 'cyan');
  logBold('='.repeat(60), 'cyan');
  logBold(`Started: ${new Date().toLocaleString()}`, 'white');

  masterResults.overall.startTime = Date.now();

  let backendProcess = null;
  let frontendProcess = null;

  try {
    // Step 1: Check if servers are already running or start them
    logBold('\n📡 Checking Server Status...', 'blue');

    // Check backend
    const backendHealthy = await checkServerHealth(`${CONFIG.backend.url}${CONFIG.backend.healthEndpoint}`);
    if (!backendHealthy) {
      log('Starting backend server...', 'yellow');
      try {
        const backendResult = await startServer(CONFIG.backend, 'Backend');
        backendProcess = backendResult.process;
        await sleep(5000); // Give server time to fully start
      } catch (error) {
        log(`⚠️ Could not start backend server: ${error.message}`, 'yellow');
        log('Assuming backend is already running...', 'yellow');
      }
    } else {
      log('✅ Backend server is already running', 'green');
    }

    // Check frontend
    const frontendAccessible = await checkServerHealth(CONFIG.frontend.url);
    if (!frontendAccessible) {
      log('Starting frontend server...', 'yellow');
      try {
        const frontendResult = await startServer(CONFIG.frontend, 'Frontend');
        frontendProcess = frontendResult.process;
        await sleep(5000); // Give server time to fully start
      } catch (error) {
        log(`⚠️ Could not start frontend server: ${error.message}`, 'yellow');
        log('Assuming frontend is already running...', 'yellow');
      }
    } else {
      log('✅ Frontend server is already accessible', 'green');
    }

    // Step 2: Run Backend Tests
    masterResults.backend = await runBackendTests();

    // Step 3: Run Frontend Tests
    for (const browser of CONFIG.test.browsers) {
      const frontendResult = await runFrontendTests(browser);

      // For now, just keep the last browser result
      // In the future, we could merge results from multiple browsers
      masterResults.frontend = frontendResult;
    }

    // Step 4: Generate Master Report
    masterResults.overall.endTime = Date.now();
    const success = generateMasterReport();

    // Step 5: Cleanup
    logBold('\n🧹 Cleaning up...', 'blue');

    if (backendProcess && !backendProcess.killed) {
      backendProcess.kill();
      log('Backend server stopped', 'gray');
    }

    if (frontendProcess && !frontendProcess.killed) {
      frontendProcess.kill();
      log('Frontend server stopped', 'gray');
    }

    // Exit with appropriate code
    process.exit(success ? 0 : 1);

  } catch (error) {
    log(`💥 Test execution failed: ${error.message}`, 'red');
    masterResults.overall.endTime = Date.now();

    // Cleanup on error
    if (backendProcess && !backendProcess.killed) {
      backendProcess.kill();
    }
    if (frontendProcess && !frontendProcess.killed) {
      frontendProcess.kill();
    }

    generateMasterReport();
    process.exit(1);
  }
};

// Handle command line arguments
const args = process.argv.slice(2);
const options = {
  skipBackend: args.includes('--skip-backend'),
  skipFrontend: args.includes('--skip-frontend'),
  browser: args.find(arg => ['chromium', 'firefox', 'webkit'].includes(arg)) || 'chromium',
  verbose: args.includes('--verbose'),
  help: args.includes('--help') || args.includes('-h')
};

if (options.help) {
  console.log(`
🚀 MGNREGA Goa Dashboard Test Suite

Usage: node run-all-tests.js [options]

Options:
  --skip-backend    Skip backend API tests
  --skip-frontend   Skip frontend E2E tests
  --browser <name>  Browser for E2E tests (chromium, firefox, webkit)
  --verbose         Show detailed output
  --help, -h        Show this help message

Examples:
  node run-all-tests.js                    # Run all tests
  node run-all-tests.js --browser firefox  # Use Firefox for E2E tests
  node run-all-tests.js --skip-backend     # Skip backend tests
  node run-all-tests.js --verbose          # Show verbose output

Environment Variables:
  BACKEND_URL       Backend server URL (default: http://localhost:5000)
  FRONTEND_URL      Frontend server URL (default: http://localhost:5173)
  `);
  process.exit(0);
}

// Update config based on options
if (options.skipBackend) {
  log('⏭️ Skipping backend tests', 'yellow');
}

if (options.skipFrontend) {
  log('⏭️ Skipping frontend tests', 'yellow');
}

CONFIG.test.browsers = [options.browser];

// Handle process termination
process.on('SIGINT', () => {
  log('\n🛑 Test suite interrupted', 'yellow');
  process.exit(1);
});

process.on('SIGTERM', () => {
  log('\n🛑 Test suite terminated', 'yellow');
  process.exit(1);
});

// Run the main function
if (require.main === module) {
  main().catch(error => {
    log(`💥 Unhandled error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = {
  runBackendTests,
  runFrontendTests,
  generateMasterReport,
  masterResults
};
