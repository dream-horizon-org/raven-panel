import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const docsUrl = useBaseUrl('/docs');
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>✨ Complete Customer Engagement Platform</span>
          </div>
          <Heading as="h1" className="hero__title">
            Raven
          </Heading>
          <p className="hero__subtitle">
            Build intelligent, event-driven customer journeys with in-app nudges, tooltips, and personalized engagements. 
            Everything you need to guide users and drive conversions.
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--lg button--primary', styles.getStartedButton)}
              to={`${docsUrl}/raven-panel/intro`}>
              Get Started
            </Link>
            <Link
              className={clsx('button button--lg button--outline', styles.docsButton)}
              to={`${docsUrl}/raven-panel/intro`}>
              View Documentation
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
  icon: string;
  description: string;
  link: string;
  color: string;
  features: string[];
};

const Components: ComponentItem[] = [
  {
    title: 'Raven Panel',
    icon: '🎛️',
    description: 'Visual journey builder and control center for orchestrating customer engagement flows',
    link: 'raven-panel/intro',
    color: '#6366f1',
    features: ['Visual Journey Builder', 'Cohort Targeting', 'Content Editor', 'Smart Scheduling'],
  },
  {
    title: 'Raven Client',
    icon: '📱',
    description: 'React Native SDK for in-app messaging, nudges, tooltips, and event-driven engagements',
    link: 'raven-client/introduction',
    color: '#10b981',
    features: ['State Machine DSL', 'Event-Driven', 'Cross-Platform', 'Customizable UI'],
  },
  {
    title: 'Raven Thunder',
    icon: '⚡',
    description: 'High-performance backend service for managing CTAs, nudges, and behavior tags at scale',
    link: 'raven-thunder',
    color: '#f59e0b',
    features: ['REST APIs', 'Aerospike Integration', 'Multi-Module Architecture', 'Docker Ready'],
  },
];

function ComponentCard({title, icon, description, link, color, features}: ComponentItem) {
  const docsUrl = useBaseUrl('/docs');
  return (
    <Link to={`${docsUrl}/${link}`} className={styles.componentCard}>
      <div className={styles.componentHeader} style={{ borderTopColor: color }}>
        <div className={styles.componentIcon} style={{ backgroundColor: `${color}15` }}>
          {icon}
        </div>
        <Heading as="h3" className={styles.componentTitle}>{title}</Heading>
      </div>
      <p className={styles.componentDescription}>{description}</p>
      <div className={styles.componentFeatures}>
        {features.map((feature, idx) => (
          <span key={idx} className={styles.featureTag} style={{ borderColor: `${color}40`, color: color }}>
            {feature}
          </span>
        ))}
      </div>
      <div className={styles.componentLink}>
        Learn more →
      </div>
    </Link>
  );
}

function HomepageComponents() {
  return (
    <section className={styles.components}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2">Three Powerful Components, One Platform</Heading>
          <p>Raven consists of three integrated components that work together to deliver seamless customer engagement</p>
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

type FeatureItem = {
  title: string;
  icon: string;
  description: string;
};

const Features: FeatureItem[] = [
  {
    title: 'Event-Driven Architecture',
    icon: '⚡',
    description: 'Trigger engagements based on user actions, page views, or custom events in real-time',
  },
  {
    title: 'Visual Journey Builder',
    icon: '🎨',
    description: 'Create complex user journeys with an intuitive drag-and-drop interface. No code required.',
  },
  {
    title: 'Smart Targeting',
    icon: '🎯',
    description: 'Target specific user segments with precision using cohorts, behavior tags, and filters',
  },
  {
    title: 'State Machine DSL',
    icon: '🔄',
    description: 'Define sophisticated engagement flows with a powerful state machine system',
  },
  {
    title: 'Cross-Platform SDK',
    icon: '📱',
    description: 'Works seamlessly on iOS and Android with a single React Native codebase',
  },
  {
    title: 'Real-Time Analytics',
    icon: '📊',
    description: 'Track engagement performance, user interactions, and conversion metrics',
  },
  {
    title: 'Frequency Control',
    icon: '⏱️',
    description: 'Control how often engagements are shown with session, window, or lifespan-based rules',
  },
  {
    title: 'Customizable UI',
    icon: '🎨',
    description: 'Fully customizable nudges, tooltips, and bottom sheets to match your brand',
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--3', styles.feature)}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
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
          <Heading as="h2">Ready to Get Started?</Heading>
          <p>Start building intelligent customer journeys today</p>
          <div className={styles.ctaButtons}>
            <Link
              className={clsx('button button--lg button--primary', styles.ctaButton)}
              to={`${docsUrl}/raven-panel/intro`}>
              Start Building
            </Link>
            <Link
              className={clsx('button button--lg button--outline', styles.ctaButtonSecondary)}
              to={`${docsUrl}/raven-panel/intro`}>
              Browse Documentation
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
        <HomepageComponents />
        <HomepageFeatures />
        <HomepageCTA />
      </main>
    </Layout>
  );
}
