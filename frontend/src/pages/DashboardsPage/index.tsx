import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import PageLayout from "../../components/PageLayout";
import MetricChart from "./MetricChart";
import ServiceStatusChart from "./ServiceStatusChart";

function DashboardsPage() {
  return (
    <PageLayout>
      <Typography variant="h5">Status Dashboard</Typography>
      <Grid container spacing={2} mt={4}>
        <Grid size={4}>
          <MetricChart />
        </Grid>
        <Grid size={7}>
          <ServiceStatusChart />
        </Grid>
      </Grid>
    </PageLayout>
  );
}

export default DashboardsPage;
