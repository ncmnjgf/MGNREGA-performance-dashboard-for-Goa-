#!/usr/bin/env node

/**
 * Development startup script for MGNREGA Goa Dashboard Backend
 * This script helps with initial setup and provides useful development commands
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Console colors for better output
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

function checkFileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

function checkEnvironmentSetup() {
  log('\n🔍 Checking environment setup...', 'blue');

  const checks = [
    { file: '.env', name: 'Environment file' },
    { file: 'package.json', name: 'Package configuration' },
    { file: 'src/server.js', name: 'Main server file' }
  ];

  let allGood = true;

  checks.forEach(check => {
    if (checkFileExists(check.file)) {
      log(`✅ ${check.name} found`, 'green');
    } else {
      log(`❌ ${check.name} missing`, 'red');
      allGood = false;
    }
  });

  return allGood;
}

function displayHelp() {
  log('\n📋 MGNREGA Goa Dashboard - Backend Development Helper', 'cyan');
  log('=' .repeat(60), 'cyan');

  log('\nAvailable commands:', 'bright');
  log('  npm start        - Start production server', 'green');
  log('  npm run dev      - Start development server with auto-reload', 'green');
  log('  node start.js    - Run this setup helper', 'yellow');

  log('\nAPI Endpoints (once server is running):', 'bright');
  log('  GET  http://localhost:5000/health', 'cyan');
  log('  GET  http://localhost:5000/api', 'cyan');
  log('  GET  http://localhost:5000/api/districts', 'cyan');
  log('  GET  http://localhost:5000/api/data/GA01', 'cyan');
  log('  POST http://localhost:5000/api/cache/refresh', 'cyan');

  log('\nEnvironment Setup:', 'bright');
  log('  1. Install MongoDB locally or use cloud instance', 'yellow');
  log('  2. Update .env file with your configuration', 'yellow');
  log('  3. Run: npm install', 'yellow');
  log('  4. Run: npm run dev', 'yellow');
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    log(`\n🚀 Running: ${command} ${args.join(' ')}`, 'blue');

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

async function installDependencies() {
  log('\n📦 Installing dependencies...', 'blue');
  try {
    await runCommand('npm', ['install']);
    log('✅ Dependencies installed successfully!', 'green');
  } catch (error) {
    log('❌ Failed to install dependencies', 'red');
    log(error.message, 'red');
    return false;
  }
  return true;
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

function showQuickStart() {
  log('\n🚀 Quick Start Guide', 'magenta');
  log('=' .repeat(30), 'magenta');

  log('\n1. Prerequisites:', 'bright');
  log('   - Node.js 18+', 'yellow');
  log('   - MongoDB (local or cloud)', 'yellow');
  log('   - npm package manager', 'yellow');

  log('\n2. Setup Steps:', 'bright');
  log('   - Run: npm install', 'cyan');
  log('   - Configure .env file', 'cyan');
  log('   - Start MongoDB service', 'cyan');
  log('   - Run: npm run dev', 'cyan');

  log('\n3. Test the API:', 'bright');
  log('   - Open: http://localhost:5000/health', 'green');
  log('   - Check: http://localhost:5000/api', 'green');
  log('   - Try: curl http://localhost:5000/api/districts', 'green');
}

function checkMongoDB() {
  log('\n🍃 MongoDB Connection Check', 'blue');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mgnrega-goa-dashboard';
  log(`Connection string: ${mongoUri}`, 'yellow');

  log('\nTo start MongoDB locally:', 'bright');
  log('  - Windows: net start MongoDB', 'cyan');
  log('  - macOS/Linux: sudo systemctl start mongod', 'cyan');
  log('  - Docker: docker run -d -p 27017:27017 --name mongodb mongo', 'cyan');
}

async function main() {
  log('\n🎉 Welcome to MGNREGA Goa Dashboard Backend!', 'bright');
  log('=' .repeat(50), 'bright');

  // Check Node.js version
  if (!checkNodeVersion()) {
    process.exit(1);
  }

  // Check environment setup
  if (!checkEnvironmentSetup()) {
    log('\n❌ Environment setup incomplete', 'red');
    showQuickStart();
    process.exit(1);
  }

  // Check if node_modules exists
  if (!checkFileExists('node_modules')) {
    log('\n📦 Dependencies not installed', 'yellow');
    const shouldInstall = process.argv.includes('--install') || process.argv.includes('-i');

    if (shouldInstall) {
      const success = await installDependencies();
      if (!success) {
        process.exit(1);
      }
    } else {
      log('Run with --install flag to install dependencies automatically', 'cyan');
      log('Or run: npm install', 'cyan');
    }
  }

  // Show helpful information
  displayHelp();
  checkMongoDB();

  log('\n✨ Setup complete! Ready to start development.', 'green');
  log('\n🏃 To start the server:', 'bright');
  log('   npm run dev  (development with auto-reload)', 'cyan');
  log('   npm start    (production mode)', 'cyan');

  // If --dev flag is passed, start development server
  if (process.argv.includes('--dev') || process.argv.includes('-d')) {
    log('\n🚀 Starting development server...', 'green');
    try {
      await runCommand('npm', ['run', 'dev']);
    } catch (error) {
      log('❌ Failed to start development server', 'red');
      log('Make sure MongoDB is running and .env is configured properly', 'yellow');
    }
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  displayHelp();
  process.exit(0);
}

// Run main function
main().catch((error) => {
  log('\n💥 Startup script failed:', 'red');
  log(error.message, 'red');
  process.exit(1);
});

// Export for potential use as module
module.exports = {
  checkEnvironmentSetup,
  installDependencies,
  checkNodeVersion,
  runCommand
};
