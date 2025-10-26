import React from 'react';
import { Icon } from '../components/ui/EnhancedIcon';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/EnhancedButton';

/**
 * About page component for MGNREGA Goa Dashboard
 */
export const About = () => {
  const features = [
    {
      icon: 'chart-bar',
      title: 'Real-time Data',
      description: 'Access up-to-date MGNREGA employment data with automatic updates and fallback mechanisms.',
    },
    {
      icon: 'map-pin',
      title: 'Location Detection',
      description: 'Automatically detect your district using GPS location for personalized data views.',
    },
    {
      icon: 'signal-slash',
      title: 'Offline Support',
      description: 'Continue using the dashboard even without internet connection with cached data.',
    },
    {
      icon: 'users',
      title: 'Accessibility First',
      description: 'Designed with WCAG 2.1 AA compliance for users with disabilities.',
    },
    {
      icon: 'globe',
      title: 'Mobile Optimized',
      description: 'Mobile-first responsive design that works seamlessly on all devices.',
    },
    {
      icon: 'check-circle',
      title: 'Government Grade',
      description: 'Built to government standards with proper security and reliability measures.',
    },
  ];

  const stats = [
    { label: 'Districts Covered', value: '2', icon: 'building' },
    { label: 'Data Points', value: '1000+', icon: 'chart-pie' },
    { label: 'API Endpoints', value: '5', icon: 'server' },
    { label: 'Uptime', value: '99.9%', icon: 'check-circle' },
  ];

  const team = [
    {
      name: 'Government of Goa',
      role: 'Data Provider',
      description: 'Official source for MGNREGA employment data',
    },
    {
      name: 'Data.gov.in',
      role: 'Data Platform',
      description: 'National data sharing and accessibility platform',
    },
    {
      name: 'Tech Team',
      role: 'Development',
      description: 'Full-stack development and system architecture',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium">
            <Icon name="government" size="sm" />
            <span>Government of Goa Initiative</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            MGNREGA Goa Dashboard
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive, user-friendly dashboard providing real-time insights into
            MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) implementation
            across Goa state.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <a href="/">View Dashboard</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/help">Get Help</a>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                <Icon name={stat.icon} size="lg" color="primary" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with modern web technologies to provide a seamless experience
              for citizens, officials, and stakeholders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg mb-4">
                  <Icon name={feature.icon} size="base" color="primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* About MGNREGA Section */}
        <Card className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About MGNREGA
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)
                  is one of the largest work guarantee programmes in the world. The Act
                  was notified in September 2005.
                </p>
                <p>
                  The mandate of the Act is to provide at least 100 days of guaranteed
                  wage employment in a financial year to every rural household whose
                  adult members volunteer to do unskilled manual work.
                </p>
                <p>
                  This dashboard provides transparent access to employment generation
                  data across North and South Goa districts, helping citizens track
                  the program's impact and effectiveness.
                </p>
              </div>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                Program Highlights
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Icon name="check" size="sm" color="success" className="mt-0.5" />
                  <span className="text-sm text-primary-800">100 days guaranteed employment per household</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icon name="check" size="sm" color="success" className="mt-0.5" />
                  <span className="text-sm text-primary-800">Work within 5km of residence or transport allowance</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icon name="check" size="sm" color="success" className="mt-0.5" />
                  <span className="text-sm text-primary-800">Minimum wage as per state notification</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icon name="check" size="sm" color="success" className="mt-0.5" />
                  <span className="text-sm text-primary-800">One-third participation by women mandatory</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Team Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Collaboration
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This dashboard is the result of collaboration between government agencies,
              data platforms, and technical teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="government" size="xl" color="primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600">
                  {member.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <Card className="p-8">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Built with Modern Technology
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="code" size="lg" color="info" />
                </div>
                <h4 className="font-medium text-gray-900">React</h4>
                <p className="text-sm text-gray-600">Modern UI Framework</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="server" size="lg" color="success" />
                </div>
                <h4 className="font-medium text-gray-900">Node.js</h4>
                <p className="text-sm text-gray-600">Backend API</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="chart-bar" size="lg" color="secondary" />
                </div>
                <h4 className="font-medium text-gray-900">D3.js</h4>
                <p className="text-sm text-gray-600">Data Visualization</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="globe" size="lg" color="warning" />
                </div>
                <h4 className="font-medium text-gray-900">PWA</h4>
                <p className="text-sm text-gray-600">Progressive Web App</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Get Started Today
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore MGNREGA employment data for Goa and stay informed about
            rural development progress in your area.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <a href="/">
                <Icon name="chart-bar" size="base" className="mr-2" />
                View Dashboard
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/test">
                <Icon name="settings" size="base" className="mr-2" />
                Test Features
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
