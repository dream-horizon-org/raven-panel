import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Raven',
  tagline: 'Customer Journey Management Platform',
  favicon: 'img/favicon.ico',

  url: 'https://dream-horizon-org.github.io',
  baseUrl: '/raven-panel/',  

  organizationName: 'dream-horizon-org',
  projectName: 'raven-panel',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/dream-horizon-org/raven-panel/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/raven-social-card.png',
    navbar: {
      title: 'Raven',
      logo: {
        alt: 'Raven Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/dream-horizon-org/raven-panel',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Architecture',
              to: '/docs/architecture',
            },
          ],
        },
        {
          title: 'Features',
          items: [
            {
              label: 'Journeys',
              to: '/docs/features/journeys',
            },
            {
              label: 'Cohorts',
              to: '/docs/features/cohorts',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'API Reference',
              to: '/docs/api/overview',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/dream-horizon-org/raven-panel',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Raven Panel. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'bash', 'json'],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

