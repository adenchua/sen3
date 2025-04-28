import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import fetchMessagesHistogram from "../../api/analytics/fetchMessagesHistogram";
import LineChart from "../../components/charts/LineChart";

export default function MessagesDateHistogramChart() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["fetchMessagesHistogram"],
    queryFn: fetchMessagesHistogram,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>An unknown error occured</span>;
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
