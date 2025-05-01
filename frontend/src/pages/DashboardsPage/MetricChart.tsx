import SendIcon from "@mui/icons-material/Send";
import SendAndArchiveIcon from "@mui/icons-material/SendAndArchive";
import Grid from "@mui/material/Grid2";
import { useQueries } from "@tanstack/react-query";
import { subHours } from "date-fns";

import fetchMessagesCount from "../../api/analytics/fetchMessagesCount";
import fetchNotificationsCount from "../../api/analytics/fetchNotificationsCount";
import TitledPaper from "../../components/TitledPaper";
import MetricCard from "./MetricCard";

export default function MetricChart() {
  const [messagesCountQuery, notificationsCountQuery] = useQueries({
    queries: [
      {
        queryKey: ["fetchMessagesCount"],
        queryFn: () => fetchMessagesCount(subHours(new Date(), 24), new Date()),
      },
      {
        queryKey: ["fetchNotificationsCount"],
        queryFn: () => fetchNotificationsCount(subHours(new Date(), 24), new Date()),
      },
    ],
  });

  const { data: messagesCount } = messagesCountQuery;
  const { data: notificationsCount } = notificationsCountQuery;

  if (messagesCountQuery.isPending || notificationsCountQuery.isPending) {
    return (
      <TitledPaper title="Metrics (~24hrs)">
        <span>Loading...</span>
      </TitledPaper>
    );
  }

  if (messagesCountQuery.isError || notificationsCountQuery.isError) {
    return (
      <TitledPaper title="Metrics (~24hrs)">
        <span>An unknown error occurred</span>
      </TitledPaper>
    );
  }

  return (
    <TitledPaper title="Metrics (~24hrs)">
      <Grid container>
        <Grid size={6}>
          <MetricCard
            title="Messages Downloaded"
            value={messagesCount ?? -1}
            icon={<SendAndArchiveIcon color="primary" />}
          />
        </Grid>
        <Grid size={6}>
          <MetricCard
            title="Notifications Sent"
            value={notificationsCount ?? -1}
            icon={<SendIcon color="primary" />}
          />
        </Grid>
      </Grid>
    </TitledPaper>
  );
}
