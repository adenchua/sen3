import Box from "@mui/material/Box";
import DialogContentText from "@mui/material/DialogContentText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import fetchRecommendedChannels from "../../api/fetchRecommendedChannels";
import Button from "../../components/Button";
import InformationDialog from "../../components/dialog/InformationDialog";
import { APP_BACKGROUND_COLOR } from "../../constants/styling";
import ChatInterface from "../../interfaces/chat";

interface IProps {
  isOpen: boolean;
  channel: ChatInterface;
  onClose: () => void;
}

function RecommendedChatsDialog(props: IProps) {
  const { isOpen, channel, onClose } = props;
  const { username } = channel;
  const [recommendedChannels, setRecommendedChannels] = useState<
    ChatInterface[] | null
  >(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetchRecommendedChannels(username);
      setRecommendedChannels(response);
    }

    // only execute if dialog is opened
    if (isOpen) {
      fetchData();
    }
  }, [username, isOpen]);

  return (
    <InformationDialog
      heading={`Similar channels to @${channel.username}`}
      subheading="These channels were recommended by Telegram based on similarities in
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
          {recommendedChannels &&
            recommendedChannels.map((recommendedChannel) => {
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
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      display="block"
                    >
                      @{recommendedChannel.username}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      display="block"
                    >
                      {recommendedChannel.participantStats[0].count} subscribers
                    </Typography>
                  </div>
                  <Box flexGrow={1} />
                  <Button>Add Channel</Button>
                </Paper>
              );
            })}
        </Box>
      </>
    </InformationDialog>
  );
}

export default RecommendedChatsDialog;