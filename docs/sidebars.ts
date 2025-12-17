import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
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
        'development/getting-started',
        'development/deployment',
        'development/testing',
        'development/contributing',
      ],
    },
  ],
};

export default sidebars;

