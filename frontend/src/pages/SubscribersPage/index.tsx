import Grid from "@mui/material/Grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Typography from "@mui/material/Typography";
import fetchSubscribers from "../../api/subscribers/fetchSubscribers";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
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
  const PAGE_TITLE = "Subscribers";

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
      <PageLayout title={PAGE_TITLE}>
        <Loading />
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout title={PAGE_TITLE}>
        <ErrorMessage />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={PAGE_TITLE}>
      <Grid container spacing={1}>
        {subscribers.length === 0 && <Typography color="textSecondary">No subscribers</Typography>}
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
