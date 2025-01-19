import { useEffect, useState } from "react";

import PageLayout from "../../components/PageLayout";
import fetchSubscribers from "../../api/fetchSubscribers";
import SubscriberInterface from "../../interfaces/subscriber";
import RegistrantCard from "./RegistrantCard";
import approveRegistrant from "../../api/approveRegistrant";

function RegistrantsPage() {
  const [registrants, setRegistrants] = useState<SubscriberInterface[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetchSubscribers(0);
      setRegistrants(response);
    }

    fetchData();
  }, []);

  async function handleApproveRegistrant(id: string) {
    if (registrants == null) {
      return;
    }

    await approveRegistrant(id);

    const updatedRegistrants = registrants.map((registrant) => {
      if (registrant.id === id) {
        registrant.isApproved = true;
      }
      return registrant;
    });

    setRegistrants(updatedRegistrants);
  }

  return (
    <PageLayout>
      <>
        {registrants?.map((registrant) => (
          <RegistrantCard
            key={registrant.id}
            registrant={registrant}
            onApproveRegistrant={handleApproveRegistrant}
          />
        ))}
      </>
    </PageLayout>
  );
}

export default RegistrantsPage;
