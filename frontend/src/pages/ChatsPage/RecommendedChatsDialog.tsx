import Box from "@mui/material/Box";
import DialogContentText from "@mui/material/DialogContentText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import addChat from "../../api/chats/addChat";
import fetchChatsByIds from "../../api/chats/fetchChatsByIds";
import fetchRecommendedChannels from "../../api/fetchRecommendedChannels";
import InformationDialog from "../../components/dialog/InformationDialog";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import { SECONDARY_BACKGROUND_COLOR } from "../../constants/styling";
import ChatInterface, { TelegramChatInterface } from "../../interfaces/chat";
import AddRecommendedChannelButton from "./AddRecommendedChannelButton";

interface IProps {
  isOpen: boolean;
  channel: ChatInterface;
  onClose: () => void;
}

function RecommendedChatsDialog(props: IProps) {
  const { isOpen, channel, onClose } = props;
  const queryClient = useQueryClient();
  const { username } = channel;

  const { data: recommendedChannels } = useQuery({
    queryKey: ["fetchRecommendedChannels", username],
    queryFn: () => fetchRecommendedChannels(username),
    enabled: isOpen,
  });

  const recommendedChannelIds = recommendedChannels?.map((recommendedChannel) =>
    String(recommendedChannel.id),
  );

  const {
    data: existingChannels,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["fetchChatsByIds", recommendedChannelIds],
    queryFn: () => fetchChatsByIds(recommendedChannelIds!),
    enabled: isOpen && !!recommendedChannelIds,
  });

  const existingChannelsHashMap = useMemo(() => {
    const result: Record<string, boolean> = {};
    existingChannels?.forEach((existingChannel) => {
      result[existingChannel.id] = true;
    });

    return result;
  }, [existingChannels]);

  async function handleAddChat(chat: TelegramChatInterface): Promise<void> {
    await addChat(chat);
    queryClient.invalidateQueries({ queryKey: ["fetchChatsByIds"] });
  }

  const HEADING = `Similar channels to @${channel.username}`;
  const SUB_HEADING =
    "These channels are recommended based on similarities in their subscriber bases:";

  if (isPending) {
    return (
      <InformationDialog
        heading={HEADING}
        subheading={SUB_HEADING}
        isOpen={isOpen}
        onClose={onClose}
      >
        <Loading />
      </InformationDialog>
    );
  }

  if (isError) {
    return (
      <InformationDialog
        heading={HEADING}
        subheading={SUB_HEADING}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ErrorMessage />
      </InformationDialog>
    );
  }

  return (
    <InformationDialog heading={HEADING} subheading={SUB_HEADING} isOpen={isOpen} onClose={onClose}>
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
                  bgcolor: SECONDARY_BACKGROUND_COLOR,
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
                <AddRecommendedChannelButton
                  isExists={existingChannelsHashMap[String(recommendedChannel.id)]}
                  channel={recommendedChannel}
                  onAddChannel={handleAddChat}
                />
              </Paper>
            );
          })}
        </Box>
      </>
    </InformationDialog>
  );
}

export default RecommendedChatsDialog;
