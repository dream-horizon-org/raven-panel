export const journeyHeaderStyles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.5,
    px: 3,
    py: 2,
    borderBottom: 1,
    borderColor: "divider",
    bgcolor: "background.paper",
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  },
  headerIcon: {
    fontSize: "1.5rem",
    lineHeight: 1,
    display: "inline-block",
    mr: 1.5,
  },
  headerNameField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: 500,
      color: "text.primary",
      bgcolor: "background.paper",
      "& fieldset": {
        borderColor: "divider",
      },
      "&:hover fieldset": {
        borderColor: "divider",
      },
      "&.Mui-focused fieldset": {
        borderColor: "primary.main",
      },
      "&::placeholder": {
        fontSize: "1rem",
        fontWeight: 500,
        color: "text.secondary",
        opacity: 1,
      },
    },
    "& .MuiInputBase-input": {
      padding: "10px 14px",
      "&::placeholder": {
        opacity: 1,
      },
    },
  },
  infoIcon: {
    fontSize: "1rem",
    color: "primary.main",
  },
  backButton: {
    color: "text.secondary",
    "&:hover": {
      bgcolor: "action.hover",
    },
  },
  actionButton: {
    bgcolor: "rgba(99, 102, 241, 0.25)",
    borderColor: "rgba(99, 102, 241, 0.4)",
    color: "primary.main",
    textTransform: "none",
    fontWeight: 500,
    "&:hover": {
      bgcolor: "rgba(99, 102, 241, 0.3)",
      borderColor: "primary.main",
    },
  },
};
