import React, { useState, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

const JourneyAnimation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // Total steps in the animation cycle
  // 0: Transition 1
  // 1: Transition 2
  // 2: Transition 3
  // 3: Transition 4 (to Engagement)
  const TOTAL_STEPS = 4;
  const STEP_DURATION = 3000; // 3 seconds per step

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (!isPaused) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % TOTAL_STEPS);
      }, STEP_DURATION);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Colors based on theme
  const colors = {
    bg: isDark ? '#1e293b' : '#fff',
    border: isDark ? '#334155' : '#e5e7eb',
    text: isDark ? '#e2e8f0' : '#4b5563',
    shadow: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)',
    
    // Nodes
    entryBg: isDark ? '#14532d' : '#dcfce7',
    entryBorder: isDark ? '#22c55e' : '#86efac',
    entryText: isDark ? '#dcfce7' : '#166534',
    entryTitle: isDark ? '#86efac' : '#14532d',

    actionBg: isDark ? '#581c87' : '#f3e8ff',
    actionBorder: isDark ? '#a855f7' : '#a855f7',
    actionText: isDark ? '#f3e8ff' : '#6b21a8',

    engagementBg: isDark ? '#7c2d12' : '#ffedd5',
    engagementBorder: isDark ? '#fb923c' : '#fdba74',
    engagementText: isDark ? '#ffedd5' : '#9a3412',
    engagementSub: isDark ? '#fdba74' : '#ea580c',
    engagementItalic: isDark ? '#fdba74' : '#c2410c',

    // Arrows/Lines
    lineActive: '#3b82f6',
    lineInactive: isDark ? '#475569' : '#e2e8f0',
    
    // Labels
    labelBgActive: isDark ? '#1e3a8a' : '#eff6ff',
    labelBgInactive: isDark ? '#0f172a' : '#f8fafc',
    labelTextActive: isDark ? '#bfdbfe' : '#1e40af',
    labelTextInactive: isDark ? '#64748b' : '#94a3b8',
    labelBorderActive: isDark ? '#1d4ed8' : '#dbeafe',
    labelBorderInactive: isDark ? '#334155' : '#e2e8f0',

    // Explanation Box
    explBg: isDark ? '#1e3a8a' : '#eff6ff',
    explBorder: isDark ? '#1d4ed8' : '#bfdbfe',
    explText: isDark ? '#dbeafe' : '#1e3a8a',
    explShadow: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(59, 130, 246, 0.1)',
    
    // Button
    btnBg: isDark ? '#334155' : '#fff',
    btnBorder: isDark ? '#475569' : '#e5e7eb',
    btnIcon: isDark ? '#94a3b8' : '#6b7280',
  };

  // Styles
  const containerStyle = {
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '32px',
    backgroundColor: colors.bg,
    position: 'relative' as const,
    maxWidth: '850px',
    margin: '2rem 0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    boxShadow: `0 4px 6px -1px ${colors.shadow}`,
    overflow: 'hidden',
    transition: 'background-color 0.3s, border-color 0.3s'
  };

  const buttonStyle = {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: `1px solid ${colors.btnBorder}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: colors.btnBg,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    zIndex: 10,
    transition: 'all 0.2s ease',
    outline: 'none'
  };

  const nodeBaseStyle = {
    padding: '16px 24px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    minWidth: '220px',
    boxShadow: `0 1px 3px ${colors.shadow}`,
    transition: 'all 0.5s ease',
    position: 'relative' as const,
    zIndex: 2
  };

  // Helper to render explanation box with fade animation
  const ExplanationBox = ({ isVisible, children, style = {} }: { isVisible: boolean; children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{
      flex: 1,
      paddingLeft: '32px',
      opacity: isVisible ? 1 : 0.1,
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      transform: isVisible ? 'translateX(0)' : 'translateX(10px)',
      visibility: isVisible ? 'visible' : 'hidden', 
      color: colors.text,
      ...style
    }}>
       {isVisible && (
        <div style={{
          backgroundColor: colors.explBg, 
          border: `1px solid ${colors.explBorder}`, 
          padding: '16px', 
          borderRadius: '12px',
          color: colors.explText,
          fontSize: '14px',
          lineHeight: '1.5',
          boxShadow: `0 4px 6px -1px ${colors.explShadow}`,
          animation: 'fadeIn 0.5s ease-out'
        }}>
          {children}
        </div>
       )}
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Pause/Play Button */}
      <button onClick={togglePause} style={buttonStyle} aria-label={isPaused ? "Play animation" : "Pause animation"}>
        {isPaused ? (
          // Play Icon
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.btnIcon} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        ) : (
          // Pause Icon
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.btnIcon} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="4" x2="10" y2="20"></line>
            <line x1="14" y1="4" x2="14" y2="20"></line>
          </svg>
        )}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        
        {/* --- NODE 1: Entry --- */}
        <div style={{ 
          ...nodeBaseStyle,
          border: `2px solid ${colors.entryBorder}`, 
          backgroundColor: colors.entryBg, 
          color: colors.entryText,
          opacity: activeStep === 0 ? 1 : 0.6
        }}>
          <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px', fontWeight: '600' }}>Entry Node</div>
          <div style={{ fontWeight: '700', fontSize: '15px', color: colors.entryTitle }}>User Opens App</div>
        </div>

        {/* Transition 1 */}
        <div style={{ display: 'flex', alignItems: 'center', height: '140px', width: '100%' }}>
           <div style={{ width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', position: 'relative' }}>
              <div style={{ width: '2px', height: '100%', backgroundColor: activeStep === 0 ? colors.lineActive : colors.lineInactive, transition: 'background-color 0.5s' }}></div>
              <div style={{ position: 'absolute', bottom: '0', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `8px solid ${activeStep === 0 ? colors.lineActive : colors.lineInactive}`, transition: 'border-top-color 0.5s' }}></div>
              
              <div style={{ 
                position: 'absolute', 
                top: '40%', 
                backgroundColor: activeStep === 0 ? colors.labelBgActive : colors.labelBgInactive, 
                color: activeStep === 0 ? colors.labelTextActive : colors.labelTextInactive, 
                padding: '4px 12px', 
                borderRadius: '16px', 
                fontSize: '12px', 
                fontWeight: '600',
                border: `1px solid ${activeStep === 0 ? colors.labelBorderActive : colors.labelBorderInactive}`,
                zIndex: 1,
                transition: 'all 0.5s'
              }}>
                User is logged in
              </div>
           </div>

           <ExplanationBox isVisible={activeStep === 0}>
             <div><strong>Step 1:</strong> Transition to <strong>"User Clicks Product"</strong> happens when <strong>"User Opens App"</strong> event occurs.</div>
             <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>Condition "User is logged in" is checked. If true, user proceeds.</div>
           </ExplanationBox>
        </div>

        {/* --- NODE 2 --- */}
        <div style={{ 
          ...nodeBaseStyle,
          border: `2px solid ${colors.actionBorder}`, 
          backgroundColor: colors.actionBg, 
          color: colors.actionText,
          fontWeight: '700',
          opacity: activeStep === 1 || activeStep === 0 ? 1 : 0.6
        }}>
          User Clicks Product
        </div>

        {/* Transition 2 */}
        <div style={{ display: 'flex', alignItems: 'center', height: '140px', width: '100%' }}>
           <div style={{ width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', position: 'relative' }}>
              <div style={{ width: '2px', height: '100%', backgroundColor: activeStep === 1 ? colors.lineActive : colors.lineInactive, transition: 'background-color 0.5s' }}></div>
              <div style={{ position: 'absolute', bottom: '0', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `8px solid ${activeStep === 1 ? colors.lineActive : colors.lineInactive}`, transition: 'border-top-color 0.5s' }}></div>
              
              <div style={{ 
                position: 'absolute', 
                top: '40%', 
                backgroundColor: activeStep === 1 ? colors.labelBgActive : colors.labelBgInactive, 
                color: activeStep === 1 ? colors.labelTextActive : colors.labelTextInactive, 
                padding: '4px 12px', 
                borderRadius: '16px', 
                fontSize: '12px', 
                fontWeight: '600',
                border: `1px solid ${activeStep === 1 ? colors.labelBorderActive : colors.labelBorderInactive}`,
                zIndex: 1,
                transition: 'all 0.5s'
              }}>
                Product price &gt; $50
              </div>
           </div>

           <ExplanationBox isVisible={activeStep === 1}>
             <div><strong>Step 2:</strong> Transition to <strong>"User Adds to Cart"</strong> happens when <strong>"User Clicks Product"</strong> event occurs.</div>
             <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>Condition "Price &gt; $50" is checked. Only high-value items trigger next step.</div>
           </ExplanationBox>
        </div>

        {/* --- NODE 3 --- */}
        <div style={{ 
          ...nodeBaseStyle,
          border: `2px solid ${colors.actionBorder}`, 
          backgroundColor: colors.actionBg, 
          color: colors.actionText,
          fontWeight: '700',
          opacity: activeStep === 2 || activeStep === 1 ? 1 : 0.6
        }}>
          User Adds to Cart
        </div>

        {/* Transition 3 */}
        <div style={{ display: 'flex', alignItems: 'center', height: '140px', width: '100%' }}>
           <div style={{ width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', position: 'relative' }}>
              <div style={{ width: '2px', height: '100%', backgroundColor: activeStep === 2 ? colors.lineActive : colors.lineInactive, transition: 'background-color 0.5s' }}></div>
              <div style={{ position: 'absolute', bottom: '0', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `8px solid ${activeStep === 2 ? colors.lineActive : colors.lineInactive}`, transition: 'border-top-color 0.5s' }}></div>
              
              <div style={{ 
                position: 'absolute', 
                top: '40%', 
                backgroundColor: activeStep === 2 ? colors.labelBgActive : colors.labelBgInactive, 
                color: activeStep === 2 ? colors.labelTextActive : colors.labelTextInactive, 
                padding: '4px 12px', 
                borderRadius: '16px', 
                fontSize: '12px', 
                fontWeight: '600',
                border: `1px solid ${activeStep === 2 ? colors.labelBorderActive : colors.labelBorderInactive}`,
                zIndex: 1,
                transition: 'all 0.5s'
              }}>
                Cart value &gt; $100
              </div>
           </div>

           <ExplanationBox isVisible={activeStep === 2}>
             <div><strong>Step 3:</strong> Transition to <strong>"User Returns to Home"</strong> happens when <strong>"User Adds to Cart"</strong> event occurs.</div>
             <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>Condition "Cart value &gt; $100" checked. User must have enough value in cart.</div>
           </ExplanationBox>
        </div>

        {/* --- NODE 4 --- */}
        <div style={{ 
          ...nodeBaseStyle,
          border: `2px solid ${colors.actionBorder}`, 
          backgroundColor: colors.actionBg, 
          color: colors.actionText,
          fontWeight: '700',
          opacity: activeStep === 3 || activeStep === 2 ? 1 : 0.6
        }}>
          User Returns to Home
        </div>

        {/* Transition 4 */}
        <div style={{ display: 'flex', alignItems: 'center', height: '80px', width: '100%' }}>
           <div style={{ width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', position: 'relative' }}>
              <div style={{ width: '2px', height: '100%', backgroundColor: activeStep === 3 ? colors.lineActive : colors.lineInactive, transition: 'background-color 0.5s' }}></div>
              <div style={{ position: 'absolute', bottom: '0', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `8px solid ${activeStep === 3 ? colors.lineActive : colors.lineInactive}`, transition: 'border-top-color 0.5s' }}></div>
           </div>
           
           <ExplanationBox isVisible={activeStep === 3}>
             <div>When <strong>"User Returns to Home"</strong> event occurs, the <strong>"bottom sheet engagement"</strong> is shown</div>
           </ExplanationBox>
        </div>

        {/* --- ENGAGEMENT --- */}
        <div style={{ 
          ...nodeBaseStyle,
          border: `2px solid ${colors.engagementBorder}`, 
          backgroundColor: colors.engagementBg, 
          color: colors.engagementText,
          opacity: activeStep === 3 ? 1 : 0.6,
          transform: activeStep === 3 ? 'scale(1.05)' : 'scale(1)',
          boxShadow: activeStep === 3 ? `0 10px 15px -3px ${colors.shadow}` : `0 1px 3px ${colors.shadow}`
        }}>
          <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px', fontWeight: '600', color: colors.engagementSub }}>Engagement</div>
          <div style={{ fontWeight: '700', fontSize: '15px' }}>Bottom Sheet</div>
          <div style={{ fontSize: '12px', marginTop: '4px', fontStyle: 'italic', color: colors.engagementItalic }}>"Checkout Suggestion"</div>
        </div>

      </div>
    </div>
  );
};

export default JourneyAnimation;
