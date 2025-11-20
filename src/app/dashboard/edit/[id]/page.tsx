import EditJourneyPage from "../../create/components/CreateJourney";

interface EditJourneyPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditJourneyContainer = async ({ params }: EditJourneyPageProps) => {
  const { id } = await params;
  return <EditJourneyPage journeyId={id} />;
};

export default EditJourneyContainer;
