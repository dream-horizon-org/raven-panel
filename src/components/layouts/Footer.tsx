import { Box, Typography } from "@mui/material";
import { footerStyles, footerTextStyles } from "./styles/footerStyles";

export default function Footer() {
  return (
    <Box component="footer" sx={footerStyles}>
      <Typography sx={footerTextStyles}></Typography>
    </Box>
  );
}
