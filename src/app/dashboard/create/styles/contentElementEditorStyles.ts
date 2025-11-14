import { SxProps, Theme } from "@mui/material";

export const contentElementEditorStyles = {
  container: {
    border: 1,
    borderColor: "divider",
    borderRadius: "8px",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    p: 2,
    bgcolor: "background.default",
    borderBottom: 1,
    borderColor: "divider",
  },
  elementLabel: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "text.primary",
  },
  content: {
    p: 2,
  },
  section: {
    mb: 3,
    "&:last-child": {
      mb: 0,
    },
  },
  sectionLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "text.secondary",
    mb: 1,
    display: "flex",
    alignItems: "center",
    "&::before, &::after": {
      content: '""',
      flex: 1,
      height: "1px",
      bgcolor: "divider",
      mr: 1,
      ml: 1,
    },
  },
  spacingGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 2,
    mt: 1,
  },
  spacingSubLabel: {
    fontSize: "0.75rem",
    fontWeight: 500,
    color: "text.secondary",
    mb: 1,
  },
  spacingInputs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 1,
  },
  spacingInput: {
    "& .MuiInputBase-input": {
      py: 1,
    },
  },
  emptyText: {
    fontSize: "0.875rem",
    color: "text.secondary",
    fontStyle: "italic",
  },
  childElement: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    p: 1,
    border: 1,
    borderColor: "divider",
    borderRadius: "4px",
    mb: 1,
  },
};
