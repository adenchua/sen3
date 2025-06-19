import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import updateDeckTemplate from "../../api/deck-templates/updateDeckTemplate";
import ChatSelectDropdown from "../../components/ChatSelectDropdown";
import ActionDialog from "../../components/dialog/ActionDialog";
import InputText from "../../components/InputText";
import Switch from "../../components/Switch";
import DeckTemplateInterface from "../../interfaces/deckTemplate";

interface IProps {
  deckTemplate: DeckTemplateInterface;
  isOpen: boolean;
  onClose: VoidFunction;
}

export default function ManageDeckTemplateDialog(props: IProps) {
  const { deckTemplate, isOpen, onClose } = props;
  const { id, chatIds, isDefault, title } = deckTemplate;

  const [selectedChatIds, setSelectedChatIds] = useState<string[]>(chatIds);
  const [isDefaultInput, setIsDefaultInput] = useState<boolean>(isDefault);
  const [titleInput, setTitleInput] = useState<string>(title);

  const queryClient = useQueryClient();

  useEffect(() => {
    // when dialog is open, reset form
    if (isOpen) {
      setSelectedChatIds(chatIds);
      setIsDefaultInput(isDefault);
      setTitleInput(title);
    }
  }, [isOpen, chatIds, isDefault, title]);

  async function handleUpdate() {
    if (titleInput === "" || selectedChatIds.length === 0) {
      return;
    }

    await updateDeckTemplate(id, {
      title: titleInput,
      isDefault: isDefaultInput,
      chatIds: selectedChatIds,
    });
    queryClient.invalidateQueries({ queryKey: ["fetchDeckTemplates"] });
    onClose();
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleUpdate}
      onConfirmText="Save Changes"
      heading="Update Deck Template"
      subheading=""
      disableConfirmButton={selectedChatIds.length === 0 || !titleInput}
    >
      <div>
        <Box mb={5}>
          <Typography mb={1}>Title</Typography>
          <InputText
            label=""
            id="deck-template-title"
            fullWidth
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
        </Box>
        <Box mb={5}>
          <Typography mb={1}>Select chats</Typography>
          <ChatSelectDropdown
            onUpdate={(chatIds) => setSelectedChatIds(chatIds)}
            defaultSelectedChatIds={chatIds}
          />
        </Box>
        <Box mb={5} display="flex" justifyContent="space-between">
          <div>
            <Typography gutterBottom>Set as default deck</Typography>
            <Typography variant="body2" mb={2} maxWidth="80%">
              Default decks are automatically added to new subscriber decks when they join
            </Typography>
          </div>
          <Switch value={isDefault} onChange={(e) => setIsDefaultInput(e.target.checked)} />
        </Box>
      </div>
    </ActionDialog>
  );
}
