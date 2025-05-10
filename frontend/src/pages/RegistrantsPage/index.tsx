import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import fetchSubscribers from "../../api/subscribers/fetchSubscribers";
import updateSubscriber from "../../api/subscribers/updateSubscriber";
import PageLayout from "../../components/PageLayout";
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

  const { mutateAsync: mutateApproveRegistrant } = useMutation({
    mutationFn: (id: string) => updateSubscriber(id, { isApproved: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchSubscribers"] });
    },
  });

  async function handleApproveRegistrant(id: string) {
    await mutateApproveRegistrant(id);
  }

  if (isPending) {
    return (
      <PageLayout title="Registrants">
        <span>Loading...</span>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout title="Registrants">
        <span>An unknown error occurred</span>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Registrants">
      <Grid container spacing={1}>
        {registrants.length === 0 && (
          <Typography color="textSecondary">No pending registrants</Typography>
        )}
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
