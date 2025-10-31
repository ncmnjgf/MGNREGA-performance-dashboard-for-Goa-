#!/usr/bin/env node

/**
 * Quick setup and deployment verification script
 * Tests that everything is configured correctly for Railway deployment
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkFile(filePath) {
  try {
    await fs.access(join(__dirname, filePath));
    return true;
  } catch {
    return false;
  }
}

async function checkRequiredFiles() {
  log('\n🔍 Checking Required Files...', 'blue');

  const files = [
    'backend/package.json',
    'backend/src/server.js',
    'backend/src/data/goa_mgnrega.csv',
    'backend/railway.json',
    'backend/nixpacks.toml',
    'frontend/package.json',
    'frontend/src/main.jsx',
    'frontend/railway.json',
    'frontend/nixpacks.toml',
    'RAILWAY_DEPLOYMENT.md'
  ];

  let allPresent = true;

  for (const file of files) {
    const exists = await checkFile(file);
    if (exists) {
      log(`✅ ${file}`, 'green');
    } else {
      log(`❌ ${file} - MISSING`, 'red');
      allPresent = false;
    }
  }

  return allPresent;
}

async function checkDependencies() {
  log('\n📦 Checking Dependencies...', 'blue');

  const checkDir = async (dir, name) => {
    const nodeModulesPath = join(__dirname, dir, 'node_modules');
    const packageJsonPath = join(__dirname, dir, 'package.json');

    try {
      await fs.access(nodeModulesPath);
      log(`✅ ${name} dependencies installed`, 'green');
      return true;
    } catch {
      log(`❌ ${name} dependencies NOT installed`, 'red');
      log(`   Run: cd ${dir} && npm install`, 'yellow');
      return false;
    }
  };

  const backendOk = await checkDir('backend', 'Backend');
  const frontendOk = await checkDir('frontend', 'Frontend');

  return backendOk && frontendOk;
}

async function testBackendStartup() {
  log('\n🚀 Testing Backend Startup...', 'blue');

  return new Promise((resolve) => {
    const backendPath = join(__dirname, 'backend');

    const backend = spawn('node', ['src/server.js'], {
      cwd: backendPath,
      env: {
        ...process.env,
        NODE_ENV: 'development',
        PORT: '5001',
        MONGODB_URI: 'mongodb://localhost:27017/test'
      }
    });

    let output = '';
    let timeout;

    backend.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('Server running')) {
        clearTimeout(timeout);
        log('✅ Backend started successfully', 'green');

        // Test health endpoint
        setTimeout(() => {
          testHealthEndpoint().then((healthy) => {
            backend.kill();
            resolve(healthy);
          });
        }, 2000);
      }
    });

    backend.stderr.on('data', (data) => {
      const message = data.toString();
      if (!message.includes('DeprecationWarning')) {
        output += message;
      }
    });

    backend.on('error', (error) => {
      log(`❌ Backend failed to start: ${error.message}`, 'red');
      backend.kill();
      resolve(false);
    });

    timeout = setTimeout(() => {
      if (!output.includes('Server running')) {
        log('❌ Backend startup timeout', 'red');
        log('   Check backend/src/server.js for errors', 'yellow');
        backend.kill();
        resolve(false);
      }
    }, 15000);
  });
}

async function testHealthEndpoint() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/health',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'healthy') {
            log('✅ Health endpoint responding correctly', 'green');
            resolve(true);
          } else {
            log('⚠️  Health endpoint returned unexpected status', 'yellow');
            resolve(true);
          }
        } catch {
          log('⚠️  Health endpoint response invalid', 'yellow');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      log(`❌ Health endpoint failed: ${error.message}`, 'red');
      resolve(false);
    });

    req.on('timeout', () => {
      log('❌ Health endpoint timeout', 'red');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function checkGitStatus() {
  log('\n📝 Checking Git Status...', 'blue');

  return new Promise((resolve) => {
    const git = spawn('git', ['status', '--porcelain']);
    let output = '';

    git.stdout.on('data', (data) => {
      output += data.toString();
    });

    git.on('close', (code) => {
      if (code !== 0) {
        log('❌ Git not initialized', 'red');
        log('   Run: git init', 'yellow');
        resolve(false);
        return;
      }

      if (output.trim() === '') {
        log('✅ All changes committed', 'green');
      } else {
        log('⚠️  Uncommitted changes detected', 'yellow');
        log('   Run: git add . && git commit -m "Prepare for deployment"', 'cyan');
      }
      resolve(true);
    });

    git.on('error', () => {
      log('❌ Git not installed', 'red');
      resolve(false);
    });
  });
}

function printDeploymentReadiness(results) {
  log('\n' + '='.repeat(50), 'cyan');
  log('📊 Deployment Readiness Report', 'bright');
  log('='.repeat(50), 'cyan');

  const checks = [
    { name: 'Required Files', status: results.files },
    { name: 'Dependencies Installed', status: results.dependencies },
    { name: 'Backend Startup', status: results.backend },
    { name: 'Git Repository', status: results.git }
  ];

  checks.forEach(check => {
    const status = check.status ? '✅ PASS' : '❌ FAIL';
    const color = check.status ? 'green' : 'red';
    log(`${status} - ${check.name}`, color);
  });

  const allPassed = Object.values(results).every(v => v === true);

  log('\n' + '='.repeat(50), 'cyan');
  if (allPassed) {
    log('🎉 All checks passed! Ready for Railway deployment!', 'green');
    log('\nNext steps:', 'bright');
    log('1. Push to GitHub: git push origin main', 'cyan');
    log('2. Deploy to Railway: See RAILWAY_DEPLOYMENT.md', 'cyan');
    log('3. Or run: railway-deploy.bat (Windows) or bash railway-deploy.sh (Linux/Mac)', 'cyan');
  } else {
    log('⚠️  Some checks failed. Please fix the issues above.', 'yellow');
    log('\nCommon fixes:', 'bright');
    log('• Install dependencies: cd backend && npm install && cd ../frontend && npm install', 'cyan');
    log('• Initialize Git: git init', 'cyan');
    log('• Check error messages above for specific issues', 'cyan');
  }
  log('='.repeat(50) + '\n', 'cyan');
}

async function main() {
  log('\n🎯 MGNREGA Goa Dashboard - Setup Verification', 'bright');
  log('Testing configuration for Railway deployment...\n', 'cyan');

  const results = {
    files: false,
    dependencies: false,
    backend: false,
    git: false
  };

  try {
    results.files = await checkRequiredFiles();
    results.dependencies = await checkDependencies();

    if (results.dependencies) {
      results.backend = await testBackendStartup();
    } else {
      log('\n⚠️  Skipping backend test (dependencies not installed)', 'yellow');
    }

    results.git = await checkGitStatus();

  } catch (error) {
    log(`\n❌ Error during verification: ${error.message}`, 'red');
    console.error(error);
  }

  printDeploymentReadiness(results);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default main;
