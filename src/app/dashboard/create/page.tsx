import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import CreateJourneyPage from "./components/CreateJourney";

const CreateJourneyContainer = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <CreateJourneyPage />
    </Suspense>
  );
};

export default CreateJourneyContainer;
