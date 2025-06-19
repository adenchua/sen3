import { useQuery } from "@tanstack/react-query";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import fetchDeckTemplates from "../../api/deck-templates/fetchDeckTemplates";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import DeckTemplateCard from "./DeckTemplateCard";

export default function DeckTemplatesContainer() {
  const {
    data: deckTemplates,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["fetchDeckTemplates"],
    queryFn: fetchDeckTemplates,
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorMessage />;
  }

  const sortedDeckTemplates = deckTemplates.sort(
    (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
  );

  return (
    <Box sx={{ height: "calc(100vh - 196px)", overflowY: "auto" }}>
      <Stack gap={2}>
        {sortedDeckTemplates.map((deckTemplate) => {
          return <DeckTemplateCard key={deckTemplate.id} deckTemplate={deckTemplate} />;
        })}
      </Stack>
    </Box>
  );
}
