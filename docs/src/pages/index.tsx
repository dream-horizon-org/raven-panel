import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// Professional SVG Icons
const DashboardIcon = ({ color = '#6366f1' }: { color?: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill={color} fillOpacity="0.9"/>
  </svg>
);

const MobileIcon = ({ color = '#10b981' }: { color?: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 18H7V6H17V18Z" fill={color} fillOpacity="0.9"/>
  </svg>
);

const BackendIcon = ({ color = '#f59e0b' }: { color?: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill={color} fillOpacity="0.9"/>
    <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill={color} fillOpacity="0.9"/>
  </svg>
);

const EventIcon = ({ color = '#fca5a5' }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="5" width="16" height="15" rx="2" fill={color} fillOpacity="0.15"/>
    <rect x="4" y="5" width="16" height="15" rx="2" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M8 2V6M16 2V6M4 9H20" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="7" cy="13" r="1.5" fill={color}/>
    <circle cx="12" cy="13" r="1.5" fill={color}/>
    <circle cx="17" cy="13" r="1.5" fill={color}/>
  </svg>
);

const VisualIcon = ({ color = '#a5b4fc' }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M6.5 6.5H17.5M6.5 17.5H17.5M6.5 6.5V17.5M17.5 6.5V17.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const TargetIcon = ({ color = '#fcd34d' }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 9L22 9L16 14L18 21L12 16L6 21L8 14L2 9L9 9L12 2Z" fill={color} fillOpacity="0.15"/>
    <path d="M12 2L15 9L22 9L16 14L18 21L12 16L6 21L8 14L2 9L9 9L12 2Z" stroke={color} strokeWidth="2.5" fill="none"/>
    <circle cx="12" cy="12" r="2" fill={color} fillOpacity="0.3"/>
    <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M12 6L12 8M12 16L12 18M6 12L8 12M16 12L18 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const StateIcon = ({ color = '#c4b5fd' }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="6" height="6" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="3" y="3" width="6" height="6" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="15" y="3" width="6" height="6" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="15" y="3" width="6" height="6" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="3" y="15" width="6" height="6" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="3" y="15" width="6" height="6" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="15" y="15" width="6" height="6" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="15" y="15" width="6" height="6" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M9 6H15M6 9V15M18 9V15M9 18H15" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M9 6L12 9M15 6L12 9M6 9L9 12M18 9L15 12M9 18L12 15M15 18L12 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="6" cy="6" r="1" fill={color}/>
    <circle cx="18" cy="6" r="1" fill={color}/>
    <circle cx="6" cy="18" r="1" fill={color}/>
    <circle cx="18" cy="18" r="1" fill={color}/>
  </svg>
);

const PlatformIcon = ({ color = '#6ee7b7' }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="9" height="12" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="2" y="6" width="9" height="12" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="13" y="6" width="9" height="12" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="13" y="6" width="9" height="12" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M6.5 9H8.5M6.5 12H8.5M6.5 15H8.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M17.5 9H19.5M17.5 12H19.5M17.5 15H19.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const AnalyticsIcon = ({ color = '#67e8f9' }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 20H21" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="5" y="14" width="3" height="4" rx="0.5" fill={color} fillOpacity="0.3"/>
    <rect x="5" y="14" width="3" height="4" rx="0.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="10" y="10" width="3" height="8" rx="0.5" fill={color} fillOpacity="0.3"/>
    <rect x="10" y="10" width="3" height="8" rx="0.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="15" y="6" width="3" height="12" rx="0.5" fill={color} fillOpacity="0.3"/>
    <rect x="15" y="6" width="3" height="12" rx="0.5" stroke={color} strokeWidth="2.5" fill="none"/>
  </svg>
);

const ClockIcon = ({ color = '#fdba74' }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.15"/>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M12 6V12L16 14" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="1.5" fill={color}/>
    <path d="M12 3V5M12 19V21M3 12H5M19 12H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CustomizeIcon = ({ color = '#f9a8d4' }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="7" height="7" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="4" y="4" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="13" y="4" width="7" height="7" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="13" y="4" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="4" y="13" width="7" height="7" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="4" y="13" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="13" y="13" width="7" height="7" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="13" y="13" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M7.5 7.5H16.5M7.5 16.5H16.5M7.5 7.5V16.5M16.5 7.5V16.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const OnboardingIcon = ({ color = '#a5b4fc' }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="3.5" fill={color} fillOpacity="0.15"/>
    <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M6 20V18C6 15.79 7.79 14 10 14H14C16.21 14 18 15.79 18 18V20" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M12 3V6M12 6L14 8M12 6L10 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="8" r="1.5" fill={color}/>
  </svg>
);

const DiscoveryIcon = ({ color = '#fcd34d' }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="6" height="6" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="4" y="4" width="6" height="6" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="14" y="4" width="6" height="6" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="14" y="4" width="6" height="6" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="4" y="14" width="6" height="6" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="4" y="14" width="6" height="6" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="14" y="14" width="6" height="6" rx="1.5" fill={color} fillOpacity="0.15"/>
    <rect x="14" y="14" width="6" height="6" rx="1.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M7 7H17M7 17H17M7 7V17M17 7V17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="7" cy="7" r="1.5" fill={color}/>
    <circle cx="17" cy="7" r="1.5" fill={color}/>
    <circle cx="7" cy="17" r="1.5" fill={color}/>
    <circle cx="17" cy="17" r="1.5" fill={color}/>
  </svg>
);

const ConversionIcon = ({ color = '#6ee7b7' }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7H7L9 18H20" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="9" cy="20" r="2" fill={color} fillOpacity="0.25"/>
    <circle cx="9" cy="20" r="2" stroke={color} strokeWidth="2.5" fill="none"/>
    <circle cx="19" cy="20" r="2" fill={color} fillOpacity="0.25"/>
    <circle cx="19" cy="20" r="2" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M15 7L20 2M20 2L18 0M20 2L18 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="3" width="5" height="4" rx="1" fill={color} fillOpacity="0.15"/>
  </svg>
);

const ReengageIcon = ({ color = '#c4b5fd' }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" fill={color} fillOpacity="0.15"/>
    <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M12 4L16 8L12 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="12" cy="12" r="2.5" fill={color} fillOpacity="0.25"/>
    <circle cx="12" cy="12" r="2.5" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M8 16L6 18M18 8L20 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const docsUrl = useBaseUrl('/docs');
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>Complete Customer Engagement Platform</span>
          </div>
          <Heading as="h1" className="hero__title">
            Guide Users. Drive Conversions.
          </Heading>
          <p className="hero__subtitle">
            Build intelligent, event-driven customer journeys with in-app nudges, tooltips, and personalized engagements. 
            Everything you need to guide users and drive conversions all in one platform.
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--lg button--primary', styles.getStartedButton)}
              to={`${docsUrl}/getting-started`}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.heroGradient}></div>
    </header>
  );
}

type ComponentItem = {
  title: string;
  icon: React.ReactNode;
  description: string;
  link: string;
  color: string;
  features: string[];
  useCase: string;
};

const Components: ComponentItem[] = [
  {
    title: 'Web Dashboard',
    icon: <DashboardIcon color="#6366f1" />,
    description: 'Visual journey builder and web dashboard for orchestrating customer engagement flows',
    link: 'raven-panel/intro',
    color: '#6366f1',
    useCase: 'Create and manage customer journeys without code',
    features: ['Visual Journey Builder', 'Cohort Targeting', 'Content Editor', 'Smart Scheduling'],
  },
  {
    title: 'Mobile SDK',
    icon: <MobileIcon color="#10b981" />,
    description: 'React Native SDK for in-app messaging, nudges, tooltips, and event-driven engagements',
    link: 'raven-client/introduction',
    color: '#10b981',
    useCase: 'Deliver contextual experiences in your mobile app',
    features: ['State Machine DSL', 'Event-Driven', 'Cross-Platform', 'Customizable UI'],
  },
  {
    title: 'Backend',
    icon: <BackendIcon color="#f59e0b" />,
    description: 'High-performance backend service for managing CTAs, nudges, and behavior tags at scale',
    link: 'raven-thunder/getting-started/overview',
    color: '#f59e0b',
    useCase: 'Power your engagement platform with enterprise-grade APIs',
    features: ['REST APIs', 'Aerospike Integration', 'Multi-Module Architecture', 'Docker Ready'],
  },
];

function ComponentCard({title, icon, description, link, color, features, useCase}: ComponentItem) {
  const docsUrl = useBaseUrl('/docs');
  return (
    <Link 
      to={`${docsUrl}/${link}`} 
      className={styles.componentCard}
      style={{ '--component-color': color } as React.CSSProperties}>
      <div className={styles.componentHeader}>
        <div className={styles.componentIcon} style={{ backgroundColor: `${color}10`, color: color }}>
          {icon}
        </div>
        <Heading as="h3" className={styles.componentTitle}>{title}</Heading>
        <p className={styles.componentUseCase}>{useCase}</p>
      </div>
      <p className={styles.componentDescription}>{description}</p>
      <div className={styles.componentFeatures}>
        {features.map((feature, idx) => (
          <span key={idx} className={styles.featureTag} style={{ borderColor: `${color}30`, color: color, backgroundColor: `${color}08` }}>
            {feature}
          </span>
        ))}
      </div>
      <div className={styles.componentLink}>
        Learn more
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Link>
  );
}

function HomepageComponents() {
  return (
    <section className={styles.components}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2">One Platform, Three Powerful Components</Heading>
          <p>Raven consists of three integrated components that work seamlessly together to deliver exceptional customer engagement</p>
        </div>
        <div className={styles.componentsGrid}>
          {Components.map((component, idx) => (
            <ComponentCard key={idx} {...component} />
          ))}
        </div>
      </div>
    </section>
  );
}

type UseCaseItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const UseCases: UseCaseItem[] = [
  {
    title: 'Onboarding New Users',
    description: 'Guide new users through your app with contextual tooltips and step-by-step nudges',
    icon: <OnboardingIcon color="#a5b4fc" />,
    color: '#a5b4fc',
  },
  {
    title: 'Feature Discovery',
    description: 'Highlight new features and capabilities at the right moment to increase adoption',
    icon: <DiscoveryIcon color="#fcd34d" />,
    color: '#fcd34d',
  },
  {
    title: 'Conversion Optimization',
    description: 'Reduce cart abandonment and drive conversions with timely prompts and offers',
    icon: <ConversionIcon color="#6ee7b7" />,
    color: '#6ee7b7',
  },
  {
    title: 'User Re-engagement',
    description: 'Re-engage inactive users with personalized messages and relevant content',
    icon: <ReengageIcon color="#c4b5fd" />,
    color: '#c4b5fd',
  },
];

function UseCaseCard({title, description, icon, color}: UseCaseItem) {
  return (
    <div className={styles.useCaseCard}>
      <div className={styles.useCaseIcon} style={{ color: color }}>{icon}</div>
      <Heading as="h3" className={styles.useCaseTitle}>{title}</Heading>
      <p className={styles.useCaseDescription}>{description}</p>
    </div>
  );
}

function HomepageUseCases() {
  return (
    <section className={styles.useCases}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2">Use Cases</Heading>
          <p>Common scenarios where Raven helps you create better user experiences</p>
        </div>
        <div className={styles.useCasesGrid}>
          {UseCases.map((useCase, idx) => (
            <UseCaseCard key={idx} {...useCase} />
          ))}
        </div>
      </div>
    </section>
  );
}

type FeatureItem = {
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
};

const Features: FeatureItem[] = [
  {
    title: 'Event-Driven Architecture',
    icon: <EventIcon color="#fca5a5" />,
    description: 'Trigger engagements based on user actions, page views, or custom events in real-time',
    color: '#fca5a5',
  },
  {
    title: 'Visual Journey Builder',
    icon: <VisualIcon color="#a5b4fc" />,
    description: 'Create complex user journeys with an intuitive drag-and-drop interface. No code required.',
    color: '#a5b4fc',
  },
  {
    title: 'Smart Targeting',
    icon: <TargetIcon color="#fcd34d" />,
    description: 'Target specific user segments with precision using cohorts, behavior tags, and filters',
    color: '#fcd34d',
  },
  {
    title: 'State Machine DSL',
    icon: <StateIcon color="#c4b5fd" />,
    description: 'Define sophisticated engagement flows with a powerful state machine system',
    color: '#c4b5fd',
  },
  {
    title: 'Cross-Platform SDK',
    icon: <PlatformIcon color="#6ee7b7" />,
    description: 'Works seamlessly on iOS and Android with a single React Native codebase',
    color: '#6ee7b7',
  },
  {
    title: 'Real-Time Analytics',
    icon: <AnalyticsIcon color="#67e8f9" />,
    description: 'Track engagement performance, user interactions, and conversion metrics',
    color: '#67e8f9',
  },
  {
    title: 'Frequency Control',
    icon: <ClockIcon color="#fdba74" />,
    description: 'Control how often engagements are shown with session, window, or lifespan-based rules',
    color: '#fdba74',
  },
  {
    title: 'Customizable UI',
    icon: <CustomizeIcon color="#f9a8d4" />,
    description: 'Fully customizable nudges, tooltips, and bottom sheets to match your brand',
    color: '#f9a8d4',
  },
];

function Feature({title, icon, description, color}: FeatureItem) {
  return (
    <div className={clsx('col col--3', styles.feature)}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon} style={{ color: color }}>{icon}</div>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2">Powerful Features</Heading>
          <p>Everything you need to create engaging customer experiences</p>
        </div>
        <div className="row">
          {Features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepageCTA() {
  const docsUrl = useBaseUrl('/docs');
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.ctaContent}>
          <Heading as="h2">Ready to Transform Your User Experience?</Heading>
          <p>Start building intelligent customer journeys today. Get up and running in minutes.</p>
          <div className={styles.ctaButtons}>
            <Link
              className={clsx('button button--lg button--primary', styles.ctaButton)}
              to={`${docsUrl}/getting-started`}>
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Raven - Customer Engagement Platform"
      description="Build intelligent, event-driven customer journeys with in-app nudges, tooltips, and personalized engagements. Complete platform with Panel, Client SDK, and Thunder backend.">
      <HomepageHeader />
      <main>
        <HomepageUseCases />
        <HomepageFeatures />
        <HomepageComponents />
        <HomepageCTA />
      </main>
    </Layout>
  );
}
