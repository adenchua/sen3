import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import updateDeck from "../../api/decks/updateDeck";
import Chip from "../../components/Chip";
import ActionDialog from "../../components/dialog/ActionDialog";
import IconButton from "../../components/IconButton";
import InputText from "../../components/InputText";
import { SECONDARY_BACKGROUND_COLOR } from "../../constants/styling";
import AddIcon from "../../icons/AddIcon";
import DeckInterface from "../../interfaces/deck";
import ChatSelectDropdown from "../../components/ChatSelectDropdown";

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

  useEffect(() => {
    // when dialog is open, reset form
    if (isOpen) {
      setEditableDeck(deck);
    }
  }, [isOpen, deck]);

  function handleSelectChat(selectedChatIds: string[]): void {
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
    await updateDeck(deck.id, {
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
      onCloseText="Close"
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
          <ChatSelectDropdown
            defaultSelectedChatIds={editableDeck.chatIds}
            onUpdate={handleSelectChat}
          />
        </Box>
        <Typography mb={1.5}>Keywords to monitor</Typography>
        <InputText
          onKeyDown={(e) => {
            // if enter key is pressed, add keyword
            if (e.key === "Enter") {
              handleAddKeyword();
            }
          }}
          id="keyword-input"
          inputRef={keywordInputRef}
          fullWidth
          endAdornment={
            <IconButton
              icon={<AddIcon color="primary" />}
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
