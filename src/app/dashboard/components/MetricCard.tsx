import { Box, Typography } from "@mui/material";
import {
  metricCardStyles,
  metricCardContentStyles,
  metricCardIconContainerStyles,
  metricCardLabelStyles,
  metricCardValueStyles,
} from "./styles/metricCardStyles";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconColor: "purple" | "green";
}

export default function MetricCard({
  icon,
  label,
  value,
  iconColor,
}: MetricCardProps) {
  return (
    <Box sx={metricCardStyles}>
      <Box sx={metricCardContentStyles}>
        <Box sx={metricCardIconContainerStyles(iconColor)}>{icon}</Box>
        <Box>
          <Typography sx={metricCardLabelStyles}>{label}</Typography>
          <Typography sx={metricCardValueStyles}>{value}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
