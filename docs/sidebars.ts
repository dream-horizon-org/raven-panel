import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/journeys',
        'features/create-journey',
        'features/cohorts',
        'features/events',
        'features/content-editor',
        'features/scheduling',
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

