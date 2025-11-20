"use client";

import { useParams } from "next/navigation";
import CreateJourneyPage from "../../create/components/CreateJourney";

const CloneJourneyContainer = () => {
  const params = useParams();
  const journeyId = params?.id as string;

  return <CreateJourneyPage journeyId={journeyId} isCloneMode={true} />;
};

export default CloneJourneyContainer;
