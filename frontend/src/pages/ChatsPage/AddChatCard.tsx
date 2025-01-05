import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import Button from "../../components/Button";
import { APP_BACKGROUND_COLOR } from "../../constants/styling";
import { TelegramChatInterface } from "../../interfaces/chat";

interface IProps {
  chat: TelegramChatInterface;
}

export default function AddChatCard(props: IProps) {
  const { chat } = props;

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        mb: 1,
        p: 2,
        bgcolor: APP_BACKGROUND_COLOR,
        display: "flex",
        alignItems: "center",
        textAlign: "start",
      }}
    >
      <div>
        <Typography>{chat.title}</Typography>
        <Typography variant="body2" color="textSecondary" display="block">
          @{chat.username}
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          {chat?.participantsCount.toLocaleString()} subscribers
        </Typography>
      </div>
      <Box flexGrow={1} />
      <Button>Add Chat</Button>
    </Paper>
  );
}
