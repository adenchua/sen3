import KeyboardDoubleArrowRightOutlined from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "react-router";

import Chip from "../../components/Chip";
import IconButton from "../../components/IconButton";
import DeckInterface from "../../interfaces/deck";

interface IProps {
  deck: DeckInterface;
}

export default function DeckCard(props: IProps) {
  const { deck } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const { title, chatIds, id, isActive } = deck;

  const isSelectedDeck = searchParams.get("deckId") === id;

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, mb: 1, border: isSelectedDeck ? "1px solid" : "", borderColor: "primary.main" }}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid>
          <Typography mb={1}>{title}</Typography>
          <Box>
            {isActive && <Chip label="Active" sx={{ mr: 1 }} color="success" />}
            <Chip label={`${chatIds.length} chats`} />
          </Box>
        </Grid>
        <Grid>
          <IconButton
            title="Select deck"
            color="primary"
            onClick={() => setSearchParams({ deckId: id })}
            icon={<KeyboardDoubleArrowRightOutlined />}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
