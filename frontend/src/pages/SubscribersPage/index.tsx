import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";

import fetchSubscribers from "../../api/subscribers/fetchSubscribers";
import PageLayout from "../../components/PageLayout";
import SubscriberInterface from "../../interfaces/subscriber";
import SubscriberCard from "./SubscriberCard";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<SubscriberInterface[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      const response = await fetchSubscribers(true);
      if (isMounted) {
        setSubscribers(response);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleUpdateSubscriber(updatedSubsciber: SubscriberInterface) {
    setSubscribers((prev) =>
      prev.map((subscriber) => {
        if (subscriber.id === updatedSubsciber.id) {
          return updatedSubsciber;
        }
        return subscriber;
      }),
    );
  }

  return (
    <PageLayout>
      <Grid container spacing={1}>
        {subscribers.map((subscriber) => (
          <Grid key={subscriber.id}>
            <SubscriberCard
              key={subscriber.id}
              subscriber={subscriber}
              onUpdateSubscriber={handleUpdateSubscriber}
            />
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}
