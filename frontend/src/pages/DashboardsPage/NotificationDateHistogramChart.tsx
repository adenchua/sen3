import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import fetchNotificationsHistogram from "../../api/analytics/fetchNotificationsHistogram";
import LineChart from "../../components/charts/LineChart";

export default function NotificationDateHistogramChart() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["fetchNotificationsHistogram"],
    queryFn: fetchNotificationsHistogram,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>An unknown error occurred</span>;
  }

  const keys = ["count"];

  const chartData = data?.map((histogramBucket) => {
    const { count, dateISOString } = histogramBucket;

    return {
      name: format(dateISOString, "dd/MM"),
      count: count,
    };
  });

  return <LineChart lineKeys={keys} data={chartData} />;
}
