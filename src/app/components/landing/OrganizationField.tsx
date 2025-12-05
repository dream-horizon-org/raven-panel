"use client";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import { useTheme } from "@mui/material/styles";
import { landingPageStyles } from "../styles/landingPageStyles";
import { ORGANIZATIONS, LANDING_PAGE_TEXT } from "../constants";

interface OrganizationFieldProps {
  organization: string;
  touched: boolean;
  onOrganizationChange: (value: string) => void;
  onBlur: () => void;
}

export default function OrganizationField({
  organization,
  touched,
  onOrganizationChange,
  onBlur,
}: OrganizationFieldProps) {
  const theme = useTheme();

  return (
    <FormControl
      fullWidth
      required
      error={touched && !organization.trim()}
      sx={landingPageStyles.organizationField(theme)}
    >
      <InputLabel id="organization-label">Organization</InputLabel>
      <Select
        labelId="organization-label"
        id="organization-select"
        value={organization}
        label="Organization"
        onChange={(e) => onOrganizationChange(e.target.value)}
        onBlur={onBlur}
        startAdornment={
          <InputAdornment position="start">
            <BusinessIcon sx={landingPageStyles.inputIcon(theme)} />
          </InputAdornment>
        }
      >
        {ORGANIZATIONS.map((org) => (
          <MenuItem key={org} value={org}>
            {org}
          </MenuItem>
        ))}
      </Select>
      {touched && !organization.trim() && (
        <FormHelperText>
          {LANDING_PAGE_TEXT.organizationRequired}
        </FormHelperText>
      )}
    </FormControl>
  );
}
