import { SxProps, Theme } from "@mui/material";

export const filterRowStyles = {
  filterCard: (theme: Theme): SxProps<Theme> => ({
    bgcolor: "transparent",
    borderRadius: "8px",
    border: 1,
    borderColor: theme.palette.divider,
    borderStyle: "dashed",
    p: 2.5,
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "primary.main",
      borderStyle: "solid",
      bgcolor:
        theme.palette.mode === "light"
          ? "rgba(165, 26, 253, 0.02)"
          : "rgba(165, 26, 253, 0.05)",
    },
  }),
  filterFields: {
    display: "flex",
    gap: 2,
    alignItems: "flex-start",
  },
  filterField: {
    minWidth: "250px",
    width: "fit-content",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      bgcolor: "background.paper",
      height: "36px",
      display: "flex",
      alignItems: "center",
    },
    "& .MuiInputBase-input": {
      padding: "8px 14px",
      fontSize: "0.875rem",
      minWidth: "150px",
      "&::placeholder": {
        opacity: 1,
        color: "text.secondary",
      },
    },
    "& .MuiSelect-select": {
      padding: "8px 14px",
      fontSize: "0.875rem",
      minWidth: "150px",
    },
  },
  deleteButton: {
    color: "text.secondary",
    mt: 0.5,
    "&:hover": {
      color: "error.main",
      bgcolor: "error.light",
    },
  },
};
