import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";

import fetchSubscribers from "../../api/subscribers/fetchSubscribers";
import updateSubscriber from "../../api/subscribers/updateSubscriber";
import PageLayout from "../../components/PageLayout";
import SubscriberInterface from "../../interfaces/subscriber";
import RegistrantCard from "./RegistrantCard";

function RegistrantsPage() {
  const [registrants, setRegistrants] = useState<SubscriberInterface[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetchSubscribers(false);
      setRegistrants(response);
    }

    fetchData();
  }, []);

  async function handleApproveRegistrant(id: string) {
    await updateSubscriber(id, { isApproved: true });

    setRegistrants((prev) => prev.filter((registrant) => registrant.id !== id));
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
