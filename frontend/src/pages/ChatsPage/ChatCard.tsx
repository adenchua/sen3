import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import ChatInterface from "../../interfaces/chat";
import { Box, CardActions, Chip, IconButton } from "@mui/material";
import TelegramChannelIcon from "../../icons/TelegramChannelIcon";
import CrawlInactiveIcon from "../../icons/CrawlInactiveIcon";
import CrawlActiveIcon from "../../icons/CrawlActiveIcon";
import Tooltip from "../../components/Tooltip";
import RecommendedChannelsIcon from "../../icons/RecommendedChannelsIcon";
import TelegramChatGroupIcon from "../../icons/TelegramChatGroupIcon";

interface IProps {
  chat: ChatInterface;
  onToggleCrawlStatus: (chat: ChatInterface) => Promise<void>;
}

function ChatCard(props: IProps) {
  const { chat, onToggleCrawlStatus } = props;
  const { title, about, crawlActive, lastCrawlDate, isChannel } = chat;

  return (
    <Card
      sx={{
        width: "320px",
        height: "240px",
        display: "flex",
        flexDirection: "column",
      }}
      variant="outlined"
    >
      <CardContent
        sx={{ display: "flex", flexDirection: "column", gap: 0.5, flexGrow: 1 }}
      >
        <Box>
          {isChannel && (
            <Chip
              icon={<TelegramChannelIcon />}
              label="Channel"
              sx={{ mr: 1 }}
            />
          )}
          {!isChannel && (
            <Chip
              icon={<TelegramChatGroupIcon />}
              label="Chat Group"
              sx={{ mr: 1 }}
            />
          )}
          {crawlActive && (
            <Chip
              label="Crawl Active"
              color="success"
              icon={<CrawlActiveIcon fontSize="small" />}
            />
          )}
          {!crawlActive && (
            <Chip
              label="Crawl Inactive"
              color="default"
              icon={<CrawlInactiveIcon fontSize="small" />}
            />
          )}
        </Box>
        <Typography fontWeight="bold">{title}</Typography>
        <Typography variant="body2">
          Last crawl date: {lastCrawlDate ?? "-"}
        </Typography>
        <Typography color="textSecondary" variant="body2" textAlign="justify">
          {about}
        </Typography>
      </CardContent>
      <CardActions>
        {crawlActive && (
          <IconButton color="primary" onClick={() => onToggleCrawlStatus(chat)}>
            <Tooltip title="Disable message crawling">
              <CrawlInactiveIcon />
            </Tooltip>
          </IconButton>
        )}
        {!crawlActive && (
          <IconButton color="primary" onClick={() => onToggleCrawlStatus(chat)}>
            <Tooltip title="Enable message crawling">
              <CrawlActiveIcon />
            </Tooltip>
          </IconButton>
        )}
        {isChannel && (
          <IconButton color="primary" disabled>
            <Tooltip title="View recommended channels">
              <RecommendedChannelsIcon />
            </Tooltip>
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
}

export default ChatCard;
