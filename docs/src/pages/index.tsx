import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">
            The control panel for orchestrating <Link to="/raven" style={{ fontWeight: 'bold', color: 'inherit', textDecoration: 'underline' }}>Raven</Link>'s customer engagement platform
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--lg', styles.getStartedButton)}
              to="/docs/development/getting-started">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  icon: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Journey Builder',
    icon: '🚀',
    description: (
      <>
        Create user journeys with an intuitive visual editor.
        Define triggers, set schedules, and design engaging content.
      </>
    ),
  },
  {
    title: 'Cohort Targeting',
    icon: '👥',
    description: (
      <>
        Target specific user segments with precision.
      </>
    ),
  },
  {
    title: 'Event-Driven',
    icon: '⚡',
    description: (
      <>
        Trigger journeys based on user actions, page views, or custom events.
      </>
    ),
  },
  {
    title: 'Content Editor',
    icon: '📝',
    description: (
      <>
        Design beautiful in-app content with live preview. Choose from 
        templates or build custom layouts by adding and configuring elements.
      </>
    ),
  },
  {
    title: 'Smart Scheduling',
    icon: '📅',
    description: (
      <>
        Schedule journeys with flexible timing options. Set recurring schedules and
        active hours.
      </>
    ),
  },
  {
    title: 'Multi-Tenant',
    icon: '🏢',
    description: (
      <>
        Manage multiple organizations from a single platform.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepageTechStack() {
  const technologies = [
    { name: 'Next.js 15', icon: '▲' },
    { name: 'React 19', icon: '⚛️' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'Material UI', icon: '🎨' },
    { name: 'TanStack Query', icon: '🔄' },
    { name: 'Tailwind CSS', icon: '💨' },
  ];

  return (
    <section className={styles.techStack}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2">Built with Modern Tech</Heading>
          <p>Powered by the latest technologies for optimal performance</p>
        </div>
        <div className={styles.techGrid}>
          {technologies.map((tech, idx) => (
            <div key={idx} className={styles.techItem}>
              <span className={styles.techIcon}>{tech.icon}</span>
              <span className={styles.techName}>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} Documentation`}
      description="Customer Journey Management Platform - Documentation and guides">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

