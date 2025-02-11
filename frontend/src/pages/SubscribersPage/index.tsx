import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";

import fetchSubscribers from "../../api/fetchSubscribers";
import PageLayout from "../../components/PageLayout";
import SubscriberInterface from "../../interfaces/subscriber";
import SubscriberCard from "./SubscriberCard";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<SubscriberInterface[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetchSubscribers(true);
      setSubscribers(response);
    }

    fetchData();
  }, []);

  return (
    <PageLayout>
      <Grid container spacing={1}>
        {subscribers?.map((subscriber) => (
          <Grid key={subscriber.id}>
            <SubscriberCard key={subscriber.id} subscriber={subscriber} />
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}
