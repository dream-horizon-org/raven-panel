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
            <span>🚀 Complete Customer Engagement Platform</span>
          </div>
          <Heading as="h1" className="hero__title">
            Guide Users. Drive Conversions.
          </Heading>
          <p className="hero__subtitle">
            Build intelligent, event-driven customer journeys with in-app nudges, tooltips, and personalized engagements. 
            Everything you need to guide users and drive conversions—all in one platform.
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--lg button--primary', styles.getStartedButton)}
              to={`${docsUrl}/getting-started`}>
              Get Started Free
            </Link>
            <Link
              className={clsx('button button--lg button--outline', styles.docsButton)}
              to={`${docsUrl}/getting-started`}>
              View Documentation
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>3</div>
              <div className={styles.statLabel}>Integrated Components</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Open Source</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>∞</div>
              <div className={styles.statLabel}>Customizable</div>
            </div>
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
  useCase: string;
};

const Components: ComponentItem[] = [
  {
    title: 'Raven Dashboard',
    icon: '🎛️',
    description: 'Visual journey builder and web dashboard for orchestrating customer engagement flows',
    link: 'raven-panel/intro',
    color: '#6366f1',
    useCase: 'Create and manage customer journeys without code',
    features: ['Visual Journey Builder', 'Cohort Targeting', 'Content Editor', 'Smart Scheduling'],
  },
  {
    title: 'Raven Client',
    icon: '📱',
    description: 'React Native SDK for in-app messaging, nudges, tooltips, and event-driven engagements',
    link: 'raven-client/introduction',
    color: '#10b981',
    useCase: 'Deliver contextual experiences in your mobile app',
    features: ['State Machine DSL', 'Event-Driven', 'Cross-Platform', 'Customizable UI'],
  },
  {
    title: 'Raven Thunder',
    icon: '⚡',
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
    <Link to={`${docsUrl}/${link}`} className={styles.componentCard}>
      <div className={styles.componentHeader} style={{ borderTopColor: color }}>
        <div className={styles.componentIcon} style={{ backgroundColor: `${color}15` }}>
          {icon}
        </div>
        <Heading as="h3" className={styles.componentTitle}>{title}</Heading>
        <p className={styles.componentUseCase}>{useCase}</p>
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
  icon: string;
};

const UseCases: UseCaseItem[] = [
  {
    title: 'Onboarding New Users',
    description: 'Guide new users through your app with contextual tooltips and step-by-step nudges',
    icon: '👋',
  },
  {
    title: 'Feature Discovery',
    description: 'Highlight new features and capabilities at the right moment to increase adoption',
    icon: '✨',
  },
  {
    title: 'Conversion Optimization',
    description: 'Reduce cart abandonment and drive conversions with timely prompts and offers',
    icon: '📈',
  },
  {
    title: 'User Re-engagement',
    description: 'Re-engage inactive users with personalized messages and relevant content',
    icon: '🔄',
  },
];

function UseCaseCard({title, description, icon}: UseCaseItem) {
  return (
    <div className={styles.useCaseCard}>
      <div className={styles.useCaseIcon}>{icon}</div>
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
          <Heading as="h2">Perfect For</Heading>
          <p>Common use cases where Raven helps you create better user experiences</p>
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
          <Heading as="h2">Ready to Transform Your User Experience?</Heading>
          <p>Start building intelligent customer journeys today. Get up and running in minutes.</p>
          <div className={styles.ctaButtons}>
            <Link
              className={clsx('button button--lg button--primary', styles.ctaButton)}
              to={`${docsUrl}/getting-started`}>
              Get Started Now
            </Link>
            <Link
              className={clsx('button button--lg button--outline', styles.ctaButtonSecondary)}
              to={`${docsUrl}/getting-started`}>
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
        <HomepageUseCases />
        <HomepageFeatures />
        <HomepageCTA />
      </main>
    </Layout>
  );
}
