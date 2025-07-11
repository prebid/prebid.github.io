import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface ProductCard {
  icon: string;
  title: string;
  description: string;
  docsLink: string;
  docsText: string;
  downloadLink?: string;
  downloadText?: string;
}

interface FormatCard {
  title: string;
  link: string;
  icon: string;
}

const products: ProductCard[] = [
  {
    icon: '/assets/images/icon__product--prebid-js.svg',
    title: 'Prebid.js',
    description: 'The leading web based header bidding solution used by publishers worldwide',
    docsLink: '/dev-docs/prebidjs/',
    docsText: 'View Docs',
    downloadLink: '/download.html',
    downloadText: 'Download Prebid.js'
  },
  {
    icon: '/assets/images/icon__product--prebid-server.svg',
    title: 'Prebid Server',
    description: 'Moving Prebid and Header Bidding to the cloud for efficiency, scale and performance',
    docsLink: '/dev-docs/prebid-server/',
    docsText: 'View Docs',
    downloadLink: 'https://github.com/prebid/prebid-server',
    downloadText: 'Setup Prebid Server'
  },
  {
    icon: '/assets/images/icon__product--prebid-mobile-sdk.svg',
    title: 'Prebid Mobile SDK',
    description: 'Lightweight SDK enabling app publishers to move beyond the waterfall',
    docsLink: '/dev-docs/prebid-mobile/',
    docsText: 'View Docs',
    downloadLink: '/dev-docs/prebid-mobile/download.html',
    downloadText: 'Download Mobile SDK'
  },
  {
    icon: '/assets/images/user-identity.png',
    title: 'Prebid User Identity',
    description: 'Supporting the open web while respecting user privacy.',
    docsLink: '/dev-docs/identity/',
    docsText: 'View Docs'
  }
];

const formats: FormatCard[] = [
  { title: 'Display', link: '/formats/display.html', icon: '/assets/images/icon__format--display.svg' },
  { title: 'Video', link: '/prebid-video/video-overview.html', icon: '/assets/images/icon__format--video.svg' },
  { title: 'Connected TV', link: '/formats/ctv.html', icon: '/assets/images/icon__format--ctv.svg' },
  { title: 'AMP', link: '/formats/amp.html', icon: '/assets/images/icon__format--amp.svg' },
  { title: 'Native', link: '/prebid/native-implementation.html', icon: '/assets/images/icon__format--native.svg' },
  { title: 'Multi-Format', link: '/dev-docs/show-multi-format-ads.html', icon: '/assets/images/icon__format--multi-format.svg' }
];

const githubProjects = [
  { icon: '/assets/images/icon__source--prebid-js.svg', title: 'Prebid.js', link: 'https://github.com/prebid/Prebid.js' },
  { icon: '/assets/images/icon__source--prebid-server.svg', title: 'Prebid Server', link: 'https://github.com/prebid/prebid-server' },
  { icon: '/assets/images/icon__source--prebid-mobile.svg', title: 'Prebid Mobile', link: 'https://github.com/prebid/prebid-mobile-ios' },
  { icon: '/assets/images/icon__source--prebid-docs.svg', title: 'Prebid Docs', link: 'https://github.com/prebid/prebid.github.io' }
];

export default function HomeLayout(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <div className="pb-homepage">
        <div className="container pb-homepage-container">
          {/* Hero Section */}
          <div className="row justify-content-center text-center mt-6">
            <div className="col-md-10">
              <h1>Prebid Documentation</h1>
              <p>
                Welcome to the Prebid.org technical documentation portal. Here you will find the help you need to work with the Prebid.org family of Header Bidding products. You could start with the{' '}
                <a href="/overview/intro-video.html">video introduction to Prebid</a> or visit{' '}
                <a href="https://prebid.org" target="_blank" rel="noopener noreferrer">Prebid.org</a> for general product overviews, blog updates, and additional information on membership and events. If you're wondering what Header Bidding is all about, check out our{' '}
                <a href="/overview/intro-to-header-bidding.html" target="_blank" rel="noopener noreferrer">Introduction to Header Bidding</a>
              </p>
            </div>
          </div>

          {/* Products Section */}
          <div className="card-deck--md card-deck--products mt-4">
            {products.map((product, index) => (
              <div key={index} className="card text-center">
                <div className="card-body">
                  <div className="card-media">
                    <img src={product.icon} alt={`${product.title} Icon`} />
                  </div>
                  <div className="card-title">
                    <h3>{product.title}</h3>
                  </div>
                  <p className="mb-4">{product.description}</p>
                  <a href={product.docsLink} className="btn btn-outline-brand">
                    {product.docsText}
                  </a>
                  {product.downloadLink && (
                    <p className="mt-4">
                      <a href={product.downloadLink}>{product.downloadText}</a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Formats Section */}
          <div className="row text-center mt-7">
            <div className="col">
              <h2>Formats</h2>
            </div>
          </div>
          <div className="card-deck--formats mt-4">
            {formats.map((format, index) => (
              <div key={index} className="card text-center">
                <div className="card-body">
                  <a className="card-title stretched-link" href={format.link}>
                    {format.title}
                  </a>
                  <div className="card-media">
                    <img src={format.icon} alt={`${format.title} Icon`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Banner */}
        <div className="banner banner--medium text-center mt-8">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div>
                  <img src="/assets/images/icon__github-octocat--knockout.svg" alt="GitHub Octocat Icon" />
                </div>
                <h2 className="text-white my-4">
                  Prebid is Completely Open Source! Join our Community of Developers at GitHub.
                </h2>
              </div>
            </div>
            <div className="card-deck">
              {githubProjects.map((project, index) => (
                <div key={index} className="card">
                  <div className="card-body">
                    <div className="card-media">
                      <img src={project.icon} alt={`${project.title} Icon`} />
                    </div>
                    <div className="card-title">
                      <h3>
                        <a href={project.link} className="stretched-link" target="_blank" rel="noopener noreferrer">
                          {project.title}
                        </a>
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="banner banner--light">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <div className="wpb_raw_code wpb_content_element wpb_raw_html footer__form">
                  <div className="wpb_wrapper">
                    <div className="wpb_wrapper">
                      <h4>Subscribe for Updates</h4>
                      <p>
                        Please review our <a href="/policies/privacy.html">privacy policy</a>
                      </p>
                    </div>
                    <script
                      charSet="utf-8"
                      type="text/javascript"
                      src="//js.hsforms.net/forms/shell.js"
                    />
                    <script
                      dangerouslySetInnerHTML={{
                        __html: `
                          hbspt.forms.create({
                            portalId: "7874009",
                            formId: "4180bae7-aece-4b05-accb-42f68977345f",
                            css: "text-align:center;"
                          });
                        `
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="social-media">
                  <h5>Follow Us</h5>
                  <a href="https://twitter.com/Prebidorg" target="_blank" rel="noopener noreferrer">
                    <img src="/assets/images/icon__social-media--twitter.svg" alt="Twitter Icon" />
                  </a>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 