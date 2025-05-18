import { ArrowBack } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import fetchSubscriberById from "../../api//subscribers/fetchSubscriberById";
import addDeck from "../../api/decks/addDeck";
import fetchDecksBySubscriber from "../../api/decks/fetchDecksBySubscriber";
import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
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
  const PAGE_TITLE = `Manage subscriber ${subscriber?.firstName}`;

  async function handleAddDeck(): Promise<void> {
    const deckTitle = `Untitled Deck ${(decks?.length ?? 0) + 1}`;
    await addDeck(subscriber!.id, deckTitle);
    queryClient.invalidateQueries({ queryKey: ["fetchDecksBySubscriber", id] });
  }

  if (subscriberQuery.isPending || decksQuery.isPending) {
    return (
      <PageLayout title={PAGE_TITLE}>
        <Loading />
      </PageLayout>
    );
  }

  if (subscriberQuery.isError || decksQuery.isError) {
    return (
      <PageLayout title={PAGE_TITLE}>
        <ErrorMessage />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={PAGE_TITLE}>
      <>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(APP_ROUTES.subscribersPage.path)}
          color="secondary"
          sx={{ mb: 12 }}
        >
          Back
        </Button>
        {decks && (
          <>
            <Box display="flex" gap={2} mb={4}>
              <Typography variant="h5">Decks</Typography>
              <Button startIcon={<AddIcon />} onClick={handleAddDeck}>
                Add deck
              </Button>
            </Box>
            <Box sx={{ height: "calc(100vh - 330px)", overflowY: "auto" }}>
              <DeckList decks={decks} />
            </Box>
          </>
        )}
      </>
    </PageLayout>
  );
}
