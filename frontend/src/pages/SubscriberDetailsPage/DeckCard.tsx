import { KeyboardDoubleArrowRightOutlined } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import Chip from "../../components/Chip";
import IconButton from "../../components/IconButton";
import DeckInterface from "../../interfaces/deck";

interface IProps {
  deck: DeckInterface;
  onSelectDeck: (deck: DeckInterface) => void;
}

export default function DeckCard(props: IProps) {
  const { deck, onSelectDeck } = props;

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 1 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid>
          <Typography mb={1}>{deck.title}</Typography>
          <Box>
            <Chip label="Active" sx={{ mr: 1 }} color="success" />
            <Chip label={`${deck.chatIds.length} chats`} />
          </Box>
        </Grid>
        <Grid>
          <IconButton
            title="Select deck"
            color="primary"
            onClick={() => onSelectDeck(deck)}
            icon={<KeyboardDoubleArrowRightOutlined />}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
