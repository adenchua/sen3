import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Box, CardActions, Chip, IconButton } from "@mui/material";

import ChatInterface from "../../interfaces/chat";
import TelegramChannelIcon from "../../icons/TelegramChannelIcon";
import CrawlInactiveIcon from "../../icons/CrawlInactiveIcon";
import CrawlActiveIcon from "../../icons/CrawlActiveIcon";
import Tooltip from "../../components/Tooltip";
import RecommendedChannelsIcon from "../../icons/RecommendedChannelsIcon";
import TelegramChatGroupIcon from "../../icons/TelegramChatGroupIcon";
import RecommendedChatsDialog from "./RecommendedChatsDialog";

interface IProps {
  chat: ChatInterface;
  onToggleCrawlStatus: (chat: ChatInterface) => Promise<void>;
}

function ChatCard(props: IProps) {
  const { chat, onToggleCrawlStatus } = props;
  const { title, about, crawlActive, isChannel, username } = chat;
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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
          <Box>
            {isChannel && (
              <Chip
                icon={<TelegramChannelIcon />}
                label="Channel"
                sx={{ mr: 1, borderRadius: 2 }}
              />
            )}
            {!isChannel && (
              <Chip
                icon={<TelegramChatGroupIcon />}
                label="Chat Group"
                sx={{ mr: 1, borderRadius: 2 }}
              />
            )}
            {crawlActive && (
              <Chip
                label="Crawl Active"
                color="success"
                icon={<CrawlActiveIcon fontSize="small" />}
                sx={{ borderRadius: 2 }}
              />
            )}
            {!crawlActive && (
              <Chip
                label="Crawl Inactive"
                color="default"
                icon={<CrawlInactiveIcon fontSize="small" />}
                sx={{ borderRadius: 2 }}
              />
            )}
          </Box>
          <div>
            <Typography fontWeight="bold">{title}</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              @{username}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {about}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          {crawlActive && (
            <IconButton
              color="primary"
              onClick={() => onToggleCrawlStatus(chat)}
            >
              <Tooltip title="Disable message crawling">
                <CrawlInactiveIcon />
              </Tooltip>
            </IconButton>
          )}
          {!crawlActive && (
            <IconButton
              color="primary"
              onClick={() => onToggleCrawlStatus(chat)}
            >
              <Tooltip title="Enable message crawling">
                <CrawlActiveIcon />
              </Tooltip>
            </IconButton>
          )}
          {isChannel && (
            <IconButton color="primary" onClick={() => setIsDialogOpen(true)}>
              <Tooltip title="View similar channels">
                <RecommendedChannelsIcon />
              </Tooltip>
            </IconButton>
          )}
        </CardActions>
      </Card>
      {isChannel && (
        <RecommendedChatsDialog
          isOpen={isDialogOpen}
          channel={chat}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}

export default ChatCard;
