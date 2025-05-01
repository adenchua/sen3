import Box from "@mui/material/Box";
import DialogContentText from "@mui/material/DialogContentText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import addChat from "../../api/chats/addChat";
import fetchRecommendedChannels from "../../api/fetchRecommendedChannels";
import Button from "../../components/Button";
import InformationDialog from "../../components/dialog/InformationDialog";
import { APP_BACKGROUND_COLOR } from "../../constants/styling";
import ChatInterface, { TelegramChatInterface } from "../../interfaces/chat";

interface IProps {
  isOpen: boolean;
  channel: ChatInterface;
  onClose: () => void;
}

function RecommendedChatsDialog(props: IProps) {
  const { isOpen, channel, onClose } = props;
  const { username } = channel;

  const {
    data: recommendedChannels,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["fetchRecommendedChannels", username],
    queryFn: () => fetchRecommendedChannels(username),
    enabled: isOpen,
  });

  async function handleAddChat(chat: TelegramChatInterface) {
    // TODO: add to the UI after adding
    await addChat(chat);
  }

  if (isPending) {
    return (
      <InformationDialog
        heading={`Similar channels to @${channel.username}`}
        subheading="These channels are recommended based on similarities in
          their subscriber bases:"
        isOpen={isOpen}
        onClose={onClose}
      >
        <span>Loading...</span>
      </InformationDialog>
    );
  }

  if (isError) {
    return (
      <InformationDialog
        heading={`Similar channels to @${channel.username}`}
        subheading="These channels are recommended based on similarities in
          their subscriber bases:"
        isOpen={isOpen}
        onClose={onClose}
      >
        <span>An unknown error occurred</span>
      </InformationDialog>
    );
  }

  return (
    <InformationDialog
      heading={`Similar channels to @${channel.username}`}
      subheading="These channels are recommended based on similarities in
          their subscriber bases:"
      isOpen={isOpen}
      onClose={onClose}
    >
      <>
        {recommendedChannels && recommendedChannels.length === 0 && (
          <DialogContentText>No similar channels</DialogContentText>
        )}
        <Box
          sx={{
            maxHeight: "280px",
            overflowY: "auto",
          }}
        >
          {recommendedChannels?.map((recommendedChannel) => {
            return (
              <Paper
                key={recommendedChannel.id}
                elevation={0}
                sx={{
                  bgcolor: APP_BACKGROUND_COLOR,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  textAlign: "start",
                }}
              >
                <div>
                  <Typography>{recommendedChannel.title}</Typography>
                  <Typography variant="body2" color="textSecondary" display="block">
                    @{recommendedChannel.username}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    {recommendedChannel.participantsCount.toLocaleString()} subscribers
                  </Typography>
                </div>
                <Box flexGrow={1} />
                <Button onClick={() => handleAddChat(recommendedChannel)}>Add Channel</Button>
              </Paper>
            );
          })}
        </Box>
      </>
    </InformationDialog>
  );
}

export default RecommendedChatsDialog;
