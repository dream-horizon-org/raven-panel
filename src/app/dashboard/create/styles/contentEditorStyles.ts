import { SxProps, Theme } from "@mui/material";

export const contentEditorStyles = {
  container: {
    display: "flex",
    gap: 3,
    height: "100%",
  },
  previewSection: {
    flex: "0 0 400px",
    minHeight: "600px",
  },
  configSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    bgcolor: "background.paper",
    borderRadius: "8px",
    border: 1,
    borderColor: "divider",
    overflow: "hidden",
  },
  tabsContainer: {
    borderBottom: 1,
    borderColor: "divider",
  },
  tabs: {
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
};
