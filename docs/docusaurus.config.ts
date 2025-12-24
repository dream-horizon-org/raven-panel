import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Raven',
  tagline: 'Complete documentation for Raven Dashboard, Raven Client, and Raven Thunder',
  favicon: 'img/favicon.svg',

  url: 'https://dream-horizon-org.github.io',
  baseUrl: '/',  

  organizationName: 'dream-horizon-org',
  projectName: 'raven-panel',

  onBrokenLinks: 'warn',

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
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themeConfig: {
    image: 'img/raven-social-card.png',
    navbar: {
      title: 'Raven',
      logo: {
        alt: 'Raven Logo',
        src: 'img/icon.svg',
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
          title: 'Web Dashboard',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/raven-panel/development/getting-started',
            },
            {
              label: 'Journeys Overview',
              to: '/docs/raven-panel/journeys/overview',
            },
          ],
        },
        {
          title: 'Mobile SDK',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/raven-client/getting-started/installation',
            },
            {
              label: 'Introduction',
              to: '/docs/raven-client/introduction',
            },
          ],
        },
        {
          title: 'Backend',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/raven-thunder/getting-started/overview',
            },
            {
              label: 'Quickstart',
              to: '/docs/raven-thunder/getting-started/quickstart',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/dream-horizon-org/raven-panel',
            },
          ],
        },
      ],
      copyright: `Copyright © 2025 Dream Horizon.`,
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


