import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";

import fetchChats from "../../api/fetchChats";
import PageLayout from "../../components/PageLayout";
import ChatInterface from "../../interfaces/chat";
import ChatCard from "./ChatCard";
import updateChat from "../../api/updateChat";

function ChatsPage() {
  const [chats, setChats] = useState<ChatInterface[] | null>(null);

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
      <Grid container spacing={2}>
        {chats?.map((chat) => {
          return (
            <Grid key={chat.id}>
              <ChatCard
                chat={chat}
                onToggleCrawlStatus={handleToggleCrawlStatus}
              />
            </Grid>
          );
        })}
      </Grid>
    </PageLayout>
  );
}

export default ChatsPage;
