"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import InfoIcon from "@mui/icons-material/Info";
import PopupIcon from "@mui/icons-material/OpenInNew";
import TooltipIcon from "@mui/icons-material/InfoOutlined";
import BottomSheetIcon from "@mui/icons-material/ViewAgenda";

interface JourneyTutorialDialogProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Animation step data
const animationSteps = [
  {
    fromNode: 0,
    toNode: 1,
    arrowIndex: 0,
    ruleIndex: 0,
    tooltip: 'Transition to "User Clicks Product" happens when "User Opens App" event occurs (if rule passes)',
  },
  {
    fromNode: 1,
    toNode: 2,
    arrowIndex: 1,
    ruleIndex: 1,
    tooltip: 'Transition to "User Adds to Cart" happens when "User Clicks Product" event occurs (if rule passes)',
  },
  {
    fromNode: 2,
    toNode: 3,
    arrowIndex: 2,
    ruleIndex: 2,
    tooltip: 'Transition to "User Returns to Home" happens when "User Adds to Cart" event occurs (if rule passes)',
  },
  {
    fromNode: 3,
    toNode: 4,
    arrowIndex: 3,
    ruleIndex: -1,
    tooltip: 'When "User Returns to Home" event occurs, the bottom sheet engagement is shown',
  },
];

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tutorial-tabpanel-${index}`}
      aria-labelledby={`tutorial-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Animated Journey Example Component
function AnimatedJourneyExample() {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const arrowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wasPausedRef = useRef(false); // Track if we were previously paused

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Start animation loop only if not paused
    if (!isPaused) {
      // Advance to next step immediately only when resuming from pause (not on initial mount)
      if (wasPausedRef.current) {
        setCurrentStep((prev) => (prev + 1) % animationSteps.length);
      }
      
      // Then continue with interval
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % animationSteps.length);
      }, 5000); // Change step every 5 seconds
      
      wasPausedRef.current = false; // Reset the flag
    } else {
      wasPausedRef.current = true; // Mark that we're now paused
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused]);

  useEffect(() => {
    // Calculate tooltip position based on current step's arrow
    const updateTooltipPosition = () => {
      const step = animationSteps[currentStep];
      const arrowElement = arrowRefs.current[step.arrowIndex];
      const containerElement = containerRef.current;

      if (arrowElement && containerElement) {
        const arrowRect = arrowElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();

        // Calculate arrow center position relative to container
        const arrowCenterY = arrowRect.top - containerRect.top + arrowRect.height / 2;

        // Tooltip should be to the right of the journey flow container
        const journeyFlowWidth = 280 + 32; // minWidth + ml (left margin)
        const tooltipLeft = journeyFlowWidth + 32; // 32px gap (gap: 4 = 32px)
        const tooltipTop = arrowCenterY - 50; // Center align (tooltip height is ~100px)

        setTooltipPosition({
          top: tooltipTop,
          left: tooltipLeft,
        });
      }
    };

    // Update position when step changes
    updateTooltipPosition();

    // Also update on window resize
    window.addEventListener("resize", updateTooltipPosition);
    return () => window.removeEventListener("resize", updateTooltipPosition);
  }, [currentStep]);

  const step = animationSteps[currentStep];
  const isHighlighted = (nodeIndex: number, arrowIndex: number, ruleIndex: number) => {
    const isFromNode = step.fromNode === nodeIndex;
    const isToNode = step.toNode === nodeIndex;
    const isArrow = step.arrowIndex === arrowIndex;
    const isRule = step.ruleIndex === ruleIndex;
    
    // For node highlighting, check if it's the from or to node
    if (nodeIndex !== -1) {
      return isFromNode || isToNode;
    }
    // For arrow highlighting
    if (arrowIndex !== -1) {
      return isArrow;
    }
    // For rule highlighting
    if (ruleIndex !== -1) {
      return isRule;
    }
    return false;
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <Box
      ref={containerRef}
      sx={{ display: "flex", gap: 4, alignItems: "flex-start", position: "relative" }}
    >
      {/* Pause/Play Button - Top Right, aligned with label */}
      <IconButton
        onClick={handleTogglePause}
        sx={{
          position: "absolute",
          top: "-20px", // Align vertically center with label (subtitle2 line height ~28px, icon ~24px, so -20px centers it)
          right: 0,
          zIndex: 10,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
        size="small"
      >
        {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
      </IconButton>

      {/* Journey Flow - Left Side */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          py: 2,
          flex: "0 0 auto",
          position: "relative",
          minWidth: 280,
          ml: 4,
        }}
      >
        {/* Node 1 - Entry */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: isHighlighted(0, -1, -1)
              ? "rgba(16, 185, 129, 0.4)"
              : "rgba(16, 185, 129, 0.2)",
            borderRadius: 2,
            border: 2,
            borderColor: isHighlighted(0, -1, -1)
              ? "rgba(168, 85, 247, 1)"
              : "rgba(16, 185, 129, 0.5)",
            minWidth: 160,
            textAlign: "center",
            transition: "all 0.5s ease",
            boxShadow: isHighlighted(0, -1, -1) ? "0 0 8px rgba(168, 85, 247, 0.5)" : "none",
          }}
        >
          <Typography variant="caption" fontWeight={600} color="success.main">
            Entry Node
          </Typography>
          <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
            User Opens App
          </Typography>
        </Box>

        {/* Arrow 1 - Down with Rule */}
        <Box
          ref={(el: HTMLDivElement | null) => {
            arrowRefs.current[0] = el;
          }}
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 40,
          }}
        >
          <Chip
            label="User is logged in"
            size="small"
            sx={{
              position: "absolute",
              left: 0,
              bgcolor: isHighlighted(-1, -1, 0)
                ? "rgba(168, 85, 247, 0.2)"
                : "rgba(99, 102, 241, 0.15)",
              color: isHighlighted(-1, -1, 0) ? "rgba(168, 85, 247, 1)" : "primary.main",
              fontSize: "0.65rem",
              height: "20px",
              fontWeight: 500,
              transition: "all 0.5s ease",
              border: isHighlighted(-1, -1, 0) ? "1px solid rgba(168, 85, 247, 0.6)" : "none",
            }}
          />
          <ArrowDownwardIcon
            sx={{
              color: isHighlighted(-1, 0, -1) ? "rgba(168, 85, 247, 1)" : "text.secondary",
              fontSize: 28,
              transition: "all 0.5s ease",
              transform: isHighlighted(-1, 0, -1) ? "scale(1.15)" : "scale(1)",
            }}
          />
        </Box>

        {/* Node 2 */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: isHighlighted(1, -1, -1) ? "rgba(168, 85, 247, 0.15)" : "background.paper",
            borderRadius: 2,
            border: 2,
            borderColor: isHighlighted(1, -1, -1)
              ? "rgba(168, 85, 247, 1)"
              : "divider",
            minWidth: 160,
            textAlign: "center",
            transition: "all 0.5s ease",
            boxShadow: isHighlighted(1, -1, -1) ? "0 0 8px rgba(168, 85, 247, 0.5)" : "none",
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            User Clicks Product
          </Typography>
        </Box>

        {/* Arrow 2 - Down with Rule */}
        <Box
          ref={(el: HTMLDivElement | null) => {
            arrowRefs.current[1] = el;
          }}
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 40,
          }}
        >
          <Chip
            label="Product price &gt; $50"
            size="small"
            sx={{
              position: "absolute",
              left: 0,
              bgcolor: isHighlighted(-1, -1, 1)
                ? "rgba(168, 85, 247, 0.2)"
                : "rgba(99, 102, 241, 0.15)",
              color: isHighlighted(-1, -1, 1) ? "rgba(168, 85, 247, 1)" : "primary.main",
              fontSize: "0.65rem",
              height: "20px",
              fontWeight: 500,
              transition: "all 0.5s ease",
              border: isHighlighted(-1, -1, 1) ? "1px solid rgba(168, 85, 247, 0.6)" : "none",
            }}
          />
          <ArrowDownwardIcon
            sx={{
              color: isHighlighted(-1, 1, -1) ? "rgba(168, 85, 247, 1)" : "text.secondary",
              fontSize: 28,
              transition: "all 0.5s ease",
              transform: isHighlighted(-1, 1, -1) ? "scale(1.15)" : "scale(1)",
            }}
          />
        </Box>

        {/* Node 3 */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: isHighlighted(2, -1, -1) ? "rgba(168, 85, 247, 0.15)" : "background.paper",
            borderRadius: 2,
            border: 2,
            borderColor: isHighlighted(2, -1, -1)
              ? "rgba(168, 85, 247, 1)"
              : "divider",
            minWidth: 160,
            textAlign: "center",
            transition: "all 0.5s ease",
            boxShadow: isHighlighted(2, -1, -1) ? "0 0 8px rgba(168, 85, 247, 0.5)" : "none",
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            User Adds to Cart
          </Typography>
        </Box>

        {/* Arrow 3 - Down with Rule */}
        <Box
          ref={(el: HTMLDivElement | null) => {
            arrowRefs.current[2] = el;
          }}
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 40,
          }}
        >
          <Chip
            label="Cart value &gt; $100"
            size="small"
            sx={{
              position: "absolute",
              left: 0,
              bgcolor: isHighlighted(-1, -1, 2)
                ? "rgba(168, 85, 247, 0.2)"
                : "rgba(99, 102, 241, 0.15)",
              color: isHighlighted(-1, -1, 2) ? "rgba(168, 85, 247, 1)" : "primary.main",
              fontSize: "0.65rem",
              height: "20px",
              fontWeight: 500,
              transition: "all 0.5s ease",
              border: isHighlighted(-1, -1, 2) ? "1px solid rgba(168, 85, 247, 0.6)" : "none",
            }}
          />
          <ArrowDownwardIcon
            sx={{
              color: isHighlighted(-1, 2, -1) ? "rgba(168, 85, 247, 1)" : "text.secondary",
              fontSize: 28,
              transition: "all 0.5s ease",
              transform: isHighlighted(-1, 2, -1) ? "scale(1.15)" : "scale(1)",
            }}
          />
        </Box>

        {/* Node 4 */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: isHighlighted(3, -1, -1) ? "rgba(168, 85, 247, 0.15)" : "background.paper",
            borderRadius: 2,
            border: 2,
            borderColor: isHighlighted(3, -1, -1)
              ? "rgba(168, 85, 247, 1)"
              : "divider",
            minWidth: 160,
            textAlign: "center",
            transition: "all 0.5s ease",
            boxShadow: isHighlighted(3, -1, -1) ? "0 0 8px rgba(168, 85, 247, 0.5)" : "none",
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            User Returns to Home
          </Typography>
        </Box>

        {/* Arrow 4 - Down */}
        <Box
          ref={(el: HTMLDivElement | null) => {
            arrowRefs.current[3] = el;
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            width: "100%",
            minHeight: 40,
          }}
        >
          <ArrowDownwardIcon
            sx={{
              color: isHighlighted(-1, 3, -1) ? "rgba(168, 85, 247, 1)" : "text.secondary",
              fontSize: 28,
              transition: "all 0.5s ease",
              transform: isHighlighted(-1, 3, -1) ? "scale(1.15)" : "scale(1)",
            }}
          />
        </Box>

        {/* Engagement */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: isHighlighted(4, -1, -1)
              ? "rgba(245, 158, 11, 0.4)"
              : "rgba(245, 158, 11, 0.2)",
            borderRadius: 2,
            border: 2,
            borderColor: isHighlighted(4, -1, -1)
              ? "rgba(168, 85, 247, 1)"
              : "rgba(245, 158, 11, 0.5)",
            minWidth: 160,
            textAlign: "center",
            transition: "all 0.5s ease",
            boxShadow: isHighlighted(4, -1, -1) ? "0 0 8px rgba(168, 85, 247, 0.5)" : "none",
          }}
        >
          <Typography variant="caption" fontWeight={600} color="warning.main">
            Engagement
          </Typography>
          <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
            Bottom Sheet
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            "Checkout Suggestion"
          </Typography>
        </Box>
      </Box>

      {/* Tooltip/Explanation - Right Side */}
      <Box
        sx={{
          position: "absolute",
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          minWidth: 280,
          p: 2,
          bgcolor: "rgba(59, 130, 246, 0.08)",
          borderRadius: 2,
          border: 1,
          borderColor: "rgba(59, 130, 246, 0.2)",
          transition: "top 0.5s ease, left 0.5s ease",
          zIndex: 2,
        }}
      >
        <Typography variant="body1" color="#000" sx={{ lineHeight: 1.6, fontSize: "1rem" }}>
          {step.tooltip}
        </Typography>
      </Box>
    </Box>
  );
}

export default function JourneyTutorialDialog({
  open,
  onClose,
}: JourneyTutorialDialogProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <SchoolIcon sx={{ color: "primary.main", fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600}>
            Learn How Journeys Work
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: "70vh", display: "flex", flexDirection: "column" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", flexShrink: 0 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="tutorial tabs"
            sx={{
              px: 3,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                minHeight: 48,
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Creating a Journey" />
            <Tab label="Understanding Nodes" />
            <Tab label="Transitions & Rules" />
            <Tab label="Engagements" />
          </Tabs>
        </Box>

        <Box sx={{ px: 3, py: 3, flex: 1, overflowY: "auto" }}>
          {/* Tab 1: Overview */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                What is a Journey?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                A journey is a step-by-step experience you create for your users.
                Think of it like a guided path that users follow based on their
                actions and characteristics.
              </Typography>

              {/* Visual Flow Example */}
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  sx={{ mb: 2 }}
                >
                  Example: E-Commerce Shopping Journey
                </Typography>
                <AnimatedJourneyExample />
              </Paper>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(59, 130, 246, 0.15)",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "rgba(59, 130, 246, 0.4)",
                }}
              >
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <InfoIcon sx={{ color: "rgba(59, 130, 246, 0.85)", fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Key Concepts
                  </Typography>
                </Box>
                <Box component="ul" sx={{ m: 0, pl: 3 }}>
                  <li>
                    <Typography variant="body1">
                      <strong>Node & Event:</strong> A node represents a step in your journey. Each node is identified by an event name (e.g., "User Opens App", "User Clicks Product"). 
                      Conceptually, a node and its event are the same thing - the node is named after the event that triggers it.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Transition:</strong> Moving from one node to another. <strong>Important:</strong> A transition from Node A (with event "ABC") to Node B happens when event "ABC" occurs in your app, NOT when Node B's event occurs. 
                      Once at Node B, the next transition will happen when Node B's event is triggered.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Rule/Condition:</strong> Optional checks you add to transitions (shown on arrows between nodes). 
                      All rules must pass for the transition to happen (e.g., "User is logged in", "Product price &gt; $50")
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Engagement:</strong> A message you show users at a node (popup, tooltip, or bottom sheet). 
                      Engagements are displayed when the user reaches that node.
                    </Typography>
                  </li>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          {/* Tab 2: Creating a Journey */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Step-by-Step: Creating Your First Journey
              </Typography>

              <Stepper orientation="vertical" sx={{ mt: 2 }}>
                <Step active={true} completed={false}>
                  <StepLabel>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Step 1: Name Your Journey
                    </Typography>
                  </StepLabel>
                  <Box sx={{ pl: 4, pb: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      Give your journey a clear name like "Welcome New Users" or
                      "Re-engage Inactive Users". This helps you find it later.
                    </Typography>
                  </Box>
                </Step>

                <Step active={true} completed={false}>
                  <StepLabel>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Step 2: Go to "UI & Content" Tab
                    </Typography>
                  </StepLabel>
                  <Box sx={{ pl: 4, pb: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      Click on the "UI & Content" tab to start building your
                      journey flow. You'll see a canvas where you can add steps.
                    </Typography>
                  </Box>
                </Step>

                <Step active={true} completed={false}>
                  <StepLabel>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Step 3: Configure the Entry Node
                    </Typography>
                  </StepLabel>
                  <Box sx={{ pl: 4, pb: 2 }}>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      The entry node (green box) is where your journey starts.
                      Click on it to open the configuration panel on the right.
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <strong>Select an Event:</strong> Choose what user action
                      starts this journey (e.g., "User opens app", "User signs
                      up").
                    </Typography>
                  </Box>
                </Step>

                <Step active={true} completed={false}>
                  <StepLabel>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Step 4: Add Engagements (Optional)
                    </Typography>
                  </StepLabel>
                  <Box sx={{ pl: 4, pb: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      After selecting an event, you can add engagements like
                      popups or tooltips that users will see at this step.
                    </Typography>
                  </Box>
                </Step>

                <Step active={true} completed={false}>
                  <StepLabel>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Step 5: Set Up Transitions
                    </Typography>
                  </StepLabel>
                  <Box sx={{ pl: 4, pb: 2 }}>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      Define what happens next in your journey. You can:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                      <li>
                        <Typography variant="body1" color="text.secondary">
                          Select where users go next (choose another step or "Exit" to end the journey)
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body1" color="text.secondary">
                          Add rules (conditions) to control which users move forward based on their properties
                        </Typography>
                      </li>
                    </Box>
                  </Box>
                </Step>

                <Step active={true} completed={false}>
                  <StepLabel>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Step 6: Save and Publish
                    </Typography>
                  </StepLabel>
                  <Box sx={{ pl: 4, pb: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      Once you're happy with your journey, click "Save" on each
                      node, then go to "Journey Setup" tab to configure who
                      sees it and when it runs.
                    </Typography>
                  </Box>
                </Step>
              </Stepper>
            </Box>
          </TabPanel>

          {/* Tab 3: Understanding Nodes */}
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Understanding Nodes (Steps)
              </Typography>

              <Paper elevation={1} sx={{ p: 2, bgcolor: "rgba(16, 185, 129, 0.15)" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon sx={{ color: "rgba(16, 185, 129, 0.85)" }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Entry Node (Green)
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  This is where your journey begins. Every journey must have one
                  entry node. It's marked with a green border and "Entry" label.
                </Typography>
              </Paper>

              <Paper elevation={1} sx={{ p: 2, bgcolor: "background.paper" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <InfoIcon sx={{ color: "rgba(99, 102, 241, 0.85)" }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Regular Nodes (White/Blue)
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  These are additional steps in your journey. Users reach these
                  nodes based on the transitions you set up from previous nodes.
                </Typography>
              </Paper>

              <Paper elevation={1} sx={{ p: 2, bgcolor: "rgba(245, 158, 11, 0.15)" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PopupIcon sx={{ color: "rgba(245, 158, 11, 0.85)" }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Engagement Nodes (Orange)
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  These show when you've added an engagement (popup, tooltip, or
                  bottom sheet) to a step. They appear connected to the node
                  where the engagement will be shown.
                </Typography>
              </Paper>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  How to Configure a Node:
                </Typography>
                <Box component="ol" sx={{ m: 0, pl: 2 }}>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Click on any node in the canvas
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      The configuration panel opens on the right
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Select an event (what user action triggers this step)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Add engagements and transitions as needed
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Click "Save" to keep your changes
                    </Typography>
                  </li>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          {/* Tab 4: Transitions & Rules */}
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Understanding Transitions and Rules
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph>
                <strong>Key Understanding:</strong> A transition from Node A (with event "ABC") to Node B happens when event "ABC" is triggered in your app, 
                NOT when Node B's event is triggered. Once users reach Node B, the next transition will occur when Node B's event happens.
              </Typography>

              {/* Visual Example */}
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  sx={{ mb: 2 }}
                >
                  Example: E-Commerce Shopping Journey
                </Typography>
                <AnimatedJourneyExample />
              </Paper>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(59, 130, 246, 0.15)",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "rgba(59, 130, 246, 0.4)",
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Understanding Transitions:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  <li>
                    <Typography variant="body1">
                      <strong>When transitions happen:</strong> A transition from Node A (event "ABC") to Node B happens when event "ABC" is triggered in your app, NOT when Node B's event is triggered. 
                      Once users reach Node B, the next transition occurs when Node B's event happens.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>All rules must pass:</strong> If you add multiple rules to a transition, ALL of them must be true for the transition to happen
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Example rules:</strong> "User is logged in", "Product price &gt; $50", "Cart value &gt; $100"
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>No rules:</strong> If you don't add any rules, everyone moves to the next node when the current node's event occurs
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Setting Up a Transition:
                </Typography>
                <Box component="ol" sx={{ m: 0, pl: 2 }}>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      In the node configuration panel, scroll to "Transitions"
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Click "Add Transition"
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Choose "Target Node" - where users go next (or "Exit" to
                      end the journey)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      (Optional) Add rules by clicking "Add Condition" - set
                      property, operator, and value
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Click "Save" on the node
                    </Typography>
                  </li>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          {/* Tab 5: Engagements */}
          <TabPanel value={activeTab} index={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Understanding Engagements
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph>
                Engagements are messages you show to users at specific steps in
                your journey. They help guide, inform, or prompt users to take
                action.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: "background.paper" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PopupIcon sx={{ color: "rgba(99, 102, 241, 0.85)" }} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Popup
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    A full-screen or centered popup that appears over your app.
                    Great for important announcements, offers, or confirmations.
                  </Typography>
                </Paper>

                <Paper elevation={1} sx={{ p: 2, bgcolor: "background.paper" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TooltipIcon sx={{ color: "rgba(245, 158, 11, 0.85)" }} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Tooltip
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    A small hint or tip that appears near a specific element.
                    Perfect for guiding users on how to use a feature.
                  </Typography>
                </Paper>

                <Paper elevation={1} sx={{ p: 2, bgcolor: "background.paper" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BottomSheetIcon sx={{ color: "rgba(59, 130, 246, 0.85)" }} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Bottom Sheet
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    A panel that slides up from the bottom of the screen. Ideal
                    for detailed information, forms, or multiple options.
                  </Typography>
                </Paper>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Adding an Engagement:
                </Typography>
                <Box component="ol" sx={{ m: 0, pl: 2 }}>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Configure your node and select an event first
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Scroll to "In-App Engagements" section
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Click "Add Engagement"
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Choose the type (Popup, Tooltip, or Bottom Sheet)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Design your message content (you'll configure this in the
                      engagement panel)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" color="text.secondary">
                      Click "Save" on the node
                    </Typography>
                  </li>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(59, 130, 246, 0.15)",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "rgba(59, 130, 246, 0.4)",
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  💡 Pro Tip:
                </Typography>
                <Typography variant="body1">
                  You can add multiple engagements to the same step. For example,
                  show a tooltip first, then a popup with more details. Users
                  will see them in the order you add them.
                </Typography>
              </Box>
            </Box>
          </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          startIcon={<PlayArrowIcon />}
        >
          Got it, let's build!
        </Button>
      </DialogActions>
    </Dialog>
  );
}

