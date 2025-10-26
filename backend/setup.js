#!/usr/bin/env node

/**
 * Setup script for MGNREGA Goa Dashboard Backend
 * Automates installation, configuration, and testing
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Console colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    log(`🚀 Running: ${command} ${args.join(' ')}`, 'blue');

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

  log(`\n🔧 Node.js version: ${nodeVersion}`, 'blue');

  if (majorVersion >= 18) {
    log('✅ Node.js version is compatible', 'green');
    return true;
  } else {
    log('❌ Node.js version 18 or higher is required', 'red');
    log('Please upgrade Node.js: https://nodejs.org/', 'yellow');
    return false;
  }
}

function createEnvFile() {
  const envPath = '.env';
  const envExamplePath = '.env.example';

  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    log('\n📄 Creating .env file from .env.example...', 'blue');
    try {
      fs.copyFileSync(envExamplePath, envPath);
      log('✅ .env file created successfully', 'green');
      log('⚠️  Please update the API_KEY and RESOURCE_ID in .env file', 'yellow');
      return true;
    } catch (error) {
      log('❌ Failed to create .env file:', 'red');
      log(error.message, 'red');
      return false;
    }
  } else if (fs.existsSync(envPath)) {
    log('✅ .env file already exists', 'green');
    return true;
  } else {
    log('⚠️  .env.example file not found', 'yellow');
    return false;
  }
}

function checkRequiredFiles() {
  const requiredFiles = [
    'package.json',
    'src/server.js',
    'src/models/DistrictData.js',
    'src/routes/mgnrega.routes.js',
    'src/controllers/mgnrega.controller.js',
    'src/data/goa_mgnrega.csv'
  ];

  log('\n🔍 Checking required files...', 'blue');
  let allFilesExist = true;

  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`✅ ${file}`, 'green');
    } else {
      log(`❌ ${file} - Missing`, 'red');
      allFilesExist = false;
    }
  });

  return allFilesExist;
}

async function installDependencies() {
  log('\n📦 Installing dependencies...', 'blue');
  try {
    await runCommand('npm', ['install']);
    log('✅ Dependencies installed successfully!', 'green');
    return true;
  } catch (error) {
    log('❌ Failed to install dependencies:', 'red');
    log(error.message, 'red');
    return false;
  }
}

function checkMongoDB() {
  log('\n🍃 MongoDB Setup Instructions', 'magenta');
  log('=' .repeat(35), 'magenta');

  log('\n1. Install MongoDB:', 'bright');
  log('   • Download from: https://www.mongodb.com/try/download/community', 'cyan');
  log('   • Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo', 'cyan');

  log('\n2. Start MongoDB:', 'bright');
  log('   • Windows: net start MongoDB', 'cyan');
  log('   • macOS/Linux: sudo systemctl start mongod', 'cyan');
  log('   • Docker: docker start mongodb', 'cyan');

  log('\n3. MongoDB will be used for caching (optional)', 'bright');
  log('   • Server will work with CSV fallback if MongoDB is unavailable', 'yellow');
}

function showApiInstructions() {
  log('\n🔑 API Configuration (Optional)', 'magenta');
  log('=' .repeat(35), 'magenta');

  log('\n1. Get API Key from data.gov.in:', 'bright');
  log('   • Visit: https://data.gov.in/', 'cyan');
  log('   • Register for an account', 'cyan');
  log('   • Get your API key from the dashboard', 'cyan');

  log('\n2. Find MGNREGA Resource ID:', 'bright');
  log('   • Search for MGNREGA datasets on data.gov.in', 'cyan');
  log('   • Copy the resource ID from the dataset URL', 'cyan');

  log('\n3. Update .env file:', 'bright');
  log('   • API_KEY=your_actual_api_key', 'cyan');
  log('   • RESOURCE_ID=your_actual_resource_id', 'cyan');

  log('\n4. CSV Fallback Available:', 'bright');
  log('   • Server will use sample CSV data if API is not configured', 'yellow');
}

async function testInstallation() {
  log('\n🧪 Testing installation...', 'blue');

  try {
    // Start server in background
    log('Starting server for testing...', 'cyan');
    const serverProcess = spawn('node', ['src/server.js'], {
      stdio: 'pipe',
      detached: true
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Run basic health check
    try {
      const { default: axios } = await import('axios');
      const response = await axios.get('http://localhost:5000/health', { timeout: 5000 });

      if (response.status === 200) {
        log('✅ Server started successfully!', 'green');
        log('✅ Health check passed', 'green');
      } else {
        log('⚠️  Server started but health check failed', 'yellow');
      }
    } catch (error) {
      log('❌ Server test failed:', 'red');
      log('   This might be normal if dependencies are missing', 'yellow');
    }

    // Kill server process
    serverProcess.kill();

    return true;
  } catch (error) {
    log('⚠️  Installation test inconclusive', 'yellow');
    return false;
  }
}

function showNextSteps() {
  log('\n🎯 Next Steps', 'magenta');
  log('=' .repeat(20), 'magenta');

  log('\n1. Start the server:', 'bright');
  log('   npm run dev  (development with auto-reload)', 'green');
  log('   npm start    (production mode)', 'green');

  log('\n2. Test the API:', 'bright');
  log('   curl http://localhost:5000/health', 'cyan');
  log('   curl http://localhost:5000/api/districts', 'cyan');
  log('   curl "http://localhost:5000/api/data/North%20Goa"', 'cyan');

  log('\n3. Run automated tests:', 'bright');
  log('   node test.js', 'green');

  log('\n4. Access endpoints:', 'bright');
  log('   http://localhost:5000/health - Health check', 'cyan');
  log('   http://localhost:5000/api - All data', 'cyan');
  log('   http://localhost:5000/api/districts - Districts list', 'cyan');
  log('   http://localhost:5000/api/data/:district - District data', 'cyan');
}

async function main() {
  log('\n🎉 MGNREGA Goa Dashboard Backend Setup', 'bright');
  log('=' .repeat(45), 'bright');

  // Check Node.js version
  if (!checkNodeVersion()) {
    process.exit(1);
  }

  // Check required files
  if (!checkRequiredFiles()) {
    log('\n❌ Setup incomplete - missing required files', 'red');
    process.exit(1);
  }

  // Create .env file
  createEnvFile();

  // Install dependencies
  if (process.argv.includes('--skip-install')) {
    log('\n⏭️  Skipping dependency installation', 'yellow');
  } else {
    const installSuccess = await installDependencies();
    if (!installSuccess) {
      log('\n❌ Setup failed during dependency installation', 'red');
      process.exit(1);
    }
  }

  // Test installation
  if (process.argv.includes('--test')) {
    await testInstallation();
  }

  // Show additional instructions
  checkMongoDB();
  showApiInstructions();
  showNextSteps();

  log('\n✨ Setup completed successfully!', 'green');
  log('🚀 Ready to start development!', 'green');

  // Auto-start server if requested
  if (process.argv.includes('--start')) {
    log('\n🚀 Starting development server...', 'blue');
    try {
      await runCommand('npm', ['run', 'dev']);
    } catch (error) {
      log('❌ Failed to start server:', 'red');
      log('Run manually: npm run dev', 'yellow');
    }
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('\n📋 Setup Script Help', 'cyan');
  log('Usage: node setup.js [options]', 'bright');
  log('\nOptions:', 'bright');
  log('  --help, -h        Show this help message', 'cyan');
  log('  --skip-install    Skip npm install', 'cyan');
  log('  --test           Test the installation', 'cyan');
  log('  --start          Start dev server after setup', 'cyan');
  log('\nExamples:', 'bright');
  log('  node setup.js                    # Full setup', 'green');
  log('  node setup.js --test --start     # Setup, test, and start', 'green');
  log('  node setup.js --skip-install     # Setup without npm install', 'green');
  process.exit(0);
}

// Run main function
main().catch((error) => {
  log('\n💥 Setup failed:', 'red');
  log(error.message, 'red');
  process.exit(1);
});
