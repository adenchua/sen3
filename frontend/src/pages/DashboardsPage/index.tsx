import Grid from "@mui/material/Grid";

import PageLayout from "../../components/PageLayout";
import TitledPaper from "../../components/TitledPaper";
import MessagesDateHistogramChart from "./MessagesDateHistogramChart";
import MetricChart from "./MetricChart";
import NotificationDateHistogramChart from "./NotificationDateHistogramChart";
import ServiceStatusChart from "./ServiceStatusChart";

function DashboardsPage() {
  return (
    <PageLayout title="Status Dashboard">
      <Grid container spacing={2}>
        <Grid size={4}>
          <MetricChart />
        </Grid>
        <Grid size={5}>
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
