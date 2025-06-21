import SendIcon from "@mui/icons-material/OutgoingMail";
import SendAndArchiveIcon from "@mui/icons-material/SendAndArchive";
import Grid from "@mui/material/Grid";
import { useQueries } from "@tanstack/react-query";
import { subHours } from "date-fns";

import fetchMessagesCount from "../../api/analytics/fetchMessagesCount";
import fetchNotificationsCount from "../../api/analytics/fetchNotificationsCount";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
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
  const PAGE_TITLE = "Metrics (~24hrs)";

  if (messagesCountQuery.isPending || notificationsCountQuery.isPending) {
    return (
      <TitledPaper title={PAGE_TITLE}>
        <Loading />
      </TitledPaper>
    );
  }

  if (messagesCountQuery.isError || notificationsCountQuery.isError) {
    return (
      <TitledPaper title={PAGE_TITLE}>
        <ErrorMessage />
      </TitledPaper>
    );
  }

  return (
    <TitledPaper title={PAGE_TITLE}>
      <Grid container mt={5}>
        <Grid size={6}>
          <MetricCard
            title="Messages downloaded"
            value={messagesCount ?? -1}
            icon={<SendAndArchiveIcon color="primary" />}
          />
        </Grid>
        <Grid size={6}>
          <MetricCard
            title="Notifications sent"
            value={notificationsCount ?? -1}
            icon={<SendIcon color="primary" />}
          />
        </Grid>
      </Grid>
    </TitledPaper>
  );
}
