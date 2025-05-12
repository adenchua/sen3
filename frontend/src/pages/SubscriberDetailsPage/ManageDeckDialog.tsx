import CheckedIcon from "@mui/icons-material/CheckBox";
import UncheckedIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";

import fetchChats from "../../api/chats/fetchChats";
import updateDeck from "../../api/decks/updateDeck";
import Chip from "../../components/Chip";
import ActionDialog from "../../components/dialog/ActionDialog";
import IconButton from "../../components/IconButton";
import InputText from "../../components/InputText";
import { SECONDARY_BACKGROUND_COLOR } from "../../constants/styling";
import AddIcon from "../../icons/AddIcon";
import DeckInterface from "../../interfaces/deck";

interface IProps {
  deck: DeckInterface;
  isOpen: boolean;
  onClose: VoidFunction;
}

export default function ManageDeckDialog(props: IProps) {
  const { deck, isOpen, onClose } = props;
  const [editableDeck, setEditableDeck] = useState<DeckInterface>(deck);
  const keywordInputRef = useRef<TextFieldProps>(null);
  const queryClient = useQueryClient();

  const { data: availableChats } = useQuery({
    queryKey: ["fetchChats"],
    queryFn: fetchChats,
  });

  // helper constant for dropdown to map id to chat username
  const chatIdToUsernameMap = useMemo(() => {
    const result: Record<string, string> = {};
    availableChats?.forEach(
      (availableChat) => (result[availableChat.id] = `@${availableChat.username}`),
    );
    return result;
  }, [availableChats]);

  function handleSelectChat(event: SelectChangeEvent<typeof editableDeck.chatIds>) {
    const {
      target: { value },
    } = event;
    const selectedChatIds = typeof value === "string" ? value.split(",") : value;
    setEditableDeck((prev) => {
      const clonedDeck = { ...prev };
      clonedDeck.chatIds = selectedChatIds;
      return clonedDeck;
    });
  }

  async function handleAddKeyword() {
    if (deck == null || keywordInputRef.current == null || keywordInputRef.current.value === "") {
      return;
    }

    const input = keywordInputRef.current.value as string;

    // keyword already exist in the array, ignore
    if (editableDeck.keywords.includes(input)) {
      return;
    }

    setEditableDeck((prev) => {
      const clonedDeck = { ...prev };
      clonedDeck.keywords = [...clonedDeck.keywords, input];
      return clonedDeck;
    });

    // reset input to empty string
    keywordInputRef.current.value = "";
  }

  async function handleDeleteKeyword(selectedKeyword: string) {
    if (deck == null) {
      return;
    }
    setEditableDeck((prev) => {
      const clonedDeck = { ...prev };
      clonedDeck.keywords = clonedDeck.keywords.filter((keyword) => keyword !== selectedKeyword);
      return clonedDeck;
    });
  }

  async function handleUpdate(): Promise<void> {
    const { chatIds, keywords, title } = editableDeck;
    await updateDeck(deck.id, deck.subscriberId, {
      keywords,
      title,
      chatIds,
    });

    // invalidate query and refetch deck
    queryClient.invalidateQueries({ queryKey: ["fetchDecksBySubscriber", deck.subscriberId] });

    // cleanup and close dialog
    onClose();
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleUpdate}
      heading="Manage Deck"
      subheading="Select channels/groups, update keywords to monitor"
      onConfirmText="Save Changes"
    >
      <div>
        <Box mb={4}>
          <Typography mb={1}>Title</Typography>
          <InputText
            label=""
            id="deck-title"
            value={editableDeck.title}
            onChange={(e) => {
              setEditableDeck((prev) => {
                const clonedDeck = { ...prev };
                clonedDeck.title = e.target.value;
                return clonedDeck;
              });
            }}
            fullWidth
          />
        </Box>
        <Box mb={4}>
          <Typography mb={1}>Channels/Groups</Typography>
          {availableChats && (
            <FormControl fullWidth>
              <Select
                MenuProps={{
                  slotProps: {
                    paper: {
                      sx: {
                        maxHeight: "200px",
                      },
                    },
                  },
                }}
                sx={{
                  backgroundColor: SECONDARY_BACKGROUND_COLOR, // background of the displayed value box
                  borderRadius: "8px",
                }}
                multiple
                fullWidth
                size="small"
                value={editableDeck.chatIds}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={chatIdToUsernameMap[value]} />
                    ))}
                  </Box>
                )}
                onChange={handleSelectChat}
              >
                {availableChats
                  .sort((a, b) => a.username.localeCompare(b.username))
                  .map((availableChat) => {
                    const isSelected = editableDeck.chatIds.includes(availableChat.id);
                    return (
                      <MenuItem
                        key={availableChat.id}
                        value={availableChat.id}
                        sx={{
                          color: isSelected ? "primary" : "#707070",
                        }}
                      >
                        {isSelected && <CheckedIcon sx={{ mr: 1 }} color="primary" />}
                        {!isSelected && <UncheckedIcon sx={{ mr: 1 }} />}
                        {availableChat.username}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          )}
        </Box>
        <Typography mb={1.5}>Keywords to monitor</Typography>
        <InputText
          id="keyword-input"
          inputRef={keywordInputRef}
          fullWidth
          endAdornment={
            <IconButton
              icon={<AddIcon />}
              title="Add keyword"
              color="default"
              onClick={handleAddKeyword}
            />
          }
          label="Add keywords"
        />
        <Grid
          container
          spacing={1}
          sx={{
            mt: 1,
            border: "1px solid",
            borderRadius: "8px",
            p: 1,
            borderColor: "divider",
            bgcolor: SECONDARY_BACKGROUND_COLOR,
            display: editableDeck.keywords.length === 0 ? "none" : "",
          }}
        >
          {editableDeck.keywords.map((keyword) => (
            <Grid key={keyword}>
              <Chip label={keyword} onDelete={() => handleDeleteKeyword(keyword)} />
            </Grid>
          ))}
        </Grid>
      </div>
    </ActionDialog>
  );
}
