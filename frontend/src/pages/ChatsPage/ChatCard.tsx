import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import Chip from "../../components/Chip";
import IconButton from "../../components/IconButton";
import CrawlActiveIcon from "../../icons/CrawlActiveIcon";
import CrawlInactiveIcon from "../../icons/CrawlInactiveIcon";
import RecommendedChannelsIcon from "../../icons/RecommendedChannelsIcon";
import TelegramChannelIcon from "../../icons/TelegramChannelIcon";
import TelegramChatGroupIcon from "../../icons/TelegramChatGroupIcon";
import ChatInterface from "../../interfaces/chat";
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
            {isChannel ? (
              <Chip icon={<TelegramChannelIcon />} label="Channel" sx={{ mr: 1 }} />
            ) : (
              <Chip icon={<TelegramChatGroupIcon />} label="Chat Group" sx={{ mr: 1 }} />
            )}
            {crawlActive ? (
              <Chip
                label="Crawl Active"
                color="success"
                icon={<CrawlActiveIcon fontSize="small" />}
              />
            ) : (
              <Chip
                label="Crawl Inactive"
                color="default"
                icon={<CrawlInactiveIcon fontSize="small" />}
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
          {crawlActive ? (
            <IconButton
              color="primary"
              onClick={() => onToggleCrawlStatus(chat)}
              title="Disable message crawling"
              icon={<CrawlInactiveIcon />}
            />
          ) : (
            <IconButton
              color="primary"
              onClick={() => onToggleCrawlStatus(chat)}
              title="Enable message crawling"
              icon={<CrawlActiveIcon />}
            />
          )}
          {isChannel && (
            <IconButton
              color="primary"
              onClick={() => setIsDialogOpen(true)}
              title="View similar channels"
              icon={<RecommendedChannelsIcon />}
            />
          )}
        </CardActions>
      </Card>
      {isChannel && (
        <RecommendedChatsDialog isOpen={isDialogOpen} channel={chat} onClose={handleCloseDialog} />
      )}
    </>
  );
}

export default ChatCard;
