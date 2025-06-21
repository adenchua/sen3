import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import fetchSubscribers from "../../api/subscribers/fetchSubscribers";
import updateSubscriber from "../../api/subscribers/updateSubscriber";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import PageLayout from "../../components/PageLayout";
import RegistrantCard from "./RegistrantCard";
import deleteSubscriber from "../../api/subscribers/deleteSubscriber";

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
  const PAGE_TITLE = "Registrants";

  const { mutateAsync: mutateApproveRegistrant } = useMutation({
    mutationFn: (id: string) => updateSubscriber(id, { isApproved: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchSubscribers"] });
    },
  });

  const { mutateAsync: mutateDeleteRegistrant } = useMutation({
    mutationFn: (id: string) => deleteSubscriber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchSubscribers"] });
    },
  });

  async function handleApproveRegistrant(id: string) {
    await mutateApproveRegistrant(id);
  }

  async function handleDeleteRegistrant(id: string) {
    await mutateDeleteRegistrant(id);
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
        {registrants.length === 0 && (
          <Typography color="textSecondary">No pending registrants</Typography>
        )}
        {registrants.map((registrant) => (
          <Grid key={registrant.id}>
            <RegistrantCard
              registrant={registrant}
              onApproveRegistrant={handleApproveRegistrant}
              onDeleteRegistrant={handleDeleteRegistrant}
            />
          </Grid>
        ))}
      </Grid>
    </PageLayout>
  );
}

export default RegistrantsPage;
