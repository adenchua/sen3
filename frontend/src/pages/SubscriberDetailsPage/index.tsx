import { ArrowBack } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import fetchDecksBySubscriber from "../../api/decks/fetchDecksBySubscriber";
import fetchSubscriberById from "../../api/fetchSubscriberById";
import Button from "../../components/Button";
import PageLayout from "../../components/PageLayout";
import APP_ROUTES from "../../constants/routes";
import RegistrantIcon from "../../icons/RegistrantIcon";
import DeckInterface from "../../interfaces/deck";
import SubscriberInterface from "../../interfaces/subscriber";
import DeckDetails from "./DeckDetails";
import DeckList from "./DeckList";

export default function SubscriberDetailsPage() {
  const [subscriber, setSubscriber] = useState<SubscriberInterface | null>(null);
  const [decks, setDecks] = useState<DeckInterface[] | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (id == null) {
        return;
      }

      const subscriberResponse = await fetchSubscriberById(id);
      const decksResponse = await fetchDecksBySubscriber(id);
      setSubscriber(subscriberResponse);
      setDecks(decksResponse);
    }

    fetchData();
  }, [id]);

  return (
    <PageLayout>
      <Grid container sx={{ height: "calc(100vh - 128px)" }} spacing={2}>
        <Grid size={3} sx={{ height: "100%" }}>
          <Stack spacing={2} sx={{ display: "flex", height: "100%" }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(APP_ROUTES.subscribersPage.path)}
              color="inherit"
            >
              Return to subscriber list
            </Button>
            {subscriber && (
              <Paper sx={{ p: 2 }} elevation={0}>
                <Grid container spacing={2} alignItems="center">
                  <Grid>
                    <Avatar>
                      <RegistrantIcon />
                    </Avatar>
                  </Grid>
                  <Grid>
                    <Typography>
                      {subscriber.firstName} {subscriber.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      @{subscriber.username} ({id})
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
            <Divider />
            {decks && subscriber && <DeckList decks={decks} subscriberId={subscriber.id} />}
          </Stack>
        </Grid>
        <Grid size={9} sx={{ height: "100%" }}>
          {subscriber && <DeckDetails subscriberId={subscriber.id} />}
        </Grid>
      </Grid>
    </PageLayout>
  );
}
