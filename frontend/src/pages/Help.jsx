import React, { useState } from 'react';
import { Icon } from '../components/ui/EnhancedIcon';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/EnhancedButton';

/**
 * Help page component for MGNREGA Goa Dashboard
 */
export const Help = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const helpSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'play',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Welcome to MGNREGA Goa Dashboard</h3>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-semibold text-primary-600">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Select Your District</h4>
                <p className="text-gray-600 text-sm">Choose either North Goa or South Goa from the dropdown menu, or use auto-detection to find your location automatically.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-semibold text-primary-600">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Employment Data</h4>
                <p className="text-gray-600 text-sm">Explore key metrics like work done, families helped, and funds spent through interactive cards and charts.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-semibold text-primary-600">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Analyze Trends</h4>
                <p className="text-gray-600 text-sm">Use the trend charts to understand employment generation patterns over time and compare districts.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="information-circle" size="base" color="info" className="mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Quick Tip</h4>
                <p className="text-blue-800 text-sm">The dashboard works offline too! Data is cached locally so you can access information even without an internet connection.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'features',
      title: 'Features Guide',
      icon: 'star',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Dashboard Features</h3>

          <div className="grid gap-6">
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <Icon name="map-pin" size="lg" color="primary" />
                <div>
                  <h4 className="font-medium text-gray-900">Auto Location Detection</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Click "Detect Location" to automatically find your district. The system uses GPS to map your coordinates to either North or South Goa.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    Requires location permission • Works within Goa state boundaries
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <Icon name="chart-bar" size="lg" color="success" />
                <div>
                  <h4 className="font-medium text-gray-900">Interactive Metrics</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    View key employment indicators with trend arrows showing increase/decrease from previous periods.
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Icon name="trending-up" size="xs" color="success" />
                      <span className="text-gray-500">Positive trend</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="trending-down" size="xs" color="error" />
                      <span className="text-gray-500">Negative trend</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <Icon name="signal-slash" size="lg" color="warning" />
                <div>
                  <h4 className="font-medium text-gray-900">Offline Support</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    The dashboard caches data locally, so you can continue viewing information even when offline.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    Look for the offline indicator in the top-right corner
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: 'exclamation-triangle',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Common Issues & Solutions</h3>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Icon name="exclamation-circle" size="sm" color="error" className="mr-2" />
                Location Detection Not Working
              </h4>
              <div className="mt-2 text-sm text-gray-600 space-y-2">
                <p><strong>Possible causes:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Location permission denied</li>
                  <li>GPS disabled on device</li>
                  <li>Location outside Goa state</li>
                </ul>
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Enable location services in browser</li>
                  <li>Refresh page and allow permission</li>
                  <li>Select district manually if outside Goa</li>
                </ul>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Icon name="signal-slash" size="sm" color="warning" className="mr-2" />
                No Data Loading
              </h4>
              <div className="mt-2 text-sm text-gray-600 space-y-2">
                <p><strong>Possible causes:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Internet connection issues</li>
                  <li>Server temporarily unavailable</li>
                  <li>Browser cache issues</li>
                </ul>
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Check internet connection</li>
                  <li>Refresh the page</li>
                  <li>Clear browser cache</li>
                  <li>Try again in a few minutes</li>
                </ul>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Icon name="chart-bar" size="sm" color="info" className="mr-2" />
                Charts Not Displaying
              </h4>
              <div className="mt-2 text-sm text-gray-600 space-y-2">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Enable JavaScript in browser</li>
                  <li>Use a modern browser (Chrome, Firefox, Safari, Edge)</li>
                  <li>Disable browser extensions that might block content</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'data',
      title: 'Data Information',
      icon: 'chart-pie',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Understanding the Data</h3>

          <div className="space-y-4">
            <Card className="p-4 bg-green-50">
              <div className="flex items-start space-x-3">
                <Icon name="users" size="lg" color="success" />
                <div>
                  <h4 className="font-medium text-green-900">Person Days</h4>
                  <p className="text-green-800 text-sm mt-1">
                    Total employment days generated under MGNREGA. Each day one person works counts as one person-day.
                  </p>
                  <div className="mt-2 text-xs text-green-700">
                    Higher numbers indicate more employment opportunities created
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-blue-50">
              <div className="flex items-start space-x-3">
                <Icon name="households" size="lg" color="info" />
                <div>
                  <h4 className="font-medium text-blue-900">Families Helped</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    Number of unique households that received employment under the scheme.
                  </p>
                  <div className="mt-2 text-xs text-blue-700">
                    Shows program reach across different families
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-yellow-50">
              <div className="flex items-start space-x-3">
                <Icon name="currency" size="lg" color="warning" />
                <div>
                  <h4 className="font-medium text-yellow-900">Funds Spent</h4>
                  <p className="text-yellow-800 text-sm mt-1">
                    Total expenditure on wages, materials, and administrative costs for MGNREGA works.
                  </p>
                  <div className="mt-2 text-xs text-yellow-700">
                    Includes both wage and material components
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-purple-50">
              <div className="flex items-start space-x-3">
                <Icon name="check-circle" size="lg" color="secondary" />
                <div>
                  <h4 className="font-medium text-purple-900">Completion Rate</h4>
                  <p className="text-purple-800 text-sm mt-1">
                    Percentage of sanctioned works that have been completed successfully.
                  </p>
                  <div className="mt-2 text-xs text-purple-700">
                    Higher percentages indicate better project execution
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Data Sources</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Primary: Government of Goa MGNREGA records</li>
              <li>• Secondary: Data.gov.in national database</li>
              <li>• Backup: Local CSV data for offline access</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      icon: 'eye',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Accessibility Features</h3>

          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-medium text-gray-900 flex items-center mb-2">
                <Icon name="eye" size="base" color="primary" className="mr-2" />
                Screen Reader Support
              </h4>
              <p className="text-gray-600 text-sm">
                All content is properly labeled for screen readers. Use Tab key to navigate through interactive elements.
              </p>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium text-gray-900 flex items-center mb-2">
                <Icon name="cursor-click" size="base" color="primary" className="mr-2" />
                Keyboard Navigation
              </h4>
              <div className="text-gray-600 text-sm space-y-2">
                <p>Navigate using keyboard shortcuts:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Tab</kbd> - Move to next element</li>
                  <li><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Shift+Tab</kbd> - Move to previous element</li>
                  <li><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd> - Activate buttons/links</li>
                  <li><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Escape</kbd> - Close dialogs</li>
                </ul>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium text-gray-900 flex items-center mb-2">
                <Icon name="adjustments" size="base" color="primary" className="mr-2" />
                Visual Accessibility
              </h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• High contrast colors (4.5:1 ratio minimum)</li>
                <li>• Large touch targets (44px minimum)</li>
                <li>• Clear focus indicators</li>
                <li>• Readable fonts and spacing</li>
                <li>• Motion can be reduced in system settings</li>
              </ul>
            </Card>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="information-circle" size="base" color="info" className="mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Need Help?</h4>
                <p className="text-blue-800 text-sm">
                  If you encounter any accessibility issues, please contact us at{' '}
                  <a href="mailto:accessibility@mgnrega-goa.gov.in" className="underline">
                    accessibility@mgnrega-goa.gov.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      title: 'Contact Support',
      icon: 'phone',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Get Help & Support</h3>

          <div className="grid gap-6">
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <Icon name="mail" size="lg" color="primary" />
                <div>
                  <h4 className="font-medium text-gray-900">Email Support</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    For technical issues or data queries
                  </p>
                  <a
                    href="mailto:support@mgnrega-goa.gov.in"
                    className="text-primary-600 text-sm font-medium hover:text-primary-700"
                  >
                    support@mgnrega-goa.gov.in
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <Icon name="phone" size="lg" color="success" />
                <div>
                  <h4 className="font-medium text-gray-900">Phone Support</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Monday to Friday, 9:00 AM - 5:00 PM
                  </p>
                  <a
                    href="tel:+91-832-2419000"
                    className="text-primary-600 text-sm font-medium hover:text-primary-700"
                  >
                    +91-832-2419000
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <Icon name="globe" size="lg" color="info" />
                <div>
                  <h4 className="font-medium text-gray-900">Official Website</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Visit the official MGNREGA Goa portal
                  </p>
                  <a
                    href="https://www.goa.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 text-sm font-medium hover:text-primary-700"
                  >
                    www.goa.gov.in
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <Icon name="map-pin" size="lg" color="warning" />
                <div>
                  <h4 className="font-medium text-gray-900">Office Address</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Directorate of Panchayati Raj<br />
                    Porvorim, Bardez, Goa 403501
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Quick Links</h4>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/test">Test Features</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/health">System Status</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/about">About Dashboard</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/">Back to Dashboard</a>
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Help & Support
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of the MGNREGA Goa Dashboard.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Help Topics</h3>
                <nav className="space-y-2">
                  {helpSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg
                        transition-colors duration-200
                        ${activeSection === section.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon name={section.icon} size="sm" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button variant="outline" size="sm" fullWidth asChild>
                    <a href="/">
                      <Icon name="arrow-left" size="sm" className="mr-2" />
                      Back to Dashboard
                    </a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {helpSections.find(s => s.id === activeSection)?.content}
            </Card>
          </div>
        </div>

        {/* Emergency Contact */}
        <Card className="mt-8 p-6 bg-red-50 border-red-200">
          <div className="flex items-start space-x-3">
            <Icon name="exclamation-triangle" size="lg" color="error" className="mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Emergency Contact</h3>
              <p className="text-red-800 text-sm mt-1">
                For urgent issues related to MGNREGA employment or payments, contact the District Collector's office immediately.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href="tel:+91-832-2419000"
                  className="inline-flex items-center text-sm font-medium text-red-700 hover:text-red-800"
                >
                  <Icon name="phone" size="sm" className="mr-1" />
                  Emergency Helpline
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
