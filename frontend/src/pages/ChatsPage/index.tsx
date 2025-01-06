import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";

import fetchChats from "../../api/fetchChats";
import updateChat from "../../api/updateChat";
import Button from "../../components/Button";
import PageLayout from "../../components/PageLayout";
import AddIcon from "../../icons/AddIcon";
import ChatInterface from "../../interfaces/chat";
import AddChatDialog from "./AddChatDialog";
import ChatCard from "./ChatCard";

function ChatsPage() {
  const [chats, setChats] = useState<ChatInterface[] | null>(null);
  const [isCreateChatDialogOpened, setIsCreateChatDialogOpened] = useState<boolean>(false);

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
    if (chats != null) {
      setChats((prev) =>
        prev!.map((prevChat) => {
          if (prevChat.id === id) {
            prevChat.crawlActive = !crawlActive;
          }

          return prevChat;
        })
      );
    }
  }

  return (
    <PageLayout>
      <>
        <Button sx={{ mb: 2 }} startIcon={<AddIcon />} onClick={() => setIsCreateChatDialogOpened(true)}>
          Add Chat
        </Button>
        <Grid container spacing={2} alignItems='stretch'>
          {chats?.map((chat) => {
            return (
              <Grid key={chat.id}>
                <ChatCard chat={chat} onToggleCrawlStatus={handleToggleCrawlStatus} />
              </Grid>
            );
          })}
        </Grid>
        <AddChatDialog isOpen={isCreateChatDialogOpened} onClose={handleCloseDialog} />
      </>
    </PageLayout>
  );
}

export default ChatsPage;
