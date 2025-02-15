import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import { useState } from "react";

import IconButton from "../../components/IconButton";
import Switch from "../../components/Switch";
import Tooltip from "../../components/Tooltip";
import { APP_BACKGROUND_COLOR } from "../../constants/styling";
import RecommendedChannelsIcon from "../../icons/RecommendedChannelsIcon";
import TelegramChannelIcon from "../../icons/TelegramChannelIcon";
import TelegramChatGroupIcon from "../../icons/TelegramChatGroupIcon";
import ChatInterface from "../../interfaces/chat";
import RecommendedChatsDialog from "./RecommendedChatsDialog";
import DATE_FNS_DATE_FORMAT from "../../constants/dateFormat";

interface IProps {
  chat: ChatInterface;
  onToggleCrawlStatus: (chat: ChatInterface) => Promise<void>;
}

function ChatCard(props: IProps) {
  const { chat, onToggleCrawlStatus } = props;
  const { title, about, crawlActive, isChannel, username, lastCrawlDate } = chat;
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const formattedLastCrawlDate = lastCrawlDate
    ? `Last crawl on ${format(lastCrawlDate, DATE_FNS_DATE_FORMAT)}`
    : "";

  function handleCloseDialog() {
    setIsDialogOpen(false);
  }

  return (
    <>
      <Card
        sx={{
          height: "100%",
          width: "320px",
          display: "flex",
          flexDirection: "column",
        }}
        elevation={0}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flexGrow: 1,
          }}
        >
          <Box display="flex" gap={1} alignItems="flex-start">
            <Avatar variant="rounded">
              {isChannel ? <TelegramChannelIcon /> : <TelegramChatGroupIcon />}
            </Avatar>
            <Box mt="-2px">
              <Typography fontWeight="bold">{title}</Typography>
              <Typography variant="body2" color="textSecondary">
                @{username}
              </Typography>
            </Box>
          </Box>
          <Typography color="textSecondary" variant="body2">
            {formattedLastCrawlDate}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {about}
          </Typography>
        </CardContent>
        <CardActions
          sx={{ borderTop: "2px solid", borderColor: APP_BACKGROUND_COLOR, display: "flex" }}
        >
          {isChannel && (
            <IconButton
              sx={{ border: "1px solid", borderRadius: "4px", borderColor: "#D9D9D9" }}
              onClick={() => setIsDialogOpen(true)}
              title="View similar channels"
              icon={<RecommendedChannelsIcon />}
            />
          )}
          <Box flexGrow={1} />
          <Tooltip title="Toggle to crawl messages">
            <Switch checked={crawlActive} onChange={() => onToggleCrawlStatus(chat)} />
          </Tooltip>
        </CardActions>
      </Card>
      {isChannel && (
        <RecommendedChatsDialog isOpen={isDialogOpen} channel={chat} onClose={handleCloseDialog} />
      )}
    </>
  );
}

export default ChatCard;
