import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import { themes } from 'prism-react-renderer';
import { tocPlugin } from './_plugins/toc-plugin';

const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const config: Config = {
  title: "Prebid",
  tagline: "Prebid Documentation",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.prebid.org",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "prebid", // Usually your GitHub org/user name.
  projectName: "prebid.github.io", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
          path: "docs/overview",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/prebid/prebid.github.io/tree/master",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ]
  ],

  // themes: [
  //   ["@docusaurus/theme-classic", { customCss: require.resolve("./src/css/custom.css") }],
  //   // "@docusaurus/theme-search-algolia" - not yet
  // ],

  themeConfig:
    {
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Prebid",
        logo: {
          alt: "Prebid Logo",
          src: "img/logo.svg",
        },
        items: [
          // { to: "/dev-docs", label: "Dev", position: "left" },
          {
            type: "docSidebar",
            sidebarId: "prebid",
            position: "left",
            label: "Prebid",
          },
          {
            href: "https://github.com/prebid/prebid.github.io",
            label: "GitHub",
            position: "right",
          },
          {
            type: 'docsVersionDropdown',
            docsPluginId: 'prebidjs',
          },
          {
            type: 'docsVersionDropdown',
            docsPluginId: 'prebidServer',
            label: 'Prebid Server',
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/prebid",
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/prebid-org/",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/prebid/prebid.github.io",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    } satisfies Preset.ThemeConfig,

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'prebidjs',
        path: 'docs/prebid',
        routeBasePath: 'docs/prebid',
        sidebarPath: './sidebars.pbjs.ts',
        showLastUpdateTime: true,
        // ... other options
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'prebidServer',
        path: 'docs/prebid-server',
        routeBasePath: 'docs/prebid-server',
        sidebarPath: './sidebars.pbs.ts',
        showLastUpdateTime: true
        // ... other options
      },
    ],
    [tocPlugin, {
      filter: (doc) => doc.frontMatter.layout === 'bidder',
      contentDocsId: 'prebidjs',
      output: 'docs/prebid/bidders.json'
    }],
  ]
};

export default config;