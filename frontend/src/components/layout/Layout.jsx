import React from 'react';
import { ResponsiveLayout, LayoutHeader, LayoutFooter } from './ResponsiveLayout';
import { OfflineIndicator } from '../common/OfflineIndicator';

/**
 * Main Layout component for the MGNREGA Goa Dashboard
 */
export const Layout = ({ children }) => {
  const currentYear = new Date().getFullYear();

  const headerContent = (
    <LayoutHeader
      title="MGNREGA Goa Dashboard"
      subtitle="Real-time employment generation data"
    />
  );

  const footerContent = (
    <LayoutFooter
      links={[
        { label: 'About', href: '/about' },
        { label: 'Help', href: '/help' },
        { label: 'Health Check', href: '/health' },
        { label: 'Test Features', href: '/test' },
      ]}
      copyright={`© ${currentYear} Government of Goa. All rights reserved.`}
    />
  );

  return (
    <ResponsiveLayout
      header={headerContent}
      footer={footerContent}
      showOfflineIndicator={true}
      maxWidth="7xl"
      className="min-h-screen"
    >
      <div className="space-y-6">
        {children}
      </div>
    </ResponsiveLayout>
  );
};

export default Layout;
