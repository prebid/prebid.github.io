import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Sidebar from '../includes/Sidebar';

// TODO full generated, check if this is a good idea
interface BidderLayoutProps {
  children: React.ReactNode;
  title?: string;
  biddercode?: string;
  enable_download?: boolean;
  pbjs_version_notes?: string;
  s2s_only?: boolean;
  prevBiddercode?: string;
  is_full_screen?: boolean;
}

export default function BidderLayout({
  children,
  title,
  biddercode,
  enable_download = true,
  pbjs_version_notes,
  s2s_only = false,
  prevBiddercode,
  is_full_screen = false
}: BidderLayoutProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  const generateBidderKeys = (bidderCode: string) => {
    const prefix = `hb_${bidderCode}`;
    return [
      { key: `${prefix}_pb_`, description: 'Price' },
      { key: `${prefix}_bidder_`, description: 'Bidder' },
      { key: `${prefix}_adid_`, description: 'Ad ID' },
      { key: `${prefix}_size_`, description: 'Size' },
      { key: `${prefix}_source_`, description: 'Source' },
      { key: `${prefix}_format_`, description: 'Format' },
      { key: `${prefix}_cache_host_`, description: 'Cache Host' },
      { key: `${prefix}_cache_id_`, description: 'Cache ID' },
      { key: `${prefix}_uuid_`, description: 'UUID' },
      { key: `${prefix}_cache_path_`, description: 'Cache Path' },
      { key: `${prefix}_deal_`, description: 'Deal' },
      { key: '', description: '' }
    ];
  };

  if (is_full_screen) {
    return (
      <Layout title={title} description={siteConfig.tagline}>
        <div className="container pb-docs-container">
          <div className="row">
            <div className="col-lg-12">
              <div className="pb-content" markdown="1">
                {children}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={title} description={siteConfig.tagline}>
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
              <div className="row">
                <div className="col-md-12" role="main">
                  <div className="bs-docs-section">
                    <p>
                      <a href="/dev-docs/bidders.html">Back to Bidders</a>
                    </p>

                    <h2>{title}</h2>

                    {!enable_download && (
                      <div className="pb-bidder-s2">
                        <h4>Note:</h4> This adapter is not available in current versions of Prebid.js. Reason: {pbjs_version_notes}
                      </div>
                    )}

                    {s2s_only && (
                      <div className="pb-bidder-s2">
                        <h3>Note:</h3> This is a Prebid Server adapter only.
                      </div>
                    )}

                    <h3>Features</h3>

                    {/* Bidder metadata would go here */}
                    {/* <BidderMetadata page={page} /> */}

                    {children}

                    {biddercode && (
                      <>
                        <h3>"Send All Bids" Ad Server Keys</h3>
                        <p>
                          <small>
                            These are the bidder-specific keys that would be targeted within GAM in a Send-All-Bids scenario. GAM truncates keys to 20 characters.
                          </small>
                        </p>

                        <table className="table table-bordered table-striped">
                          <tbody>
                            {generateBidderKeys(biddercode).map((item, index) => (
                              <tr key={index}>
                                <td className="pbTd">
                                  <code>{item.key.slice(0, 20)}</code>
                                </td>
                                <td className="pbTd">
                                  <code>{item.key ? `hb_bidder_${biddercode}`.slice(0, 20) : ''}</code>
                                </td>
                                <td className="pbTd">
                                  <code>{item.key ? `hb_adid_${biddercode}`.slice(0, 20) : ''}</code>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}

                    {prevBiddercode && (
                      <p>
                        This bidder previously had a bidder code of <code>{prevBiddercode}</code>, but prefers new configurations to use <code>{biddercode}</code>.
                      </p>
                    )}

                    <p>
                      <a href="/dev-docs/bidders.html">Back to Bidders</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 