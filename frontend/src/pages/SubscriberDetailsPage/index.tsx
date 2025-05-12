import { ArrowBack } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import fetchSubscriberById from "../../api//subscribers/fetchSubscriberById";
import addDeck from "../../api/decks/addDeck";
import fetchDecksBySubscriber from "../../api/decks/fetchDecksBySubscriber";
import Button from "../../components/Button";
import PageLayout from "../../components/PageLayout";
import APP_ROUTES from "../../constants/routes";
import AddIcon from "../../icons/AddIcon";
import DeckList from "./DeckList";

export default function SubscriberDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [subscriberQuery, decksQuery] = useQueries({
    queries: [
      {
        queryKey: ["fetchSubscriberById", id],
        queryFn: () => fetchSubscriberById(id!),
        enabled: !!id,
      },
      {
        queryKey: ["fetchDecksBySubscriber", id],
        queryFn: () => fetchDecksBySubscriber(id!),
        enabled: !!id,
      },
    ],
  });

  const { data: subscriber } = subscriberQuery;
  const { data: decks } = decksQuery;

  async function handleAddDeck(): Promise<void> {
    const deckTitle = `Untitled Deck ${(decks?.length ?? 0) + 1}`;
    await addDeck(subscriber!.id, deckTitle);
    queryClient.invalidateQueries({ queryKey: ["fetchDecksBySubscriber", id] });
  }

  if (subscriberQuery.isPending || decksQuery.isPending) {
    return (
      <PageLayout title={`Manage subscriber ${subscriber?.firstName}`}>
        <span>Loading...</span>
      </PageLayout>
    );
  }

  if (subscriberQuery.isError || decksQuery.isError) {
    return (
      <PageLayout title={`Manage subscriber ${subscriber?.firstName}`}>
        <span>An unknown error occurred</span>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`Manage subscriber ${subscriber?.firstName}`}>
      <>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(APP_ROUTES.subscribersPage.path)}
          color="secondary"
          sx={{ mb: 12 }}
        >
          Back
        </Button>
        {subscriber && decks && (
          <>
            <Box display="flex" gap={2} mb={4}>
              <Typography variant="h5">Decks</Typography>
              <Button startIcon={<AddIcon />} onClick={handleAddDeck}>
                New Deck
              </Button>
            </Box>
            <DeckList decks={decks} subscriberId={subscriber.id} />
          </>
        )}
      </>
    </PageLayout>
  );
}
