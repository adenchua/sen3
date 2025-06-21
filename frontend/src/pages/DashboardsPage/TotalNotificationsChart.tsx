import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";

import Typography from "@mui/material/Typography";
import fetchNotificationsCount from "../../api/analytics/fetchNotificationsCount";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import TitledPaper from "../../components/TitledPaper";

export default function TotalNotificationsChart() {
  const {
    data: notificationsCount,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["fetchNotificationsCountTotal"],
    queryFn: () => fetchNotificationsCount(new Date(2020, 0, 1), new Date()),
  });

  const PAGE_TITLE = "Stats";

  if (isPending) {
    return (
      <TitledPaper title={PAGE_TITLE}>
        <Loading />
      </TitledPaper>
    );
  }

  if (isError) {
    return (
      <TitledPaper title={PAGE_TITLE}>
        <ErrorMessage />
      </TitledPaper>
    );
  }

  return (
    <TitledPaper title={PAGE_TITLE}>
      <Box
        mt={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h3" color="primary">
          {notificationsCount.toLocaleString()}
        </Typography>
        <Typography color="primary">Toital notifications sent</Typography>
      </Box>
    </TitledPaper>
  );
}
