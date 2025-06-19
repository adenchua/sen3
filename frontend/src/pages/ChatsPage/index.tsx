import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { compareDesc } from "date-fns";
import { useMemo, useState } from "react";

import fetchChats from "../../api/chats/fetchChats";
import updateChat from "../../api/chats/updateChat";
import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";
import InputText from "../../components/InputText";
import Loading from "../../components/Loading";
import PageLayout from "../../components/PageLayout";
import AddIcon from "../../icons/AddIcon";
import ChatInterface from "../../interfaces/chat";
import AddChatDialog from "./AddChatDialog";
import ChatCard from "./ChatCard";

type CHAT_TYPE = "ALL" | "CHANNEL" | "GROUP";

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
  const [chatSearchFilter, setChatSearchFilter] = useState<string>("");
  const [chatTypeFilter, setChatTypeFilter] = useState<CHAT_TYPE>("ALL");

  const PAGE_TITLE = "Channels/Groups";

  // return chats after all the filters applied
  const filteredChat = useMemo(() => {
    // filter by search on username/title
    const searchFilteredChats = chats?.filter((chat) => {
      const lowercaseTitle = chat.title.toLowerCase();
      const lowercaseUsername = chat.username.toLowerCase();
      const lowercaseChatFilter = chatSearchFilter.toLowerCase();

      return (
        lowercaseTitle.includes(lowercaseChatFilter) ||
        lowercaseUsername.includes(lowercaseChatFilter)
      );
    });

    // filter by chat type
    const chatTypeFilteredChats = searchFilteredChats?.filter((chat) => {
      if (chatTypeFilter === "ALL") {
        return chat;
      }

      if (chatTypeFilter === "CHANNEL") {
        return chat.isChannel;
      }

      return !chat.isChannel;
    });

    const sortedChat = chatTypeFilteredChats?.sort((a, b) =>
      compareDesc(a.updatedDate, b.updatedDate),
    );

    return sortedChat;
  }, [chats, chatSearchFilter, chatTypeFilter]);

  const channelsCount = useMemo(() => {
    return chats?.filter((chat) => chat.isChannel).length;
  }, [chats]);

  const groupsCount = useMemo(() => {
    return chats?.filter((chat) => !chat.isChannel).length;
  }, [chats]);

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
      <PageLayout title={PAGE_TITLE}>
        <Loading />
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout title={PAGE_TITLE}>
        <ErrorMessage />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={PAGE_TITLE}>
      <Grid container mb={4} spacing={1}>
        <Button
          onClick={() => setChatTypeFilter("ALL")}
          color={chatTypeFilter === "ALL" ? "primary" : "secondary"}
        >
          All ({chats.length})
        </Button>
        <Button
          onClick={() => setChatTypeFilter("CHANNEL")}
          color={chatTypeFilter === "CHANNEL" ? "primary" : "secondary"}
        >
          Channels ({channelsCount})
        </Button>
        <Button
          onClick={() => setChatTypeFilter("GROUP")}
          color={chatTypeFilter === "GROUP" ? "primary" : "secondary"}
        >
          Groups ({groupsCount})
        </Button>
      </Grid>
      <Grid container alignItems="center" spacing={2} mb={4}>
        <Grid size="auto">
          <InputText
            sx={{ width: "480px" }}
            type="search"
            id="chat-search"
            label="Search for channel/group title, handle"
            onChange={(e) => setChatSearchFilter(e.target.value)}
          />
        </Grid>
        <Grid>
          <Button startIcon={<AddIcon />} onClick={() => setIsCreateChatDialogOpened(true)}>
            Add Chat
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ height: "calc(100vh - 268.5px)", overflowY: "auto" }}>
        <Grid container spacing={2}>
          {chatSearchFilter.length > 0 && filteredChat && filteredChat.length === 0 && (
            <Typography>
              There are no matching channel/groups with filter "{chatSearchFilter}"
            </Typography>
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
