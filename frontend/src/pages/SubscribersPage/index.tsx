import Grid from "@mui/material/Grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import fetchSubscribers from "../../api/subscribers/fetchSubscribers";
import PageLayout from "../../components/PageLayout";
import SubscriberInterface from "../../interfaces/subscriber";
import SubscriberCard from "./SubscriberCard";

export default function SubscribersPage() {
  const {
    data: subscribers,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["fetchSubscribers"],
    queryFn: () => fetchSubscribers(true),
  });

  const queryClient = useQueryClient();

  function handleUpdateSubscriber(updatedSubsciber: SubscriberInterface) {
    queryClient.setQueryData(["fetchSubscribers"], (cachedSubscribers: SubscriberInterface[]) => {
      if (!cachedSubscribers) {
        return cachedSubscribers;
      }

      return cachedSubscribers.map((cachedSubscriber) => {
        if (cachedSubscriber.id === updatedSubsciber.id) {
          return {
            ...updatedSubsciber,
          };
        }
        return cachedSubscriber;
      });
    });
  }

  if (isPending) {
    return (
      <PageLayout title="Subscribers">
        <span>Loading...</span>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout title="Subscribers">
        <span>An unknown error occurred</span>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Subscribers">
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
