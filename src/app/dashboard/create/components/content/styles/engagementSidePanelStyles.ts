export const engagementSidePanelStyles = {
  drawerPaper: {
    width: "90%",
    maxWidth: "1200px",
    height: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    p: 3,
    borderBottom: 1,
    borderColor: "divider",
  },
  title: {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: "text.primary",
  },
  content: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },
  previewSection: {
    flex: "0 0 400px",
    borderRight: 1,
    borderColor: "divider",
    p: 3,
    overflow: "auto",
  },
  configSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  tabs: {
    borderBottom: 1,
    borderColor: "divider",
    minHeight: "48px",
    "& .MuiTab-root": {
      minHeight: "48px",
      textTransform: "none",
    },
  },
  tabContent: {
    flex: 1,
    overflow: "auto",
    p: 3,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 2,
    p: 3,
    borderTop: 1,
    borderColor: "divider",
  },
};
