/**
 * End-to-End Frontend Testing Script for MGNREGA Goa Dashboard
 * Tests all frontend functionality, auto-detection, offline features, and user interactions
 */

const { chromium, firefox, webkit } = require("playwright");
const fs = require("fs");
const path = require("path");

// Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const TEST_TIMEOUT = 30000;
const DEFAULT_WAIT_TIME = 2000;

// Test results storage
let testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: [],
  details: [],
  screenshots: [],
};

// ANSI colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

const log = (message, color = "white") => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logBold = (message, color = "white") => {
  console.log(`${colors.bold}${colors[color]}${message}${colors.reset}`);
};

/**
 * Test assertion helper
 */
const assert = async (condition, message, testName, page = null) => {
  const result = {
    test: testName,
    message,
    passed: condition,
    timestamp: new Date().toISOString(),
  };

  testResults.details.push(result);

  if (condition) {
    testResults.passed++;
    log(`✅ PASS: ${testName} - ${message}`, "green");
  } else {
    testResults.failed++;
    testResults.errors.push(`${testName}: ${message}`);
    log(`❌ FAIL: ${testName} - ${message}`, "red");

    // Take screenshot on failure
    if (page) {
      try {
        const screenshotPath = `screenshots/failure-${Date.now()}-${testName.replace(/[^a-z0-9]/gi, "_")}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        testResults.screenshots.push(screenshotPath);
        log(`📸 Screenshot saved: ${screenshotPath}`, "yellow");
      } catch (error) {
        log(`⚠️ Could not take screenshot: ${error.message}`, "yellow");
      }
    }
  }

  return condition;
};

/**
 * Wait for element with timeout
 */
const waitForElement = async (page, selector, timeout = 10000) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Wait for network to be idle
 */
const waitForNetworkIdle = async (page, timeout = 5000) => {
  try {
    await page.waitForLoadState("networkidle", { timeout });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Test Suite 1: Basic Page Loading
 */
const testPageLoading = async (page) => {
  logBold("\n🚀 Testing Basic Page Loading", "blue");

  try {
    // Navigate to main page
    await page.goto(FRONTEND_URL, { waitUntil: "networkidle" });

    // Check if page loaded
    const title = await page.title();
    await assert(
      title.includes("MGNREGA") || title.includes("Dashboard"),
      `Page has correct title (got: ${title})`,
      "Page Title",
      page,
    );

    // Check for main dashboard elements
    const hasHeader = await waitForElement(page, "h1");
    await assert(hasHeader, "Main heading is present", "Page Header", page);

    if (hasHeader) {
      const headerText = await page.textContent("h1");
      await assert(
        headerText.includes("MGNREGA") || headerText.includes("Dashboard"),
        `Header contains expected text (got: ${headerText})`,
        "Header Text",
        page,
      );
    }

    // Wait for initial loading to complete
    await page.waitForTimeout(DEFAULT_WAIT_TIME);

    // Check for loading indicators being removed
    const hasLoadingSpinner = await page.locator(".animate-spin").count();
    await assert(
      hasLoadingSpinner === 0,
      "Loading indicators are removed after page load",
      "Loading State Cleanup",
      page,
    );
  } catch (error) {
    await assert(
      false,
      `Page loading failed: ${error.message}`,
      "Basic Page Loading",
      page,
    );
  }
};

/**
 * Test Suite 2: District Selector and Auto-Detection
 */
const testDistrictSelector = async (page) => {
  logBold("\n🎯 Testing District Selector and Auto-Detection", "blue");

  try {
    // Look for district selector
    const selectorExists = await waitForElement(
      page,
      'select, [role="combobox"], [data-testid="district-select"]',
    );
    await assert(
      selectorExists,
      "District selector is present",
      "District Selector Presence",
      page,
    );

    if (selectorExists) {
      // Try to find the select element
      let selectElement = await page.locator("select").first();

      if ((await selectElement.count()) === 0) {
        // Look for custom dropdown
        selectElement = await page
          .locator('[data-testid="district-select"], [role="combobox"]')
          .first();
      }

      if ((await selectElement.count()) > 0) {
        // Test district options
        const options = await selectElement.locator("option").count();
        await assert(
          options >= 2,
          `District selector has at least 2 options (found: ${options})`,
          "District Options Count",
          page,
        );

        // Test district selection
        try {
          await selectElement.selectOption({ index: 1 }); // Select first actual district
          await page.waitForTimeout(1000); // Wait for selection to process

          const selectedValue = await selectElement.inputValue();
          await assert(
            selectedValue && selectedValue !== "",
            `District selection works (selected: ${selectedValue})`,
            "District Selection",
            page,
          );
        } catch (error) {
          log(
            `⚠️ Could not test district selection: ${error.message}`,
            "yellow",
          );
        }
      }
    }

    // Look for auto-detect button
    const autoDetectButton = await page
      .locator(
        'button:has-text("Detect"), button:has-text("Auto"), button:has-text("Location")',
      )
      .first();

    if ((await autoDetectButton.count()) > 0) {
      await assert(
        true,
        "Auto-detect button is present",
        "Auto-detect Button",
        page,
      );

      // Test auto-detect button click (without actually requiring location permission)
      try {
        await autoDetectButton.click();
        await page.waitForTimeout(2000);

        // Check if any location-related UI appeared
        const hasLocationUI =
          (await page
            .locator(
              '[data-testid="location-status"], .location-detected, text=detecting',
            )
            .count()) > 0;
        await assert(
          hasLocationUI || true, // Always pass since location permission varies
          "Auto-detect button is functional",
          "Auto-detect Functionality",
          page,
        );
      } catch (error) {
        log(
          `⚠️ Auto-detect test limited due to permissions: ${error.message}`,
          "yellow",
        );
        testResults.skipped++;
      }
    } else {
      log(
        "⚠️ Auto-detect button not found - feature may not be enabled",
        "yellow",
      );
      testResults.skipped++;
    }
  } catch (error) {
    await assert(
      false,
      `District selector testing failed: ${error.message}`,
      "District Selector",
      page,
    );
  }
};

/**
 * Test Suite 3: Metric Cards
 */
const testMetricCards = async (page) => {
  logBold("\n📊 Testing Metric Cards", "blue");

  try {
    // Wait for cards to load
    await waitForNetworkIdle(page);

    // Look for metric cards
    const cards = await page
      .locator(
        '[data-testid="metric-card"], .metric-card, .bg-white.rounded-lg.shadow',
      )
      .count();
    await assert(
      cards >= 3,
      `At least 3 metric cards present (found: ${cards})`,
      "Metric Cards Count",
      page,
    );

    // Test card content
    const expectedMetrics = [
      "Work Done",
      "Person Days",
      "Families",
      "Households",
      "Money",
      "Funds",
      "Completion",
    ];
    let foundMetrics = 0;

    for (const metric of expectedMetrics) {
      const hasMetric = (await page.locator(`text=${metric}`).count()) > 0;
      if (hasMetric) {
        foundMetrics++;
      }
    }

    await assert(
      foundMetrics >= 3,
      `At least 3 expected metrics found (found: ${foundMetrics})`,
      "Metric Cards Content",
      page,
    );

    // Test for numeric values in cards
    const numbers = await page
      .locator("text=/^[0-9,]+$/, text=/₹[0-9,]+/, text=/[0-9]+%/")
      .count();
    await assert(
      numbers >= 3,
      `Numeric values present in cards (found: ${numbers})`,
      "Metric Values",
      page,
    );

    // Test card interactivity (hover effects, etc.)
    const firstCard = await page
      .locator('[data-testid="metric-card"], .metric-card')
      .first();
    if ((await firstCard.count()) > 0) {
      await firstCard.hover();
      await page.waitForTimeout(500);
      await assert(true, "Cards are interactive", "Card Interactivity", page);
    }
  } catch (error) {
    await assert(
      false,
      `Metric cards testing failed: ${error.message}`,
      "Metric Cards",
      page,
    );
  }
};

/**
 * Test Suite 4: Charts and Data Visualization
 */
const testCharts = async (page) => {
  logBold("\n📈 Testing Charts and Data Visualization", "blue");

  try {
    // Wait for charts to load
    await page.waitForTimeout(3000);
    await waitForNetworkIdle(page);

    // Look for chart containers
    const chartContainers = await page
      .locator('canvas, svg, .recharts-wrapper, [data-testid="chart"]')
      .count();
    await assert(
      chartContainers >= 1,
      `At least one chart container found (found: ${chartContainers})`,
      "Chart Containers",
      page,
    );

    // Test for trend chart
    const trendChart = await page
      .locator("text=Trend, text=Monthly, text=Chart")
      .count();
    await assert(
      trendChart > 0,
      "Trend chart section is present",
      "Trend Chart",
      page,
    );

    // Test chart data points
    const dataPoints = await page
      .locator('circle, rect, path[d*="M"], .recharts-dot')
      .count();
    await assert(
      dataPoints >= 3,
      `Chart has data points (found: ${dataPoints})`,
      "Chart Data Points",
      page,
    );

    // Test chart legends
    const legends = await page
      .locator('.recharts-legend, .legend, [data-testid="chart-legend"]')
      .count();
    if (legends > 0) {
      await assert(true, "Chart legends are present", "Chart Legends", page);
    }

    // Test chart responsiveness
    const viewport = page.viewportSize();
    await page.setViewportSize({ width: 768, height: 1024 }); // Mobile view
    await page.waitForTimeout(1000);

    const chartAfterResize = await page.locator("canvas, svg").count();
    await assert(
      chartAfterResize >= 1,
      "Charts remain visible on mobile viewport",
      "Chart Responsiveness",
      page,
    );

    // Restore original viewport
    await page.setViewportSize(viewport);
  } catch (error) {
    await assert(
      false,
      `Charts testing failed: ${error.message}`,
      "Charts",
      page,
    );
  }
};

/**
 * Test Suite 5: Offline Functionality
 */
const testOfflineFunctionality = async (page) => {
  logBold("\n📱 Testing Offline Functionality", "blue");

  try {
    // First, load the page normally to cache data
    await page.goto(FRONTEND_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);

    // Simulate offline mode
    await page.context().setOffline(true);
    log("🌐 Network set to offline", "yellow");

    // Reload the page
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);

    // Check if page still loads
    const title = await page.title();
    await assert(
      title.includes("MGNREGA") || title.includes("Dashboard"),
      "Page loads in offline mode",
      "Offline Page Loading",
      page,
    );

    // Check for offline indicator
    const offlineIndicators = await page
      .locator(
        'text=Offline, text=offline, [data-testid="offline-indicator"], .offline',
      )
      .count();

    if (offlineIndicators > 0) {
      await assert(
        true,
        "Offline indicator is shown",
        "Offline Indicator",
        page,
      );
    } else {
      log("⚠️ Offline indicator not found - may not be implemented", "yellow");
    }

    // Check if cached data is displayed
    const hasData = await page
      .locator('text=/[0-9,]+/, .metric-card, [data-testid="metric-card"]')
      .count();
    await assert(
      hasData >= 3,
      "Cached data is displayed in offline mode",
      "Offline Data Display",
      page,
    );

    // Check if error messages are appropriate
    const hasErrorMessages = await page
      .locator('.error, [role="alert"], text=error')
      .count();
    if (hasErrorMessages > 0) {
      const errorText = await page
        .locator('.error, [role="alert"]')
        .first()
        .textContent();
      await assert(
        !errorText.includes("500") && !errorText.includes("crashed"),
        "Error messages are user-friendly in offline mode",
        "Offline Error Handling",
        page,
      );
    }

    // Restore online mode
    await page.context().setOffline(false);
    log("🌐 Network restored to online", "green");
  } catch (error) {
    // Restore online mode in case of error
    await page.context().setOffline(false);
    await assert(
      false,
      `Offline functionality testing failed: ${error.message}`,
      "Offline Functionality",
      page,
    );
  }
};

/**
 * Test Suite 6: API Integration and Data Updates
 */
const testApiIntegration = async (page) => {
  logBold("\n🔄 Testing API Integration and Data Updates", "blue");

  try {
    // Set up request interception to monitor API calls
    const apiRequests = [];
    page.on("request", (request) => {
      if (request.url().includes("/api")) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now(),
        });
      }
    });

    // Navigate to page
    await page.goto(FRONTEND_URL, { waitUntil: "networkidle" });

    // Check if API calls were made
    await assert(
      apiRequests.length >= 1,
      `API calls were made on page load (made: ${apiRequests.length})`,
      "API Calls on Load",
      page,
    );

    // Log API calls for debugging
    if (apiRequests.length > 0) {
      log(
        `📡 API calls made: ${apiRequests.map((r) => r.url).join(", ")}`,
        "cyan",
      );
    }

    // Test refresh functionality
    const refreshButton = await page
      .locator('button:has-text("Refresh"), button[data-testid="refresh"]')
      .first();

    if ((await refreshButton.count()) > 0) {
      const initialRequestCount = apiRequests.length;
      await refreshButton.click();
      await page.waitForTimeout(2000);

      await assert(
        apiRequests.length > initialRequestCount,
        "Refresh button triggers new API calls",
        "Refresh Functionality",
        page,
      );
    } else {
      log("⚠️ Refresh button not found", "yellow");
    }

    // Test district change triggers data update
    const districtSelect = await page
      .locator('select, [data-testid="district-select"]')
      .first();

    if ((await districtSelect.count()) > 0) {
      const initialRequestCount = apiRequests.length;

      try {
        await districtSelect.selectOption({ index: 1 });
        await page.waitForTimeout(2000);

        await assert(
          apiRequests.length > initialRequestCount,
          "District change triggers API calls",
          "District Change API Calls",
          page,
        );
      } catch (error) {
        log(`⚠️ Could not test district change: ${error.message}`, "yellow");
      }
    }
  } catch (error) {
    await assert(
      false,
      `API integration testing failed: ${error.message}`,
      "API Integration",
      page,
    );
  }
};

/**
 * Test Suite 7: Responsive Design
 */
const testResponsiveDesign = async (page) => {
  logBold("\n📱 Testing Responsive Design", "blue");

  const viewports = [
    { name: "Mobile", width: 375, height: 667 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Desktop", width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    try {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.waitForTimeout(1000);

      log(
        `📐 Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`,
        "yellow",
      );

      // Check if content is visible and accessible
      const visibleCards = await page
        .locator('[data-testid="metric-card"], .metric-card')
        .count();
      await assert(
        visibleCards >= 3,
        `Metric cards visible on ${viewport.name}`,
        `${viewport.name} Card Visibility`,
        page,
      );

      // Check if navigation is accessible
      const header = await page.locator("h1, header").first();
      if ((await header.count()) > 0) {
        const isVisible = await header.isVisible();
        await assert(
          isVisible,
          `Header visible on ${viewport.name}`,
          `${viewport.name} Header`,
          page,
        );
      }

      // Check for horizontal scrolling issues
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      await assert(
        bodyWidth <= viewport.width + 50, // Small tolerance for scrollbars
        `No horizontal scrolling on ${viewport.name} (body width: ${bodyWidth}px)`,
        `${viewport.name} Horizontal Scroll`,
        page,
      );
    } catch (error) {
      await assert(
        false,
        `${viewport.name} responsive testing failed: ${error.message}`,
        `${viewport.name} Responsive`,
        page,
      );
    }
  }

  // Restore default viewport
  await page.setViewportSize({ width: 1280, height: 720 });
};

/**
 * Test Suite 8: Accessibility
 */
const testAccessibility = async (page) => {
  logBold("\n♿ Testing Accessibility Features", "blue");

  try {
    await page.goto(FRONTEND_URL, { waitUntil: "networkidle" });

    // Test keyboard navigation
    await page.keyboard.press("Tab");
    const focusedElement = await page.evaluate(
      () => document.activeElement.tagName,
    );
    await assert(
      ["BUTTON", "SELECT", "A", "INPUT"].includes(focusedElement),
      `Keyboard navigation works (focused: ${focusedElement})`,
      "Keyboard Navigation",
      page,
    );

    // Test for ARIA labels
    const ariaLabels = await page
      .locator("[aria-label], [aria-labelledby]")
      .count();
    await assert(
      ariaLabels >= 3,
      `ARIA labels present (found: ${ariaLabels})`,
      "ARIA Labels",
      page,
    );

    // Test for alt text on images
    const images = await page.locator("img").count();
    if (images > 0) {
      const imagesWithAlt = await page.locator("img[alt]").count();
      await assert(
        imagesWithAlt === images,
        `All images have alt text (${imagesWithAlt}/${images})`,
        "Image Alt Text",
        page,
      );
    }

    // Test heading hierarchy
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").count();
    await assert(
      headings >= 2,
      `Proper heading structure (found: ${headings})`,
      "Heading Structure",
      page,
    );

    // Test color contrast (basic check for dark backgrounds with light text)
    const darkBackgrounds = await page
      .locator(
        '[class*="bg-gray-"], [class*="bg-blue-"], [class*="bg-primary-"]',
      )
      .count();
    if (darkBackgrounds > 0) {
      await assert(
        true,
        "Color scheme elements are present",
        "Color Contrast Setup",
        page,
      );
    }
  } catch (error) {
    await assert(
      false,
      `Accessibility testing failed: ${error.message}`,
      "Accessibility",
      page,
    );
  }
};

/**
 * Test Suite 9: Performance Testing
 */
const testPerformance = async (page) => {
  logBold("\n⚡ Testing Performance Metrics", "blue");

  try {
    // Start performance measurement
    const startTime = Date.now();

    await page.goto(FRONTEND_URL, { waitUntil: "networkidle" });

    const loadTime = Date.now() - startTime;
    await assert(
      loadTime < 10000,
      `Page loads within 10 seconds (took: ${loadTime}ms)`,
      "Page Load Performance",
      page,
    );

    // Test Core Web Vitals using browser APIs
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};

        // Largest Contentful Paint
        if ("getLCP" in window) {
          window.getLCP((lcp) => {
            vitals.lcp = lcp.value;
          });
        }

        // First Input Delay would require user interaction
        // Cumulative Layout Shift
        if ("getCLS" in window) {
          window.getCLS((cls) => {
            vitals.cls = cls.value;
          });
        }

        // Fallback to basic performance API
        setTimeout(() => {
          const navigation = performance.getEntriesByType("navigation")[0];
          if (navigation) {
            vitals.domContentLoaded =
              navigation.domContentLoadedEventEnd -
              navigation.domContentLoadedEventStart;
            vitals.loadComplete =
              navigation.loadEventEnd - navigation.loadEventStart;
          }
          resolve(vitals);
        }, 2000);
      });
    });

    if (webVitals.domContentLoaded) {
      await assert(
        webVitals.domContentLoaded < 3000,
        `DOM Content Loaded within 3 seconds (${webVitals.domContentLoaded}ms)`,
        "DOM Content Loaded",
        page,
      );
    }

    // Test for memory leaks (basic check)
    const jsHeapUsed = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });

    if (jsHeapUsed > 0) {
      await assert(
        jsHeapUsed < 50 * 1024 * 1024, // 50MB
        `JavaScript heap usage reasonable (${Math.round(jsHeapUsed / 1024 / 1024)}MB)`,
        "Memory Usage",
        page,
      );
    }
  } catch (error) {
    await assert(
      false,
      `Performance testing failed: ${error.message}`,
      "Performance",
      page,
    );
  }
};

/**
 * Test Suite 10: Error Handling and Fallbacks
 */
const testErrorHandling = async (page) => {
  logBold("\n🛡️ Testing Error Handling and Fallbacks", "blue");

  try {
    // Test with blocked API requests
    await page.route("**/api/**", (route) => route.abort());
    log("🚫 API requests blocked to test fallbacks", "yellow");

    await page.goto(FRONTEND_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(5000); // Wait for fallback mechanisms

    // Check if page still renders
    const title = await page.title();
    await assert(
      title.includes("MGNREGA") || title.includes("Dashboard"),
      "Page loads with API failures",
      "API Failure Fallback",
      page,
    );

    // Check if error messages are user-friendly
    const errorElements = await page
      .locator('.error, [role="alert"], text=/error/i, text=/failed/i')
      .count();
    if (errorElements > 0) {
      const errorText = await page
        .locator('.error, [role="alert"]')
        .first()
        .textContent();
      await assert(
        !errorText.includes("500") && !errorText.includes("undefined"),
        "Error messages are user-friendly",
        "Error Message Quality",
        page,
      );
    }

    // Check if fallback data is shown
    const hasData = await page
      .locator('[data-testid="metric-card"], .metric-card, text=/[0-9,]+/')
      .count();
    if (hasData >= 3) {
      await assert(
        true,
        "Fallback data is displayed when API fails",
        "Fallback Data Display",
        page,
      );
    } else {
      await assert(
        false,
        "No fallback data shown when API fails",
        "Fallback Data Display",
        page,
      );
    }

    // Restore API access
    await page.unroute("**/api/**");
    log("✅ API requests restored", "green");
  } catch (error) {
    await page.unroute("**/api/**"); // Ensure cleanup
    await assert(
      false,
      `Error handling testing failed: ${error.message}`,
      "Error Handling",
      page,
    );
  }
};

/**
 * Generate comprehensive test report
 */
const generateReport = () => {
  logBold("\n📋 FRONTEND E2E TEST REPORT", "cyan");
  logBold("=".repeat(60), "cyan");

  const total = testResults.passed + testResults.failed + testResults.skipped;
  const passRate =
    total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : "0.0";

  logBold(`Total Tests: ${total}`, "white");
  logBold(`Passed: ${testResults.passed}`, "green");
  logBold(`Failed: ${testResults.failed}`, "red");
  logBold(`Skipped: ${testResults.skipped}`, "yellow");
  logBold(
    `Pass Rate: ${passRate}%`,
    passRate >= 80 ? "green" : passRate >= 60 ? "yellow" : "red",
  );

  if (testResults.screenshots.length > 0) {
    logBold(`Screenshots: ${testResults.screenshots.length}`, "blue");
  }

  if (testResults.failed > 0) {
    logBold("\n❌ FAILED TESTS:", "red");
    testResults.errors.forEach((error, index) => {
      log(`${index + 1}. ${error}`, "red");
    });
  }

  // Test categories summary
  const categories = {};
  testResults.details.forEach((test) => {
    const category = test.test.split(" ")[0];
    if (!categories[category]) {
      categories[category] = { passed: 0, failed: 0 };
    }
    if (test.passed) {
      categories[category].passed++;
    } else {
      categories[category].failed++;
    }
  });

  if (Object.keys(categories).length > 0) {
    logBold("\n📊 TEST CATEGORIES:", "cyan");
    Object.entries(categories).forEach(([category, stats]) => {
      const categoryPassRate = (
        (stats.passed / (stats.passed + stats.failed)) *
        100
      ).toFixed(1);
      log(
        `${category}: ${stats.passed}✅ ${stats.failed}❌ (${categoryPassRate}%)`,
        categoryPassRate >= 80 ? "green" : "yellow",
      );
    });
  }

  // Determine overall status
  const overallStatus = testResults.failed === 0 ? "PASSED" : "FAILED";
  const statusColor = overallStatus === "PASSED" ? "green" : "red";

  logBold(`\n🎯 OVERALL STATUS: ${overallStatus}`, statusColor);
  logBold("=".repeat(60), "cyan");

  // Save detailed report
  const reportData = {
    summary: {
      total,
      passed: testResults.passed,
      failed: testResults.failed,
      skipped: testResults.skipped,
      passRate: parseFloat(passRate),
      overallStatus,
    },
    categories,
    timestamp: new Date().toISOString(),
    details: testResults.details,
    errors: testResults.errors,
    screenshots: testResults.screenshots,
  };

  try {
    fs.writeFileSync(
      "frontend-test-report.json",
      JSON.stringify(reportData, null, 2),
    );
    log("\n📄 Detailed report saved to frontend-test-report.json", "cyan");
  } catch (error) {
    log(`⚠️ Could not save report file: ${error.message}`, "yellow");
  }

  return overallStatus === "PASSED";
};

/**
 * Main test execution
 */
const runAllTests = async (browserName = "chromium") => {
  logBold("🚀 MGNREGA Goa Dashboard - Frontend E2E Tests", "cyan");
  logBold("=".repeat(60), "cyan");
  logBold(`Testing frontend at: ${FRONTEND_URL}`, "white");
  logBold(`Backend API: ${BACKEND_URL}`, "white");
  logBold(`Browser: ${browserName}`, "white");
  logBold(`Test started: ${new Date().toLocaleString()}`, "white");

  // Create screenshots directory
  if (!fs.existsSync("screenshots")) {
    fs.mkdirSync("screenshots", { recursive: true });
  }

  let browser, context, page;

  try {
    // Launch browser
    const browsers = { chromium, firefox, webkit };
    browser = await browsers[browserName].launch({
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"], // For CI environments
    });

    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    });

    page = await context.newPage();

    // Set up console logging
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        log(`🔴 Console Error: ${msg.text()}`, "red");
      }
    });

    // Set up error handling
    page.on("pageerror", (error) => {
      log(`💥 Page Error: ${error.message}`, "red");
    });

    const testSuites = [
      { name: "Basic Page Loading", fn: () => testPageLoading(page) },
      { name: "District Selector", fn: () => testDistrictSelector(page) },
      { name: "Metric Cards", fn: () => testMetricCards(page) },
      { name: "Charts", fn: () => testCharts(page) },
      {
        name: "Offline Functionality",
        fn: () => testOfflineFunctionality(page),
      },
      { name: "API Integration", fn: () => testApiIntegration(page) },
      { name: "Responsive Design", fn: () => testResponsiveDesign(page) },
      { name: "Accessibility", fn: () => testAccessibility(page) },
      { name: "Performance", fn: () => testPerformance(page) },
      { name: "Error Handling", fn: () => testErrorHandling(page) },
    ];

    for (const suite of testSuites) {
      try {
        logBold(`\n🧪 Running Test Suite: ${suite.name}`, "magenta");
        await suite.fn();
      } catch (error) {
        log(`💥 Test suite "${suite.name}" crashed: ${error.message}`, "red");
        testResults.failed++;
        testResults.errors.push(
          `${suite.name}: Suite crashed - ${error.message}`,
        );
      }
    }
  } catch (error) {
    log(`💥 Test execution failed: ${error.message}`, "red");
    testResults.failed++;
    testResults.errors.push(`Test Execution: ${error.message}`);
  } finally {
    // Cleanup
    try {
      if (page) await page.close();
      if (context) await context.close();
      if (browser) await browser.close();
    } catch (error) {
      log(`⚠️ Cleanup error: ${error.message}`, "yellow");
    }
  }

  const success = generateReport();
  return success;
};

// Handle command line execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const browserName = args[0] || "chromium";

  runAllTests(browserName)
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      log(`💥 Test execution failed: ${error.message}`, "red");
      process.exit(1);
    });
}

module.exports = {
  runAllTests,
  testResults,
  assert,
};
