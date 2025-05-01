import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import fetchChats from "../../api/chats/fetchChats";
import updateChat from "../../api/chats/updateChat";
import Button from "../../components/Button";
import InputText from "../../components/InputText";
import PageLayout from "../../components/PageLayout";
import AddIcon from "../../icons/AddIcon";
import ChatInterface from "../../interfaces/chat";
import AddChatDialog from "./AddChatDialog";
import ChatCard from "./ChatCard";

export default function ChatsPage() {
  const {
    data: chats,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["fetchChats"],
    queryFn: fetchChats,
  });

  const { mutateAsync: mutateUpdateChat } = useMutation({
    mutationFn: ({ id, crawlActive }: { id: string; crawlActive: boolean }) =>
      updateChat(id, crawlActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchChats"] });
    },
  });

  const queryClient = useQueryClient();

  const [isCreateChatDialogOpened, setIsCreateChatDialogOpened] = useState<boolean>(false);
  const [chatFilter, setChatFilter] = useState<string>("");

  // return chats with title or username that contains the chat filter
  const filteredChat = useMemo(
    () =>
      chats?.filter((chat) => {
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

  function handleCloseDialog() {
    setIsCreateChatDialogOpened(false);
  }

  async function handleToggleCrawlStatus(chat: ChatInterface) {
    const { crawlActive, id } = chat;
    await mutateUpdateChat({ id, crawlActive: !crawlActive });
  }

  function handleAddChat(newChat: ChatInterface) {
    // add new chat to the start of the chat list
    queryClient.setQueryData(["fetchChats"], (cachedChats: ChatInterface[]) => {
      return [newChat, ...cachedChats];
    });
  }

  if (isPending) {
    return (
      <PageLayout>
        <span>Loading...</span>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout>
        <span>An unknown error occurred</span>
      </PageLayout>
    );
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
          {chatFilter.length > 0 && filteredChat && filteredChat.length === 0 && (
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
