import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'Journeys',
      items: [
        'journeys/overview',
        'journeys/creating-journey',
        'journeys/journey-configuration',
        'journeys/transitions-rules',
        'journeys/engagements',
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

