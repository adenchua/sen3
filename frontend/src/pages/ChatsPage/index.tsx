import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";

import fetchChats from "../../api/chats/fetchChats";
import updateChat from "../../api/chats/updateChat";
import Button from "../../components/Button";
import InputText from "../../components/InputText";
import PageLayout from "../../components/PageLayout";
import AddIcon from "../../icons/AddIcon";
import ChatInterface from "../../interfaces/chat";
import AddChatDialog from "./AddChatDialog";
import ChatCard from "./ChatCard";

function ChatsPage() {
  const [chats, setChats] = useState<ChatInterface[]>([]);
  const [isCreateChatDialogOpened, setIsCreateChatDialogOpened] = useState<boolean>(false);
  const [chatFilter, setChatFilter] = useState<string>("");

  // return chats with title or username that contains the chat filter
  const filteredChat = useMemo(
    () =>
      chats.filter((chat) => {
        const lowercaseTitle = chat.title.toLowerCase();
        const lowercaseUsername = chat.username.toLowerCase();
        const lowercaseChatFilter = chatFilter.toLowerCase();

        return (
          lowercaseTitle.includes(lowercaseChatFilter) ||
          lowercaseUsername.includes(lowercaseChatFilter)
        );
      }),
    [chats, chatFilter],
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      const response = await fetchChats();
      if (isMounted) {
        setChats(response);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleCloseDialog() {
    setIsCreateChatDialogOpened(false);
  }

  async function handleToggleCrawlStatus(chat: ChatInterface) {
    const { crawlActive, id } = chat;
    await updateChat(id, !crawlActive);

    // update the active status of the updated chat
    setChats((prev) =>
      prev.map((prevChat) => {
        if (prevChat.id === id) {
          prevChat.crawlActive = !crawlActive;
        }

        return prevChat;
      }),
    );
  }

  async function handleAddChat(newChat: ChatInterface) {
    // add new chat to the start of the chat list
    setChats((prev) => [newChat, ...prev]);
  }

  return (
    <PageLayout>
      <Grid container alignItems="center" spacing={2} mb={4}>
        <Grid>
          <InputText
            type="search"
            id="chat-search"
            label="Filter chat"
            onChange={(e) => setChatFilter(e.target.value)}
          />
        </Grid>
        <Grid>
          <Button startIcon={<AddIcon />} onClick={() => setIsCreateChatDialogOpened(true)}>
            Add Chat
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ height: "calc(100vh - 200px)", overflowY: "auto" }}>
        <Grid container spacing={2}>
          {chatFilter.length > 0 && filteredChat.length === 0 && (
            <Typography>There are no matching channel/groups with filter "{chatFilter}"</Typography>
          )}
          {filteredChat?.map((chat) => {
            return (
              <Grid key={chat.id}>
                <ChatCard chat={chat} onToggleCrawlStatus={handleToggleCrawlStatus} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <AddChatDialog
        isOpen={isCreateChatDialogOpened}
        onClose={handleCloseDialog}
        onAddChat={handleAddChat}
      />
    </PageLayout>
  );
}

export default ChatsPage;
