import TelegramBotIcon from "@mui/icons-material/SmartToyOutlined";
import DatabaseIcon from "@mui/icons-material/StorageOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";
import Stack from "@mui/material/Stack";
import { useQueries } from "@tanstack/react-query";

import ChartLayout from "./ChartLayout";
import ServiceStatusInfo from "./ServiceStatusInfo";
import getDatabaseHealth from "../../api/healthcheck/getDatabaseHealth";
import getTelegramServiceHealth from "../../api/healthcheck/getTelegramServiceHealth";

export default function ServiceStatusChart() {
  const [databaseHealthQuery, telegramServiceHealthQuery] = useQueries({
    queries: [
      {
        queryKey: ["getDatabaseHealth"],
        queryFn: getDatabaseHealth,
      },
      {
        queryKey: ["getTelegramServiceHealth"],
        queryFn: getTelegramServiceHealth,
      },
    ],
  });

  const { data: databaseHealth } = databaseHealthQuery;
  const { data: telegramServiceHealth } = telegramServiceHealthQuery;

  if (databaseHealthQuery.isPending || telegramServiceHealthQuery.isPending) {
    return (
      <ChartLayout title="Metrics (~24hrs)">
        <span>Loading...</span>
      </ChartLayout>
    );
  }

  if (databaseHealthQuery.isError || telegramServiceHealthQuery.isError) {
    return (
      <ChartLayout title="Metrics (~24hrs)">
        <span>An unknown error occured</span>
      </ChartLayout>
    );
  }

  return (
    <ChartLayout title="Service Status">
      <Stack gap={2}>
        <ServiceStatusInfo
          icon={<DatabaseIcon />}
          title="Database"
          isAvailable={!!databaseHealth}
        />
        <ServiceStatusInfo
          icon={<TelegramIcon />}
          title="Telegram Server"
          isAvailable={!!telegramServiceHealth}
        />
        <ServiceStatusInfo icon={<TelegramBotIcon />} title="Telegram Bot" isAvailable={false} />
      </Stack>
    </ChartLayout>
  );
}
