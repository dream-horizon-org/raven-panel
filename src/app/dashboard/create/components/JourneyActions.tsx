"use client";

import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { journeyActionsStyles } from "../styles/journeyActionsStyles";
import { JOURNEY_TEXT } from "../constants/journeyConstants";

interface JourneyActionsProps {
  activeTab: "setup" | "ui";
  onNext: () => void;
}

export default function JourneyActions({
  activeTab,
  onNext,
}: JourneyActionsProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box sx={journeyActionsStyles.actions}>
      <Button
        onClick={() => router.back()}
        sx={journeyActionsStyles.cancelButton}
        size="large"
      >
        {JOURNEY_TEXT.ACTIONS.CANCEL}
      </Button>
      {activeTab === "setup" ? (
        <Button
          onClick={onNext}
          variant="contained"
          sx={journeyActionsStyles.submitButton(theme)}
          size="large"
        >
          {JOURNEY_TEXT.ACTIONS.NEXT}
        </Button>
      ) : (
        <Button
          type="submit"
          variant="contained"
          sx={journeyActionsStyles.submitButton(theme)}
          size="large"
        >
          {JOURNEY_TEXT.ACTIONS.CREATE_JOURNEY}
        </Button>
      )}
    </Box>
  );
}
