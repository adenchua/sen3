import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useEffect, useState } from "react";

import addDeckTemplate from "../../api/deck-templates/addDeckTemplate";
import ChatSelectDropdown from "../../components/ChatSelectDropdown";
import ActionDialog from "../../components/dialog/ActionDialog";
import InputText from "../../components/InputText";
import Switch from "../../components/Switch";

interface IProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

export default function CreateDeckTemplateDialog(props: IProps) {
  const { isOpen, onClose } = props;

  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [titleInput, setTitleInput] = useState<string>("");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      startTransition(() => {
        setSelectedChatIds([]);
        setTitleInput("");
        setIsDefault(false);
      });
    }
  }, [isOpen]);

  async function handleConfirm() {
    if (titleInput === "" || selectedChatIds.length === 0) {
      return;
    }

    await addDeckTemplate(titleInput, selectedChatIds, isDefault);
    queryClient.invalidateQueries({ queryKey: ["fetchDeckTemplates"] });
    onClose();
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      heading="Create Deck Template"
      subheading="Deck templates will show up for subscribers when they add new decks"
      disableConfirmButton={selectedChatIds.length === 0 || titleInput === ""}
    >
      <div>
        <Box sx={{ mb: 5 }}>
          <Typography sx={{ mb: 1 }}>Title</Typography>
          <InputText
            label=""
            id="deck-template-title"
            fullWidth
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
        </Box>
        <Box sx={{ mb: 5 }}>
          <Typography sx={{ mb: 1 }}>Select chats</Typography>
          <ChatSelectDropdown onUpdate={(chatIds) => setSelectedChatIds(chatIds)} />
        </Box>
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between" }}>
          <div>
            <Typography gutterBottom>Set as default deck</Typography>
            <Typography variant="body2" sx={{ mb: 2, maxWidth: "80%" }}>
              Default decks are automatically added to new subscriber decks when they join
            </Typography>
          </div>
          <Switch checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
        </Box>
      </div>
    </ActionDialog>
  );
}
