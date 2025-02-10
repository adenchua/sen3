import { useEffect, useState } from "react";

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
      <>
        {subscribers?.map((subscriber) => (
          <SubscriberCard key={subscriber.id} subscriber={subscriber} />
        ))}
      </>
    </PageLayout>
  );
}
