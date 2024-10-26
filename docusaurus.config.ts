import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const { themes } = require('prism-react-renderer');

const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
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
          routeBasePath: "/",
          path: "docs",
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/prebid/prebid.github.io/tree/master",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      } satisfies Preset.Options,
    ],
  ],

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
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Tutorial",
          },
          {
            href: "https://github.com/prebid/prebid.github.io",
            label: "GitHub",
            position: "right",
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
    async function frontMatterFiles(context, options) {
      return {
        name: 'frontmatter-files',
        async loadContent() {
          // The loadContent hook is executed after siteConfig and env has been loaded.
          // You can return a JavaScript object that will be passed to contentLoaded hook.
          return {
            files: []
          }
        },

        async contentLoaded({ content, actions }) {
          console.log('frontMatterFiles contentLoaded')
          console.log(content)
          // The contentLoaded hook is done after loadContent hook is done.
          // `actions` are set of functional API provided by Docusaurus (e.g. addRoute)
        },

      };
    }
  ]
};

export default config;