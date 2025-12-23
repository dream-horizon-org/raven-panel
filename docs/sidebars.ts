import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Raven',
      collapsed: true,
      items: [
        'getting-started',
        {
          type: 'category',
          label: 'Web Dashboard',
          collapsed: true,
          items: [
            'raven-panel/intro',
            {
              type: 'category',
              label: 'Journeys',
              collapsed: true,
              items: [
                'raven-panel/journeys/overview',
                'raven-panel/journeys/creating-journey',
                'raven-panel/journeys/journey-configuration',
                'raven-panel/journeys/transitions-rules',
                'raven-panel/journeys/engagements',
              ],
            },
            {
              type: 'category',
              label: 'Development',
              collapsed: true,
              items: [
                'raven-panel/development/getting-started',
                'raven-panel/development/deployment',
                'raven-panel/development/testing',
                'raven-panel/development/contributing',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Mobile SDK',
          collapsed: true,
          items: [
            'raven-client/introduction',
            {
              type: 'category',
              label: 'Getting Started',
              collapsed: true,
              items: [
                'raven-client/getting-started/installation',
                'raven-client/getting-started/quick-start',
                'raven-client/getting-started/prerequisites',
                'raven-client/getting-started/initialization',
                'raven-client/getting-started/navigation-setup',
                'raven-client/getting-started/event-processing',
              ],
            },
            {
              type: 'category',
              label: 'Concepts',
              collapsed: true,
              items: [
                'raven-client/core-concepts/cta-system',
                {
                  type: 'category',
                  label: 'State Machine DSL',
                  collapsed: true,
                  items: [
                    'raven-client/state-machine-dsl/overview',
                    'raven-client/state-machine-dsl/state-transitions',
                    'raven-client/state-machine-dsl/filters',
                    'raven-client/state-machine-dsl/actions',
                    'raven-client/state-machine-dsl/examples',
                  ],
                },
                'raven-client/core-concepts/behaviour-tags',
                'raven-client/guides/frequency-control',
                'raven-client/guides/grouping-ctas',
                'raven-client/core-concepts/filters',
              ],
            },
            {
              type: 'category',
              label: 'Features',
              collapsed: true,
              items: [
                'raven-client/features/nudges',
                'raven-client/features/tooltips',
                'raven-client/features/analytics',
              ],
            },
            {
              type: 'category',
              label: 'Guides',
              collapsed: true,
              items: [
                'raven-client/guides/customization',
                'raven-client/guides/error-handling',
              ],
            },
            {
              type: 'category',
              label: 'Examples',
              collapsed: true,
              items: [
                'raven-client/examples/basic-cta',
                'raven-client/examples/multi-step-nudge',
              ],
            },
            {
              type: 'category',
              label: 'API Reference',
              collapsed: true,
              items: [
                'raven-client/api-reference/nudge-client',
                'raven-client/api-reference/cta-handler',
                'raven-client/api-reference/tooltip-system',
                'raven-client/api-reference/types',
              ],
            },
            'raven-client/troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'Backend',
          collapsed: true,
          items: [
            'raven-thunder/index',
            {
              type: 'category',
              label: 'Getting Started',
              collapsed: true,
              items: [
                'raven-thunder/getting-started/overview',
                'raven-thunder/getting-started/core-entities',
                'raven-thunder/getting-started/quickstart',
                'raven-thunder/getting-started/running',
              ],
            },
            {
              type: 'category',
              label: 'Architecture',
              collapsed: true,
              items: [
                'raven-thunder/architecture/modules',
                'raven-thunder/architecture/configuration',
                'raven-thunder/architecture/data-model',
              ],
            },
            {
              type: 'category',
              label: 'API',
              collapsed: true,
              items: [
                'raven-thunder/api/overview',
                'raven-thunder/api/admin-contracts',
                'raven-thunder/api/thunder-api-contracts',
              ],
            },
            {
              type: 'category',
              label: 'Admin',
              collapsed: true,
              items: [
                'raven-thunder/admin/overview',
              ],
            },
            {
              type: 'category',
              label: 'Operations',
              collapsed: true,
              items: [
                'raven-thunder/operations/docker',
                'raven-thunder/operations/testing',
                'raven-thunder/operations/ci-cd',
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default sidebars;
