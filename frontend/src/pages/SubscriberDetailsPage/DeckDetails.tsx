import AddOutlined from "@mui/icons-material/AddOutlined";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useRef, useState } from "react";

import { useSearchParams } from "react-router";
import fetchChats from "../../api/chats/fetchChats";
import fetchDeckById from "../../api/decks/fetchDeckById";
import updateDeck from "../../api/decks/updateDeck";
import Button from "../../components/Button";
import Chip from "../../components/Chip";
import IconButton from "../../components/IconButton";
import InputText from "../../components/InputText";
import Switch from "../../components/Switch";
import EditIcon from "../../icons/EditIcon";
import SaveIcon from "../../icons/SaveIcon";
import ChatInterface from "../../interfaces/chat";
import DeckInterface from "../../interfaces/deck";
import ChatSelectionDialog from "./ChatSelectionDialog";

interface IProps {
  subscriberId: string;
}

export default function DeckDetails(props: IProps) {
  const { subscriberId } = props;
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [availableChats, setAvailableChats] = useState<ChatInterface[] | null>(null);
  const [deck, setDeck] = useState<DeckInterface | null>(null);
  const [titleEditState, setTitleEditState] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const keywordInputRef = useRef<TextFieldProps>(null);
  const titleInputRef = useRef<TextFieldProps>(null);

  // helper constant for dropdown to map id to chat username
  const chatIdToUsernameMap = useMemo(() => {
    const result: Record<string, string> = {};
    availableChats?.forEach(
      (availableChat) => (result[availableChat.id] = `@${availableChat.username}`),
    );
    return result;
  }, [availableChats]);

  // retrieves deck by url param deckId
  useEffect(() => {
    const deckId = searchParams.get("deckId");
    async function getData(id: string) {
      const response = await fetchDeckById(subscriberId, id);
      setDeck(response);
    }

    if (deckId) {
      getData(deckId);
    }
  }, [searchParams, subscriberId]);

  useEffect(() => {
    async function getData() {
      const response = await fetchChats();
      setAvailableChats(response);
    }

    getData();
  }, []);

  async function handleAddKeyword(): Promise<void> {
    if (deck == null || keywordInputRef.current == null || keywordInputRef.current.value === "") {
      return;
    }
    const updatedKeywords = [...deck.keywords, keywordInputRef.current.value as string];

    await updateDeck(deck.id, subscriberId, {
      keywords: updatedKeywords,
    });

    // update local deck state with updated keywords
    setDeck({ ...deck, keywords: updatedKeywords });
  }

  async function handleDeleteKeyword(selectedKeyword: string): Promise<void> {
    if (deck == null) {
      return;
    }
    const updatedKeywords = deck.keywords.filter((keyword) => keyword !== selectedKeyword);

    await updateDeck(deck.id, subscriberId, {
      keywords: updatedKeywords,
    });

    // update local deck state with updated keywords
    setDeck({ ...deck, keywords: updatedKeywords });
  }

  async function handleUpdateChats(newChatIds: string[]): Promise<void> {
    if (deck == null) {
      return;
    }

    await updateDeck(deck.id, subscriberId, {
      chatIds: newChatIds,
    });

    // update local deck state with updated chatIds
    setDeck({ ...deck, chatIds: newChatIds });
  }

  async function handleToggleActive(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    if (deck == null) {
      return;
    }

    const updatedActiveValue = event.target.checked;
    await updateDeck(deck.id, subscriberId, {
      isActive: updatedActiveValue,
    });

    // update local deck state with updated active state
    setDeck({ ...deck, isActive: updatedActiveValue });
  }

  async function handleUpdateTitle(): Promise<void> {
    if (deck == null || titleInputRef.current == null || titleInputRef.current.value === "") {
      return;
    }

    const updatedTitle = titleInputRef.current.value as string;

    await updateDeck(deck.id, subscriberId, {
      title: updatedTitle,
    });

    setDeck({ ...deck, title: updatedTitle });
    setTitleEditState(false);
  }

  if (deck == null) {
    return <div />;
  }

  const { chatIds, isActive, keywords, title } = deck;

  return (
    <>
      <Stack spacing={0.5}>
        <Paper sx={{ p: 2 }} elevation={0}>
          <Box display="flex" alignItems="center" gap={1} mb={4}>
            {titleEditState && (
              <InputText
                defaultValue={title}
                inputRef={titleInputRef}
                label="Update title"
                id="deck-title"
                endAdornment={
                  <IconButton
                    icon={<SaveIcon />}
                    title="Save changes"
                    onClick={handleUpdateTitle}
                  />
                }
              />
            )}
            {!titleEditState && (
              <>
                <Typography variant="h5">{title}</Typography>
                <IconButton
                  icon={<EditIcon />}
                  title="Edit title"
                  onClick={() => setTitleEditState(true)}
                />
              </>
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Receive notifications</Typography>
            <Switch checked={isActive} onChange={handleToggleActive} />
          </Box>
        </Paper>
        <Paper sx={{ p: 2 }} elevation={0}>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Typography variant="h5">Chats</Typography>
            <Button onClick={() => setIsDialogOpen(true)}>Select chats</Button>
          </Box>
          <Grid container spacing={1}>
            {chatIds.map((chatId) => (
              <Grid key={chatId}>
                <Chip label={chatIdToUsernameMap[chatId]} />
              </Grid>
            ))}
          </Grid>
        </Paper>
        <Paper sx={{ p: 2 }} elevation={0}>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Typography variant="h5">Keywords</Typography>
            <InputText
              id="keyword-input"
              inputRef={keywordInputRef}
              endAdornment={
                <IconButton
                  icon={<AddOutlined />}
                  title="Add keyword"
                  color="default"
                  onClick={handleAddKeyword}
                />
              }
              label="Add keywords"
            />
          </Box>
          <Grid container spacing={1}>
            {keywords.map((keyword) => (
              <Grid key={keyword}>
                <Chip label={keyword} onDelete={() => handleDeleteKeyword(keyword)} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Stack>
      {availableChats && (
        <ChatSelectionDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          selectedChatIds={chatIds}
          onSelectChats={handleUpdateChats}
          availableChats={availableChats}
        />
      )}
    </>
  );
}
