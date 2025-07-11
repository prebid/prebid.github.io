import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Sidebar from '../includes/Sidebar';

interface DocsLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showPartners?: boolean;
}

export default function DocsLayout({
  children,
  title,
  description,
  showPartners = false
}: DocsLayoutProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={title} description={description || siteConfig.tagline}>
      <div className="container pb-docs-container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 sidebar" id="sidebar">
            <div>
              <button
                className="navbar-toggler d-lg-none"
                type="button"
                data-toggle="collapse"
                data-target="#sidebarContent"
                aria-controls="sidebarContent"
                aria-expanded="false"
                aria-label="Toggle Sidebar navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse d-lg-block" id="sidebarContent">
                <Sidebar />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="pb-content" markdown="1">
              {children}

              {showPartners && (
                <div className="partners-section">
                  {/* Partners component would go here */}
                  {/* <Partners /> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 