export const contentTabStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    mb: 2,
  },
  title: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "text.primary",
    mb: 0.5,
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "text.secondary",
  },
  addButton: {
    textTransform: "none",
  },
  emptyState: {
    border: "2px dashed",
    borderColor: "divider",
    borderRadius: "8px",
    p: 4,
    textAlign: "center",
    mt: 2,
  },
  emptyStateText: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "text.primary",
    mb: 1,
  },
  emptyStateSubtext: {
    fontSize: "0.75rem",
    color: "text.secondary",
  },
  elementsList: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
};
