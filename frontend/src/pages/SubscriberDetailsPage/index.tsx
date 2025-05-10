import { ArrowBack } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import fetchSubscriberById from "../../api//subscribers/fetchSubscriberById";
import fetchDecksBySubscriber from "../../api/decks/fetchDecksBySubscriber";
import Button from "../../components/Button";
import PageLayout from "../../components/PageLayout";
import APP_ROUTES from "../../constants/routes";
import DeckInterface from "../../interfaces/deck";
import DeckDetails from "./DeckDetails";
import DeckList from "./DeckList";

export default function SubscriberDetailsPage() {
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
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

  const selectedDeck = useMemo(() => {
    if (selectedDeckId == null) {
      return null;
    }

    return decks?.find((deck) => deck.id === selectedDeckId);
  }, [selectedDeckId, decks]);

  function handleAddDeck(newDeck: DeckInterface) {
    queryClient.setQueryData(["fetchDecksBySubscriber", id], (cachedDecks: DeckInterface[]) => {
      return [newDeck, ...cachedDecks];
    });
  }

  function handleUpdateDeck(updatedDeck: DeckInterface) {
    queryClient.setQueryData(["fetchDecksBySubscriber", id], (cachedDecks: DeckInterface[]) => {
      if (!cachedDecks) {
        return cachedDecks;
      }

      return cachedDecks.map((cachedDeck) => {
        if (cachedDeck.id === updatedDeck.id) {
          return {
            ...updatedDeck,
          };
        }
        return cachedDeck;
      });
    });
  }

  function handleSelectDeck(deckId: string) {
    setSelectedDeckId(deckId);
  }

  if (subscriberQuery.isPending || decksQuery.isPending) {
    return (
      <PageLayout title="Subscriber Details">
        <span>Loading...</span>
      </PageLayout>
    );
  }

  if (subscriberQuery.isError || decksQuery.isError) {
    return (
      <PageLayout title="Subscriber Details">
        <span>An unknown error occurred</span>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Subscriber Details">
      <>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(APP_ROUTES.subscribersPage.path)}
          color="inherit"
          sx={{ mb: 4 }}
        >
          Return to subscriber list
        </Button>
        {subscriber && decks && (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>{`${subscriber.firstName}'s decks`}</Typography>
            <DeckList
              decks={decks}
              subscriberId={subscriber.id}
              onAddDeck={handleAddDeck}
              onUpdateDeck={handleUpdateDeck}
              onSelectDeck={handleSelectDeck}
              selectedDeckId={selectedDeckId}
            />
          </>
        )}
        <Divider sx={{ my: 3 }} />
        {subscriber && selectedDeck && (
          <DeckDetails
            subscriberId={subscriber.id}
            onUpdateDeck={handleUpdateDeck}
            deck={selectedDeck}
          />
        )}
      </>
    </PageLayout>
  );
}
