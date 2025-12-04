export const templateTabStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  title: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "text.primary",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "text.secondary",
  },
  templatesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 2,
    mt: 2,
  },
  templateCard: {
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      boxShadow: 4,
    },
  },
  templateCardSelected: {
    border: 2,
    borderColor: "primary.main",
    bgcolor: "action.selected",
  },
  templateTitle: {
    fontSize: "0.875rem",
    fontWeight: 600,
    mb: 0.5,
  },
  templateDescription: {
    fontSize: "0.75rem",
    color: "text.secondary",
  },
};
