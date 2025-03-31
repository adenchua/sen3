import Grid from "@mui/material/Grid2";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import fetchSubscribers from "../../api/subscribers/fetchSubscribers";
import updateSubscriber from "../../api/subscribers/updateSubscriber";
import PageLayout from "../../components/PageLayout";
import SubscriberInterface from "../../interfaces/subscriber";
import RegistrantCard from "./RegistrantCard";

function RegistrantsPage() {
  const {
    data: registrants,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["fetchSubscribers"],
    queryFn: () => fetchSubscribers(false),
  });
  const queryClient = useQueryClient();

  async function handleApproveRegistrant(id: string) {
    await updateSubscriber(id, { isApproved: true });

    queryClient.setQueryData(["fetchSubscribers"], (cachedRegistrants: SubscriberInterface[]) => {
      if (!cachedRegistrants) {
        return cachedRegistrants;
      }

      return cachedRegistrants.filter((cachedRegistrant) => {
        return cachedRegistrant.id !== id;
      });
    });
  }

  if (isPending) {
    return (
      <PageLayout>
        <span>Loading...</span>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout>
        <span>An unknown error occured</span>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Grid container spacing={1}>
        {registrants.map((registrant) => (
          <Grid key={registrant.id}>
            <RegistrantCard registrant={registrant} onApproveRegistrant={handleApproveRegistrant} />
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}

export default RegistrantsPage;
