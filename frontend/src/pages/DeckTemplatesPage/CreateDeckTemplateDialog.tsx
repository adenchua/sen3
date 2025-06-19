import Box from "@mui/material/Box";
import { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

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

  const titleInputRef = useRef<TextFieldProps>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    // when dialog is open, reset form
    if (isOpen) {
      setSelectedChatIds([]);
      titleInputRef.current = null;
      setIsDefault(false);
    }
  }, [isOpen]);

  async function handleConfirm() {
    if (
      !titleInputRef.current ||
      titleInputRef.current.value === "" ||
      selectedChatIds.length === 0
    ) {
      return;
    }
    const title = titleInputRef.current.value as string;

    await addDeckTemplate(title, selectedChatIds, isDefault);
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
      disableConfirmButton={selectedChatIds.length === 0 || !titleInputRef.current}
    >
      <div>
        <Box mb={5}>
          <Typography mb={1}>Title</Typography>
          <InputText label="" id="deck-template-title" fullWidth inputRef={titleInputRef} />
        </Box>
        <Box mb={5}>
          <Typography mb={1}>Select chats</Typography>
          <ChatSelectDropdown onUpdate={(chatIds) => setSelectedChatIds(chatIds)} />
        </Box>
        <Box mb={5} display="flex" justifyContent="space-between">
          <div>
            <Typography gutterBottom>Set as default deck</Typography>
            <Typography variant="body2" mb={2} maxWidth="80%">
              Default decks are automatically added to new subscriber decks when they join
            </Typography>
          </div>
          <Switch checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
        </Box>
      </div>
    </ActionDialog>
  );
}
