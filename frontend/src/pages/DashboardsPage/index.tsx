import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import PageLayout from "../../components/PageLayout";
import TitledPaper from "../../components/TitledPaper";
import MessagesDateHistogramChart from "./MessagesDateHistogramChart";
import MetricChart from "./MetricChart";
import NotificationDateHistogramChart from "./NotificationDateHistogramChart";
import ServiceStatusChart from "./ServiceStatusChart";

function DashboardsPage() {
  return (
    <PageLayout>
      <Typography variant="h5">Status Dashboard</Typography>
      <Grid container spacing={2} mt={4}>
        <Grid size={5}>
          <MetricChart />
        </Grid>
        <Grid size={7}>
          <ServiceStatusChart />
        </Grid>
        <Grid size={6}>
          <TitledPaper title="Messages">
            <MessagesDateHistogramChart />
          </TitledPaper>
        </Grid>
        <Grid size={6}>
          <TitledPaper title="Notifications">
            <NotificationDateHistogramChart />
          </TitledPaper>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export default DashboardsPage;
