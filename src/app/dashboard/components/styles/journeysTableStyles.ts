import { SxProps, Theme } from "@mui/material";
import { STATUS_COLORS, THEME_COLORS } from "@/config/colors";

export const tableContainerStyles: SxProps<Theme> = (theme) => ({
  bgcolor:
    theme.palette.mode === "dark"
      ? THEME_COLORS.COMPONENTS.tableContainerDark
      : "background.paper",
  borderRadius: "16px",
  border: 1,
  borderColor: theme.palette.divider,
  overflow: "auto",
  maxHeight: "660px",
});

export const tableStyles: SxProps<Theme> = (theme) => ({
  "& .MuiTableCell-root": {
    borderColor: theme.palette.divider,
  },
});

export const tableHeadStyles: SxProps<Theme> = (theme) => ({
  bgcolor: "background.paper",
  "& .MuiTableCell-head": {
    borderBottom: 0,
  },
});

export const tableHeaderCellStyles: SxProps<Theme> = (theme) => ({
  borderBottom: 0,
  padding: "12px 16px",
  bgcolor: "background.paper",
  verticalAlign: "middle",
  textAlign: "left",
});

export const tableHeaderCellStylesRight: SxProps<Theme> = (theme) => ({
  borderBottom: 0,
  padding: "12px 16px",
  bgcolor: "background.paper",
  verticalAlign: "middle",
  textAlign: "right",
});

export const tableHeaderContentStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  lineHeight: 1,
  margin: 0,
  padding: 0,
};

export const tableHeaderCheckboxStyles: SxProps<Theme> = {
  padding: "4px",
  margin: 0,
  width: "20px",
  height: "20px",
  "& .MuiSvgIcon-root": {
    fontSize: "1.25rem",
  },
};

export const tableHeaderTextStyles: SxProps<Theme> = {
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  color: "text.primary",
  letterSpacing: "0.02em",
  margin: 0,
  padding: 0,
  lineHeight: 1,
};

export const tableHeaderTextStylesRight: SxProps<Theme> = {
  ...tableHeaderTextStyles,
  textAlign: "right",
};

export const tableRowContentStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  lineHeight: 1,
  margin: 0,
  padding: 0,
};

export const tableRowCheckboxStyles: SxProps<Theme> = {
  padding: "4px",
  margin: 0,
  width: "20px",
  height: "20px",
  "& .MuiSvgIcon-root": {
    fontSize: "1.25rem",
  },
};

export const journeyIconStyles: SxProps<Theme> = {
  fontSize: "1.25rem",
  lineHeight: 1,
  display: "inline-block",
};

export const actionMenuStyles: SxProps<Theme> = {
  "& .MuiPaper-root": {
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    mt: 0.5,
    minWidth: "180px",
  },
};

export const actionMenuItemStyles: SxProps<Theme> = {
  py: 1,
  px: 2,
  "&:hover": {
    bgcolor: "action.hover",
  },
};

export const actionMenuIconStyles: SxProps<Theme> = {
  minWidth: "36px",
  color: "text.secondary",
  "& .MuiSvgIcon-root": {
    fontSize: "1.125rem",
  },
};

export const tableRowStyles: SxProps<Theme> = (theme) => ({
  borderBottom: 1,
  borderColor: theme.palette.divider,
  "&:hover": {
    bgcolor: theme.palette.action.hover,
  },
});

export const tableCellStyles: SxProps<Theme> = {
  color: "text.primary",
  fontSize: "0.8125rem",
  fontWeight: 400,
  padding: "12px 16px",
  verticalAlign: "middle",
};

export const tableCellStylesRight: SxProps<Theme> = {
  ...tableCellStyles,
  textAlign: "right",
};

export const tableCellSecondaryStyles: SxProps<Theme> = {
  ...tableCellStyles,
  color: "text.secondary",
};

export const statusChipStyles = (theme: Theme) => (
  status: string
): SxProps<Theme> => {
  const mode = theme.palette.mode;
  const statusKey = status.toUpperCase() as keyof typeof STATUS_COLORS;
  const statusConfig = STATUS_COLORS[statusKey] || STATUS_COLORS.DRAFT;
  const colors = statusConfig[mode];

  return {
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 500,
    px: 1.5,
    py: 0.5,
    bgcolor: colors.bg,
    color: colors.text,
  };
};

export const avatarStyles: SxProps<Theme> = {
  width: 32,
  height: 32,
  bgcolor: "primary.main",
  fontSize: "0.75rem",
  fontWeight: 500,
};

export const actionButtonStyles: SxProps<Theme> = {
  color: "primary.main",
  minWidth: "12px",
  padding: 0.5,
  "& .MuiSvgIcon-root": {
    fontSize: "16px",
  },
  "&:hover": {
    color: "primary.dark",
    bgcolor: "transparent",
  },
};

export const deleteButtonStyles: SxProps<Theme> = {
  ...actionButtonStyles,
  "&:hover": {
    color: "error.main",
  },
};

export const sortButtonStyles: SxProps<Theme> = {
  color: "text.primary",
  fontSize: "0.875rem",
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    color: "text.secondary",
    bgcolor: "transparent",
  },
};

export const commsIconContainerStyles: SxProps<Theme> = {
  display: "flex",
  gap: 1,
};

export const commsIconStyles: SxProps<Theme> = {
  width: 20,
  height: 20,
  color: "text.secondary",
};

export const multiCommsContainerStyles: SxProps<Theme> = {
  display: "flex",
  gap: 0.5,
};

export const multiCommsIconStyles: SxProps<Theme> = {
  width: 16,
  height: 16,
  bgcolor: "action.disabled",
  borderRadius: 0.5,
};

export const tableActionsContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 1.5,
};

export const loadingContainerStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  my: 5,
};

export const errorContainerStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  my: 5,
};

export const tableLoadingOverlayStyles: SxProps<Theme> = (theme) => ({
  position: "absolute",
  inset: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  bgcolor:
    theme.palette.mode === "light"
      ? "rgba(255, 255, 255, 0.9)"
      : "rgba(26, 26, 26, 0.9)",
  zIndex: 9999,
  borderRadius: "16px",
  pointerEvents: "none",
  "& .MuiCircularProgress-root": {
    pointerEvents: "auto",
  },
});

export const emptyStateContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  py: 8,
  px: 3,
  textAlign: "center",
};

export const emptyStateIllustrationStyles: SxProps<Theme> = {
  mb: 4,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const emptyStateTitleStyles: SxProps<Theme> = {
  fontSize: "1.5rem",
  fontWeight: 600,
  color: "text.primary",
  mb: 2,
};

export const emptyStateSubtextStyles: SxProps<Theme> = {
  fontSize: "0.875rem",
  color: "text.secondary",
  maxWidth: "500px",
};

export const paginationContainerStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: 2,
  mt: 2,
};

export const previousPageButtonStyles = (
  isFirstPage: boolean
): SxProps<Theme> => ({
  color: isFirstPage ? "action.disabled" : "text.secondary",
  "&:hover": {
    backgroundColor: "transparent",
    color: isFirstPage ? "action.disabled" : "primary.main",
  },
});

export const nextPageButtonStyles = (isLastPage: boolean): SxProps<Theme> => ({
  color: isLastPage ? "action.disabled" : "text.secondary",
  "&:hover": {
    backgroundColor: "transparent",
    color: isLastPage ? "action.disabled" : "primary.main",
  },
});

export const pageNumbersContainerStyles: SxProps<Theme> = {
  display: "flex",
  gap: 1,
  alignItems: "center",
};

export const pageNumberButtonStyles = (isActive: boolean): SxProps<Theme> => ({
  minWidth: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
  border: isActive ? 1 : 0,
  borderColor: isActive ? "primary.main" : "transparent",
  color: isActive ? "primary.main" : "text.primary",
  cursor: isActive ? "default" : "pointer",
  fontWeight: isActive ? 500 : 400,
  fontSize: "0.875rem",
  "&:hover": {
    backgroundColor: isActive ? "transparent" : "action.hover",
  },
});

export const pageSizeFormControlStyles: SxProps<Theme> = {
  minWidth: 100,
};

export const pageSizeSelectStyles: SxProps<Theme> = {
  borderRadius: "8px",
  fontSize: "0.875rem",
  "& .MuiSelect-select": {
    py: 1,
    px: 1.5,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "divider",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "divider",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "primary.main",
  },
};
