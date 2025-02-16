import { ArrowBack } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import fetchSubscriberById from "../../api//subscribers/fetchSubscriberById";
import fetchDecksBySubscriber from "../../api/decks/fetchDecksBySubscriber";
import Button from "../../components/Button";
import PageLayout from "../../components/PageLayout";
import APP_ROUTES from "../../constants/routes";
import DeckInterface from "../../interfaces/deck";
import SubscriberInterface from "../../interfaces/subscriber";
import DeckDetails from "./DeckDetails";
import DeckList from "./DeckList";

export default function SubscriberDetailsPage() {
  const [subscriber, setSubscriber] = useState<SubscriberInterface | null>(null);
  const [decks, setDecks] = useState<DeckInterface[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const selectedDeck = useMemo(() => {
    if (selectedDeckId == null) {
      return null;
    }

    return decks.find((deck) => deck.id === selectedDeckId);
  }, [selectedDeckId, decks]);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (id == null) {
        return;
      }

      const subscriberResponse = await fetchSubscriberById(id);
      const decksResponse = await fetchDecksBySubscriber(id);
      if (isMounted) {
        setSubscriber(subscriberResponse);
        setDecks(decksResponse);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  function handleAddDeck(newDeck: DeckInterface) {
    setDecks((prev) => [newDeck, ...prev]);
  }

  function handleUpdateDeck(updatedDeck: DeckInterface) {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id === updatedDeck.id) {
          return updatedDeck;
        }

        return deck;
      }),
    );
  }

  function handleSelectDeck(deckId: string) {
    setSelectedDeckId(deckId);
  }

  return (
    <PageLayout>
      <>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(APP_ROUTES.subscribersPage.path)}
          color="inherit"
          sx={{ mb: 4 }}
        >
          Return to subscriber list
        </Button>
        {subscriber && (
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
