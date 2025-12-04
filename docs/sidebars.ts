import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'getting-started',
    'architecture',
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/journeys',
        'features/cohorts',
        'features/events',
        'features/content-editor',
        'features/scheduling',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
        'api/journeys-api',
        'api/cohorts-api',
        'api/events-api',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/contributing',
        'development/testing',
        'development/deployment',
      ],
    },
  ],
};

export default sidebars;

