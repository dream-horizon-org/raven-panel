import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Raven',
  tagline: '*Tagline to be added',
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

  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
  },

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
              label: 'Journeys',
              to: '/docs/journeys/overview',
            },
          ],
        },
        {
          title: 'Journeys',
          items: [
            {
              label: 'Overview',
              to: '/docs/journeys/overview',
            },
            {
              label: 'Creating a Journey',
              to: '/docs/journeys/creating-journey',
            },
            {
              label: 'Engagements',
              to: '/docs/journeys/engagements',
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

