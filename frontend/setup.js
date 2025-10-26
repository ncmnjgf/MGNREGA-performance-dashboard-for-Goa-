#!/usr/bin/env node

/**
 * MGNREGA Goa Dashboard Frontend - Setup Script
 * Comprehensive setup automation for development and deployment
 */

import { spawn, exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function checkNodeVersion() {
  log('\n🔧 Checking Node.js version...', 'blue');

  try {
    const { stdout } = await execCommand('node --version');
    const version = stdout.trim();
    const majorVersion = parseInt(version.split('.')[0].substring(1));

    log(`Node.js version: ${version}`, 'cyan');

    if (majorVersion >= 18) {
      log('✅ Node.js version is compatible', 'green');
      return true;
    } else {
      log('❌ Node.js version 18+ is required', 'red');
      log('Please upgrade: https://nodejs.org/', 'yellow');
      return false;
    }
  } catch (error) {
    log('❌ Node.js is not installed or not in PATH', 'red');
    return false;
  }
}

async function checkPackageManager() {
  log('\n📦 Checking package manager...', 'blue');

  try {
    // Try npm
    await execCommand('npm --version');
    log('✅ npm is available', 'green');
    return 'npm';
  } catch {
    try {
      // Try yarn
      await execCommand('yarn --version');
      log('✅ yarn is available', 'green');
      return 'yarn';
    } catch {
      log('❌ No package manager found', 'red');
      return null;
    }
  }
}

async function createEnvironmentFile() {
  log('\n📄 Setting up environment configuration...', 'blue');

  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');

  try {
    // Check if .env already exists
    await fs.access(envPath);
    log('✅ .env file already exists', 'green');
    return;
  } catch {
    // .env doesn't exist, create it
  }

  const envContent = `# MGNREGA Goa Dashboard - Frontend Environment Variables

# API Configuration
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=MGNREGA Goa Dashboard
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false
VITE_USE_MOCK_DATA=false

# Development
VITE_DEV_TOOLS=true
VITE_LOG_LEVEL=info

# External Services (Optional)
# VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
# VITE_SENTRY_DSN=https://your-sentry-dsn

# Build Configuration
VITE_BUILD_TIMESTAMP=true
VITE_BUNDLE_ANALYZER=false
`;

  try {
    await fs.writeFile(envPath, envContent);
    log('✅ Created .env file with default configuration', 'green');

    // Also create .env.example
    await fs.writeFile(envExamplePath, envContent);
    log('✅ Created .env.example file', 'green');
  } catch (error) {
    log(`❌ Failed to create environment file: ${error.message}`, 'red');
  }
}

async function installDependencies(packageManager) {
  log('\n📦 Installing dependencies...', 'blue');

  const installCommand = packageManager === 'yarn' ? 'yarn install' : 'npm install';

  try {
    if (packageManager === 'yarn') {
      await runCommand('yarn', ['install']);
    } else {
      await runCommand('npm', ['install']);
    }
    log('✅ Dependencies installed successfully!', 'green');
    return true;
  } catch (error) {
    log(`❌ Failed to install dependencies: ${error.message}`, 'red');
    return false;
  }
}

async function createMissingDirectories() {
  log('\n📁 Creating missing directories...', 'blue');

  const directories = [
    'src/components/common',
    'src/components/layout',
    'src/assets/images',
    'src/assets/icons',
    'public/images',
    'dist'
  ];

  for (const dir of directories) {
    const dirPath = path.join(__dirname, dir);
    try {
      await fs.access(dirPath);
      log(`✅ ${dir} exists`, 'cyan');
    } catch {
      try {
        await fs.mkdir(dirPath, { recursive: true });
        log(`✅ Created ${dir}`, 'green');
      } catch (error) {
        log(`❌ Failed to create ${dir}: ${error.message}`, 'red');
      }
    }
  }
}

async function createMissingComponents() {
  log('\n🧩 Creating missing components...', 'blue');

  const components = [
    {
      path: 'src/components/common/ErrorBoundary.jsx',
      content: `import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">Please refresh the page or try again later.</p>
            <button
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
`
    },
    {
      path: 'src/components/common/LoadingSpinner.jsx',
      content: `import React from 'react';
import { clsx } from 'clsx';

export const LoadingSpinner = ({ size = 'md', className = '', ...props }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div
      className={clsx(
        'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
`
    },
    {
      path: 'src/components/layout/Layout.jsx',
      content: `import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
`
    },
    {
      path: 'src/components/layout/Header.jsx',
      content: `import React from 'react';
import { Icon } from '../ui/Icon';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Icon name="building" size="lg" className="text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">MGNREGA Goa</h1>
              <p className="text-sm text-gray-600">Employment Dashboard</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="/help" className="text-gray-600 hover:text-gray-900">Help</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
`
    },
    {
      path: 'src/components/layout/Footer.jsx',
      content: `import React from 'react';
import { Icon } from '../ui/Icon';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="building" size="md" className="text-primary-600" />
              <span className="font-semibold text-gray-900">MGNREGA Goa</span>
            </div>
            <p className="text-sm text-gray-600">
              Tracking rural employment and development in Goa state.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/about" className="hover:text-gray-900">About MGNREGA</a></li>
              <li><a href="/help" className="hover:text-gray-900">Help & Support</a></li>
              <li><a href="https://nrega.nic.in/" target="_blank" rel="noopener noreferrer">Official MGNREGA</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Icon name="phone" size="sm" />
                <span>1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="mail" size="sm" />
                <span>help@mgnrega-goa.gov.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>© 2024 Government of Goa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
`
    }
  ];

  for (const component of components) {
    const filePath = path.join(__dirname, component.path);
    const dir = path.dirname(filePath);

    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, component.content);
      log(`✅ Created ${component.path}`, 'green');
    } catch (error) {
      log(`❌ Failed to create ${component.path}: ${error.message}`, 'red');
    }
  }
}

async function createPlaceholderComponents() {
  log('\n🎯 Creating placeholder components...', 'blue');

  const placeholders = [
    {
      path: 'src/components/dashboard/DistrictSelector.jsx',
      content: `import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

export const DistrictSelector = ({
  selectedDistrict,
  onDistrictChange,
  onAutoDetect,
  detecting = false,
  error = null
}) => {
  const districts = [
    { code: 'north-goa', name: 'North Goa' },
    { code: 'south-goa', name: 'South Goa' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="map-pin" size="sm" className="text-primary-600" />
        <h3 className="text-lg font-semibold">Choose Your District</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          value={selectedDistrict?.code || ''}
          onChange={(e) => {
            const district = districts.find(d => d.code === e.target.value);
            onDistrictChange(district);
          }}
        >
          <option value="">Select your district...</option>
          {districts.map(district => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>

        <Button
          variant="outline"
          onClick={onAutoDetect}
          disabled={detecting}
          loading={detecting}
          icon={<Icon name="crosshair" size="sm" />}
        >
          {detecting ? 'Detecting...' : 'Find My Area'}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-error-600 flex items-center gap-2">
          <Icon name="alert-triangle" size="sm" />
          {error}
        </p>
      )}
    </div>
  );
};

export default DistrictSelector;
`
    },
    {
      path: 'src/components/dashboard/TrendChart.jsx',
      content: `import React from 'react';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

export const TrendChart = ({
  data = [],
  title,
  subtitle,
  loading = false,
  height = 300
}) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="trending-up" className="text-primary-600" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>

      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center text-gray-500">
          <Icon name="bar-chart" size="xl" className="mx-auto mb-2" />
          <p>Chart implementation coming soon</p>
          <p className="text-sm">Data points: {data.length}</p>
        </div>
      </div>
    </Card>
  );
};

export default TrendChart;
`
    },
    {
      path: 'src/components/dashboard/ComparisonChart.jsx',
      content: `import React from 'react';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

export const ComparisonChart = ({
  data = [],
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-error-200 bg-error-50">
        <div className="flex items-center gap-2 text-error-700">
          <Icon name="alert-triangle" />
          <span>Unable to load comparison data</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="bar-chart" className="text-primary-600" />
        <h3 className="text-xl font-semibold text-gray-900">District Comparison</h3>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{item.district}</span>
              <span className="text-sm text-gray-600">{item.personDaysPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: \`\${item.personDaysPercentage}%\` }}
              />
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Icon name="bar-chart" size="xl" className="mx-auto mb-2" />
            <p>No comparison data available</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ComparisonChart;
`
    },
    {
      path: 'src/pages/About.jsx',
      content: `import React from 'react';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About MGNREGA</h1>
        <p className="text-xl text-gray-600">
          Mahatma Gandhi National Rural Employment Guarantee Act
        </p>
      </div>

      <Card className="p-8">
        <div className="prose prose-lg max-w-none">
          <h2 className="flex items-center gap-2">
            <Icon name="info" className="text-primary-600" />
            What is MGNREGA?
          </h2>
          <p>
            MGNREGA is one of the largest work guarantee programs in the world.
            It provides at least 100 days of guaranteed wage employment in a
            financial year to every rural household whose adult members volunteer
            to do unskilled manual work.
          </p>

          <h2 className="flex items-center gap-2">
            <Icon name="target" className="text-primary-600" />
            Objectives
          </h2>
          <ul>
            <li>Provide livelihood security in rural areas</li>
            <li>Create productive assets</li>
            <li>Strengthen natural resource management</li>
            <li>Empower rural communities</li>
          </ul>

          <h2 className="flex items-center gap-2">
            <Icon name="map-pin" className="text-primary-600" />
            MGNREGA in Goa
          </h2>
          <p>
            This dashboard provides real-time insights into MGNREGA implementation
            across Goa's two districts: North Goa and South Goa. Track employment
            generation, fund utilization, and work progress in your area.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default About;
`
    },
    {
      path: 'src/pages/Help.jsx',
      content: `import React from 'react';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';

export const Help = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
        <p className="text-xl text-gray-600">
          Get help using the MGNREGA Goa Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon name="help-circle" className="text-primary-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="cursor-pointer font-medium hover:text-primary-600">
                How do I check work in my area?
              </summary>
              <p className="mt-2 text-gray-600 text-sm">
                Select your district from the dropdown menu on the main dashboard.
                The data will automatically update to show information for your selected area.
              </p>
            </details>
            <details className="group">
              <summary className="cursor-pointer font-medium hover:text-primary-600">
                What do the numbers mean?
              </summary>
              <p className="mt-2 text-gray-600 text-sm">
                The dashboard shows three key metrics: Total Work Done (person-days of employment),
                Families Helped (households provided work), and Money Spent (total expenditure).
              </p>
            </details>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon name="phone" className="text-primary-600" />
            Contact Support
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icon name="phone" size="sm" className="text-gray-600" />
              <div>
                <p className="font-medium">Helpline</p>
                <p className="text-sm text-gray-600">1800-XXX-XXXX</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="mail" size="sm" className="text-gray-600" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-gray-600">help@mgnrega-goa.gov.in</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="globe" size="sm" className="text-gray-600" />
              <div>
                <p className="font-medium">Official Website</p>
                <a href="https://nrega.nic.in/" className="text-sm text-primary-600 hover:underline">
                  nrega.nic.in
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Help;
`
    }
  ];

  for (const placeholder of placeholders) {
    const filePath = path.join(__dirname, placeholder.path);
    const dir = path.dirname(filePath);

    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, placeholder.content);
      log(`✅ Created ${placeholder.path}`, 'green');
    } catch (error) {
      log(`❌ Failed to create ${placeholder.path}: ${error.message}`, 'red');
    }
  }
}

async function createPublicAssets() {
  log('\n🖼️ Creating public assets...', 'blue');

  const assets = [
    {
      path: 'public/favicon.svg',
      content: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="32" height="32" rx="6" fill="#15803d"/>
<path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="white"/>
</svg>`
    },
    {
      path: 'public/manifest.json',
      content: JSON.stringify({
        "name": "MGNREGA Goa Dashboard",
        "short_name": "MGNREGA Goa",
        "description": "Track rural employment and development in Goa",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#15803d",
        "icons": [
          {
            "src": "/favicon.svg",
            "sizes": "any",
            "type": "image/svg+xml",
            "purpose": "any maskable"
          }
        ]
      }, null, 2)
    }
  ];

  for (const asset of assets) {
    const filePath = path.join(__dirname, asset.path);
    const dir = path.dirname(filePath);

    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, asset.content);
      log(`✅ Created ${asset.path}`, 'green');
    } catch (error) {
      log(`❌ Failed to create ${asset.path}: ${error.message}`, 'red');
    }
  }
}

async function addMissingDependencies(packageManager) {
  log('\n📋 Checking for missing dependencies...', 'blue');

  const packageJsonPath = path.join(__dirname, 'package.json');

  try {
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    const requiredDeps = {
      'react-router-dom': '^6.8.0',
      'web-vitals': '^3.3.0'
    };

    const missingDeps = [];

    for (const [dep, version] of Object.entries(requiredDeps)) {
      if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
        missingDeps.push(`${dep}@${version}`);
      }
    }

    if (missingDeps.length > 0) {
      log(`Installing missing dependencies: ${missingDeps.join(', ')}`, 'yellow');

      if (packageManager === 'yarn') {
        await runCommand('yarn', ['add', ...missingDeps]);
      } else {
        await runCommand('npm', ['install', ...missingDeps]);
      }

      log('✅ Missing dependencies installed', 'green');
    } else {
      log('✅ All required dependencies are present', 'green');
    }
  } catch (error) {
    log(`⚠️ Could not check dependencies: ${error.message}`, 'yellow');
  }
}

async function runDevelopmentServer(packageManager) {
  log('\n🚀 Starting development server...', 'blue');

  const command = packageManager === 'yarn' ? 'yarn' : 'npm';
  const args = packageManager === 'yarn' ? ['dev'] : ['run', 'dev'];

  try {
    await runCommand(command, args);
  } catch (error) {
    log('❌ Failed to start development server:', 'red');
    log('You can start it manually with: npm run dev', 'yellow');
  }
}

async function showCompletionInfo() {
  log('\n🎉 Setup completed successfully!', 'green');
  log('=' .repeat(50), 'green');

  log('\n📋 Next steps:', 'cyan');
  log('1. Start the backend server (if not running):', 'cyan');
  log('   cd ../backend && npm run dev', 'yellow');
  log('2. Start the frontend development server:', 'cyan');
  log('   npm run dev', 'yellow');
  log('3. Open your browser to http://localhost:
