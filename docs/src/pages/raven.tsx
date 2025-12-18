import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './raven.module.css';
import clsx from 'clsx';
import Heading from '@theme/Heading';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.hero__title}>Raven</h1>
          <p className={styles.hero__subtitle}>The Complete Platform for Customer Engagement and User Experience Management</p>
        </div>
      </div>
    </header>
  );
}

function FeatureCard({title, description, icon, link, buttonText}) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
      <Link className={styles.learnMoreButton} to={link}>
        {buttonText} &rarr;
      </Link>
    </div>
  );
}

function DetailFeature({title, description, icon}) {
  return (
    <div className="col col--4 margin-bottom--lg">
      <div className={styles.detailFeature}>
        <div className={styles.featureIcon}>{icon}</div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function RavenPromo() {
  return (
    <Layout
      title="Raven Platform"
      description="The Complete Platform for Customer Engagement">
      <HomepageHeader />
      <main>
        {/* Platform Components Section */}
        <section className={styles.features}>
          <div className="container">
            <h2 className="text--center margin-bottom--lg">Raven Platform Components</h2>
            <p className="text--center margin-bottom--xl" style={{maxWidth: '800px', margin: '0 auto 3rem'}}>A complete suite of tools working together to deliver exceptional user experiences</p>
            
            <div className={styles.cardContainer}>
              <FeatureCard 
                title="Raven Client"
                icon="📱"
                description="React Native SDK for in-app messaging, nudges, tooltips, and engagement. Built with a sophisticated state machine system."
                link="https://dream-horizon-org.github.io/raven-client/"
                buttonText="Learn More"
              />
              <FeatureCard 
                title="Raven Thunder"
                icon="⚡"
                description="High-performance backend service built with Java 17 + Vert.x for managing user journeys and engagement logic."
                link="https://dream-horizon-org.github.io/raven-thunder/"
                buttonText="Learn More"
              />
              <FeatureCard 
                title="Raven Panel"
                icon="📊"
                description="Intuitive dashboard for managing customer journeys. Create, configure, and monitor your engagement campaigns."
                link="/"
                buttonText="Learn More"
              />
            </div>
          </div>
        </section>

        {/* Why Choose Raven Section */}
        <section className={styles.detailsSection}>
          <div className="container">
            <h2 className="text--center margin-bottom--lg">Why Choose Raven?</h2>
            <p className="text--center margin-bottom--xl" style={{maxWidth: '800px', margin: '0 auto 3rem'}}>Powerful features designed to help you create exceptional user experiences</p>
            
            <div className="row">
              <DetailFeature 
                icon="🎯"
                title="Contextual Engagement"
                description="Display contextual nudges, bottom sheets, and tooltips that engage users at the right moment with intelligent timing."
              />
              <DetailFeature 
                icon="🔄"
                title="State Machine DSL"
                description="Define complex user flows with a powerful State Machine DSL. Create multi-step nudges and conditional transitions."
              />
              <DetailFeature 
                icon="📊"
                title="Event-Driven Architecture"
                description="Trigger engagement based on app events in real-time. Create experiences that respond dynamically to user behavior."
              />
              <DetailFeature 
                icon="⏱️"
                title="Frequency Control"
                description="Fine-grained frequency rules including session-based, window-based, and lifespan-based controls."
              />
              <DetailFeature 
                icon="🏷️"
                title="Behaviour Tags"
                description="Organize and manage multiple engagements together using behaviour tags with shared exposure rules."
              />
              <DetailFeature 
                icon="📱"
                title="Cross-Platform"
                description="Works seamlessly on both iOS and Android with a unified API, ensuring consistent experiences."
              />
              <DetailFeature 
                icon="🎨"
                title="Fully Customizable"
                description="Customize every aspect of UI components to match your app's design system and branding."
              />
              <DetailFeature 
                icon="🚀"
                title="High Performance"
                description="Built with performance in mind. Lightweight SDK, efficient state management, and optimized rendering."
              />
               <DetailFeature 
                icon="🔒"
                title="Enterprise Ready"
                description="Scalable architecture, comprehensive analytics, error handling, and production-ready features."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <div className="container text--center">
            <Heading as="h2">Ready to Get Started?</Heading>
            <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>Start building exceptional user experiences with Raven today.</p>
            <div className={styles.buttons}>
              <Link
                className={styles.primaryButton}
                to="/docs/development/getting-started">
                Get Started with Raven Panel
              </Link>
              <Link
                className={styles.secondaryButton}
                to="https://github.com/dream-horizon-org/raven-panel">
                View on GitHub
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
