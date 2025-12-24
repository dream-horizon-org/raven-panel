import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
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
  const docsUrl = useBaseUrl('/docs');
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>🚀 Open Source Customer Engagement Platform</span>
          </div>
          <Heading as="h1" className="hero__title">
            Build Intelligent Customer Journeys
            <br />
            <span className={styles.heroTitleAccent}>That Drive Growth</span>
          </Heading>
          <p className="hero__subtitle">
            Create event-driven user experiences with personalized engagement formats. 
            Everything product teams need to guide users, increase adoption, and boost conversions all in one powerful platform.
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--lg', styles.docsButton)}
              to={`${docsUrl}/introduction`}>
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
  icon: React.ReactNode;
  description: string;
  link: string;
  color: string;
  features: string[];
  useCase: string;
};

const Components: ComponentItem[] = [
  {
    title: 'Web Panel',
    icon: <DashboardIcon color="#6366f1" />,
    description: 'A web-based dashboard where product managers and marketers create, manage, and optimize customer engagement campaigns. Build journeys visually with drag and drop no coding skills needed.',
    link: 'raven-panel/intro',
    color: '#6366f1',
    useCase: 'For Product Teams: Create campaigns without code',
    features: ['Visual Journey Builder', 'User Targeting', 'Content Editor', 'Performance Tracking'],
  },
  {
    title: 'Mobile SDK',
    icon: <MobileIcon color="#10b981" />,
    description: 'A mobile app integration that displays your engagements to users. Works on both iOS and Android, showing nudges, tooltips, and messages exactly when you configure them in the dashboard.',
    link: 'raven-client/introduction',
    color: '#10b981',
    useCase: 'For Your Mobile App: Show engagements to users',
    features: ['Works on iOS & Android', 'Real-Time Updates', 'Fully Customizable', 'Easy Integration'],
  },
  {
    title: 'Backend',
    icon: <BackendIcon color="#f59e0b" />,
    description: 'The backend service that powers everything. Handles all the technical work managing user data, processing events, and delivering engagements at scale. Your engineering team can deploy it easily.',
    link: 'raven-thunder/getting-started/overview',
    color: '#f59e0b',
    useCase: 'For Your Infrastructure: Powers the entire platform',
    features: ['High Performance', 'Easy Deployment', 'Scalable', 'Production Ready'],
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
        <div className={styles.componentTitleWrapper}>
          <Heading as="h3" className={styles.componentTitle}>{title}</Heading>
          <span className={styles.openSourceBadge}>Open Source</span>
        </div>
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
          <div className={styles.sectionLabel}>Raven Components</div>
          <Heading as="h2">Three Open Source Components, One Complete Platform</Heading>
          <p>Raven consists of three fully open source components that work together seamlessly. Use them all for a complete solution, or integrate individual components into your existing tools.</p>
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
  image: string;
  color: string;
};

const UseCases: UseCaseItem[] = [
  {
    title: 'Onboard New Users with Guided Tours',
    description: 'Create step-by-step onboarding journeys that guide first-time users through your app. Show contextual tooltips when users land on key screens, display bottom sheets explaining core features, and use multi-step flows to ensure users reach their "aha moment" faster.',
    image: 'img/use-cases/onboarding.svg',
    color: '#6366f1',
  },
  {
    title: 'Drive Feature Discovery at the Right Moment',
    description: 'Highlight new or underused features exactly when users need them. Show tooltips when users navigate to relevant screens, trigger bottom sheets after specific actions, and guide users to discover features that solve their immediate problems.',
    image: 'img/use-cases/feature-discovery.svg',
    color: '#f59e0b',
  },
  {
    title: 'Reduce Drop-offs in Critical Flows',
    description: 'Deploy targeted nudges during checkout, signup, or upgrade flows to minimize abandonment. Show helpful tooltips explaining form fields, display bottom sheets with special offers, or use popups to address concerns that might cause users to leave.',
    image: 'img/use-cases/conversion.svg',
    color: '#10b981',
  },
  {
    title: 'Re-engage Inactive Users with Personalized Campaigns',
    description: 'Win back users who haven\'t logged in recently by targeting them with relevant messages. Create journeys that trigger when inactive users return, show them what\'s new, highlight features they haven\'t tried, or offer incentives to re-engage.',
    image: 'img/use-cases/re-engagement.svg',
    color: '#8b5cf6',
  },
];

// Animated Mobile Tooltip Component for Guided Tours
function AnimatedMobileTooltip({ color }: { color: string }) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Show for 3 seconds
    }, 5000); // Repeat every 5 seconds

    // Initial delay
    setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.mobileFrame}>
      <div className={styles.mobileScreen}>
        {/* Mock app content */}
        <div className={styles.mockAppContent}>
          <div className={styles.mockHeader}>
            <div className={styles.mockStatusBar}>
              <span>9:41</span>
              <div className={styles.mockBattery}></div>
            </div>
            <div className={styles.mockNavBar}>
              <div className={styles.mockNavItem}></div>
              <div className={styles.mockNavItem}></div>
              <div className={styles.mockNavItem}></div>
            </div>
          </div>
          <div className={styles.mockContent}>
            <div className={styles.mockCard}></div>
            <div className={styles.mockCard}></div>
            <div className={styles.mockCard}></div>
          </div>
        </div>
        
        {/* Animated Tooltip */}
        <div 
          className={clsx(styles.animatedTooltip, isVisible && styles.animatedTooltipVisible)}
          style={{ '--tooltip-color': color } as React.CSSProperties}>
          <div className={styles.tooltipArrow}></div>
          <div className={styles.tooltipContent}>
            <div className={styles.tooltipTitle}>Start Your Journey</div>
            <div className={styles.tooltipText}>Follow this guide to explore key features and reach your aha moment faster</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated Bottom Sheet Component for Feature Discovery
function AnimatedBottomSheet({ color }: { color: string }) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3500); // Show for 3.5 seconds
    }, 5500); // Repeat every 5.5 seconds

    // Initial delay
    setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3500);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.mobileFrame}>
      <div className={styles.mobileScreen}>
        {/* Mock app content */}
        <div className={styles.mockAppContent}>
          <div className={styles.mockHeader}>
            <div className={styles.mockStatusBar}>
              <span>9:41</span>
              <div className={styles.mockBattery}></div>
            </div>
            <div className={styles.mockNavBar}>
              <div className={styles.mockNavItem}></div>
              <div className={styles.mockNavItem}></div>
              <div className={styles.mockNavItem}></div>
            </div>
          </div>
          <div className={styles.mockContent}>
            <div className={styles.mockCard}></div>
            <div className={styles.mockCard}></div>
            <div className={styles.mockCard}></div>
          </div>
        </div>
        
        {/* Animated Bottom Sheet */}
        <div 
          className={clsx(styles.animatedBottomSheet, isVisible && styles.animatedBottomSheetVisible)}
          style={{ '--bottom-sheet-color': color } as React.CSSProperties}>
          <div className={styles.bottomSheetHandle}></div>
          <div className={styles.bottomSheetContent}>
            <div className={styles.bottomSheetTitle}>Discover New Features</div>
            <div className={styles.bottomSheetText}>Try our new advanced search to find exactly what you need. It&apos;s faster and more intuitive!</div>
            <div className={styles.bottomSheetButton}>Explore Feature</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated Popup Component for Reducing Drop-offs
function AnimatedPopup({ color }: { color: string }) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 4000); // Show for 4 seconds
    }, 6000); // Repeat every 6 seconds

    // Initial delay
    setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.mobileFrame}>
      <div className={styles.mobileScreen}>
        {/* Mock app content */}
        <div className={styles.mockAppContent}>
          <div className={styles.mockHeader}>
            <div className={styles.mockStatusBar}>
              <span>9:41</span>
              <div className={styles.mockBattery}></div>
            </div>
            <div className={styles.mockNavBar}>
              <div className={styles.mockNavItem}></div>
              <div className={styles.mockNavItem}></div>
              <div className={styles.mockNavItem}></div>
            </div>
          </div>
          <div className={styles.mockContent}>
            <div className={styles.mockCard}></div>
            <div className={styles.mockCard}></div>
            <div className={styles.mockCard}></div>
          </div>
        </div>
        
        {/* Backdrop overlay */}
        <div 
          className={clsx(styles.popupBackdrop, isVisible && styles.popupBackdropVisible)}
        ></div>
        
        {/* Animated Popup */}
        <div 
          className={clsx(styles.animatedPopup, isVisible && styles.animatedPopupVisible)}
          style={{ '--popup-color': color } as React.CSSProperties}>
          <div className={styles.popupContent}>
            <div className={styles.popupIcon}>🎁</div>
            <div className={styles.popupTitle}>Special Offer!</div>
            <div className={styles.popupText}>Complete your checkout now and get 20% off your first purchase. Limited time only!</div>
            <div className={styles.popupButtons}>
              <div className={styles.popupButtonPrimary}>Claim Offer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated Element Spotlight Component for Re-engagement
function AnimatedElementSpotlight({ color, colorRgb }: { color: string; colorRgb: string }) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Show for 3 seconds
    }, 5000); // Repeat every 5 seconds

    // Initial delay
    setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.mobileFrame}>
      <div className={styles.mobileScreen}>
        {/* Mock app content */}
        <div className={styles.mockAppContent}>
          <div className={styles.mockHeader}>
            <div className={styles.mockStatusBar}>
              <span>9:41</span>
              <div className={styles.mockBattery}></div>
            </div>
            <div className={styles.mockNavBar}>
              <div className={styles.mockNavItem}></div>
              <div className={styles.mockNavItem}></div>
              <div className={styles.mockNavItem}></div>
            </div>
          </div>
          <div className={styles.mockContent}>
            <div 
              className={clsx(
                styles.mockCard, 
                styles.spotlightCard,
                isVisible && styles.spotlightCardActive
              )}
              style={{ 
                '--spotlight-color': color,
                '--spotlight-color-rgb': colorRgb
              } as React.CSSProperties}
            >
              {isVisible && <div className={styles.spotlightBadge}>New</div>}
            </div>
            <div className={clsx(styles.mockCard, styles.spotlightCard)}></div>
            <div className={clsx(styles.mockCard, styles.spotlightCard)}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UseCaseCard({title, description, image, color, index}: UseCaseItem & { index: number }) {
  const isEven = index % 2 === 0;
  const imageUrl = useBaseUrl(image);
  
  // Convert hex color to RGB for CSS variables
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 99, g: 102, b: 241 };
  };
  
  const rgb = hexToRgb(color);
  
  return (
    <div className={clsx(styles.useCaseRow, isEven ? styles.useCaseRowLeft : styles.useCaseRowRight)}>
      <div className={styles.useCaseContent}>
        <div className={styles.useCaseNumber}>0{index + 1}</div>
        <Heading as="h3" className={styles.useCaseTitle}>{title}</Heading>
        <p className={styles.useCaseDescription}>{description}</p>
      </div>
      <div 
        className={styles.useCaseVisual} 
        style={{ 
          '--use-case-color-rgb': `${rgb.r}, ${rgb.g}, ${rgb.b}`,
          '--use-case-color': color
        } as React.CSSProperties}>
        <div className={styles.useCaseImageWrapper}>
          {index === 0 ? (
            <AnimatedMobileTooltip color={color} />
          ) : index === 1 ? (
            <AnimatedBottomSheet color={color} />
          ) : index === 2 ? (
            <AnimatedPopup color={color} />
          ) : index === 3 ? (
            <AnimatedElementSpotlight color={color} colorRgb={`${rgb.r}, ${rgb.g}, ${rgb.b}`} />
          ) : (
            <img 
              src={imageUrl} 
              alt={title}
              className={styles.useCaseImage}
              onError={(e) => {
                // Fallback to hide broken image
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
        <div className={styles.useCaseGradient}></div>
      </div>
    </div>
  );
}

function HomepageUseCases() {
  return (
    <section className={styles.useCases}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLabel}>Use Cases</div>
          <Heading as="h2">What Teams Build with Raven</Heading>
          <p>Product managers, marketers, and growth teams use Raven to create engagement campaigns that guide users, drive adoption, and boost conversions all without waiting for engineering resources.</p>
        </div>
        <div className={styles.useCasesList}>
          {UseCases.map((useCase, idx) => (
            <UseCaseCard key={idx} {...useCase} index={idx} />
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
    title: 'Trigger Engagements at the Perfect Moment',
    icon: <EventIcon color="#6366f1" />,
    description: 'Automatically display nudges and tooltips when users perform specific actions or visit key screens. Show the right engagement exactly when it matters most.',
    color: '#6366f1',
  },
  {
    title: 'Build Journeys Visually, No Code Needed',
    icon: <VisualIcon color="#8b5cf6" />,
    description: 'Create multi-step user journeys with a simple drag and drop interface. Design complex flows visually perfect for product teams who want to move fast.',
    color: '#8b5cf6',
  },
  {
    title: 'Reach the Right Users Every Time',
    icon: <TargetIcon color="#f59e0b" />,
    description: 'Target specific user groups based on their behavior, attributes, or lifecycle stage. Deliver personalized experiences to different segments automatically.',
    color: '#f59e0b',
  },
  {
    title: 'Create Multi-Step Flows with Ease',
    icon: <StateIcon color="#10b981" />,
    description: 'Build sophisticated engagement sequences that adapt based on user actions. Create conditional flows that guide users through complex processes step-by-step.',
    color: '#10b981',
  },
  {
    title: 'Works on All Mobile Platforms',
    icon: <PlatformIcon color="#06b6d4" />,
    description: 'Deploy the same engagement campaigns across iOS and Android simultaneously. One setup, consistent experiences everywhere.',
    color: '#06b6d4',
  },
  {
    title: 'Track Performance in Real-Time',
    icon: <AnalyticsIcon color="#ec4899" />,
    description: 'Monitor how your campaigns perform with instant insights into user engagement, interactions, and conversions. Make informed decisions quickly.',
    color: '#ec4899',
  },
  {
    title: 'Control How Often Engagements Appear',
    icon: <ClockIcon color="#f59e0b" />,
    description: 'Set rules to prevent engagement overload. Control frequency per session, daily, or across the app lifetime to keep users engaged without annoying them.',
    color: '#f59e0b',
  },
  {
    title: 'Match Your Brand Perfectly',
    icon: <CustomizeIcon color="#6366f1" />,
    description: 'Customize the look and feel of every engagement—nudges, tooltips, and bottom sheets—to match your brand identity. Full control over colors, fonts, and styling.',
    color: '#6366f1',
  },
];

function Feature({title, icon, description, color}: FeatureItem) {
  // Convert hex color to RGB for CSS variables
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 99, g: 102, b: 241 };
  };
  
  const rgb = hexToRgb(color);
  
  return (
    <div 
      className={styles.featureCard}
      style={{ 
        '--feature-color-rgb': `${rgb.r}, ${rgb.g}, ${rgb.b}`,
        '--feature-color': color
      } as React.CSSProperties}>
      <div className={styles.featureIcon} style={{ color: color }}>{icon}</div>
      <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLabel}>Features</div>
          <Heading as="h2">Everything You Need to Drive Growth</Heading>
          <p>Powerful capabilities that help product managers, marketers, and growth teams create effective engagement campaigns no technical expertise required.</p>
        </div>
        <div className={styles.featuresMasonry}>
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
          <Heading as="h2">Ready to Start Building with Raven?</Heading>
          <p>Everything you need to get started is in our documentation. Set up your first engagement campaign, integrate the SDK, and start guiding users all in one open source platform.</p>
          <div className={styles.ctaButtons}>
            <Link
              className={clsx('button button--lg button--primary', styles.ctaButton)}
              to={`${docsUrl}/getting-started`}>
              Start Building
            </Link>
            <Link
              className={clsx('button button--lg', styles.ctaButtonSecondary)}
              href="https://github.com/dream-horizon-org/raven-panel">
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="Raven Customer Engagement Platform"
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
