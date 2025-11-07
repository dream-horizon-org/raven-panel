import { SxProps, Theme } from "@mui/material";

export const searchContainerStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export const searchInputStyles: SxProps<Theme> = (theme) => ({
  width: 428,
  "& .MuiOutlinedInput-root": {
    height: 40,
    bgcolor: "background.paper",
    color: "text.primary",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: theme.palette.divider,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.text.secondary,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 1,
  },
});

export const filtersContainerStyles: SxProps<Theme> = {
  display: "flex",
  gap: 2,
};

export const filterButtonStyles: SxProps<Theme> = (theme) => ({
  bgcolor: "background.paper",
  border: 1,
  borderColor: theme.palette.divider,
  borderRadius: "0.5rem",
  px: 2,
  height: 40,
  color: "text.primary",
  fontSize: "0.875rem",
  textTransform: "none",
  "&:hover": {
    bgcolor: theme.palette.action.hover,
    borderColor: theme.palette.divider,
  },
  "&.active": {
    bgcolor: theme.palette.action.selected,
    borderColor: theme.palette.divider,
  },
});
