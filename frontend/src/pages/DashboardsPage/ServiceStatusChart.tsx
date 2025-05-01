import TelegramBotIcon from "@mui/icons-material/SmartToyOutlined";
import DatabaseIcon from "@mui/icons-material/StorageOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";
import Stack from "@mui/material/Stack";
import { useQueries } from "@tanstack/react-query";

import getDatabaseHealth from "../../api/healthcheck/getDatabaseHealth";
import getTelegramServiceHealth from "../../api/healthcheck/getTelegramServiceHealth";
import TitledPaper from "../../components/TitledPaper";
import ServiceStatusInfo from "./ServiceStatusInfo";

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
      <TitledPaper title="Service Status">
        <span>Loading...</span>
      </TitledPaper>
    );
  }

  if (databaseHealthQuery.isError || telegramServiceHealthQuery.isError) {
    return (
      <TitledPaper title="Service Status">
        <span>An unknown error occurred</span>
      </TitledPaper>
    );
  }

  return (
    <TitledPaper title="Service Status">
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
    </TitledPaper>
  );
}
