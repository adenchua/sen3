import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useMemo, useState } from "react";

import Chip from "../../components/Chip";
import ActionDialog from "../../components/dialog/ActionDialog";
import ChatInterface from "../../interfaces/chat";

interface IProps {
  isOpen: boolean;
  onClose: VoidFunction;
  selectedChatIds: string[];
  onSelectChats: (newSelectedChatIds: string[]) => void;
  availableChats: ChatInterface[];
}

export default function ChatSelectionDialog(props: IProps) {
  const { isOpen, onClose, selectedChatIds, onSelectChats, availableChats } = props;
  const [finalizedSelectedChatIds, setFinalizedSelectedChatIds] =
    useState<string[]>(selectedChatIds);

  // cleanup
  useEffect(() => {
    if (isOpen) {
      setFinalizedSelectedChatIds(selectedChatIds);
    }
  }, [isOpen, selectedChatIds]);

  // helper constant for dropdown to map id to chat username
  const chatIdToUsernameMap = useMemo(() => {
    const result: Record<string, string> = {};
    availableChats?.forEach(
      (availableChat) => (result[availableChat.id] = `@${availableChat.username}`),
    );
    return result;
  }, [availableChats]);

  function handleSelectChat(event: SelectChangeEvent<typeof finalizedSelectedChatIds>) {
    const {
      target: { value },
    } = event;
    setFinalizedSelectedChatIds(typeof value === "string" ? value.split(",") : value);
  }

  function handleConfirm() {
    onSelectChats(finalizedSelectedChatIds);
    onClose();
  }

  return (
    <ActionDialog
      heading="Select chats to monitor"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      subheading="Messages from these channels/groups will be used to match with the provided keywords and sent as notifications"
    >
      <>
        {availableChats && (
          <FormControl fullWidth>
            <InputLabel>Chats</InputLabel>
            <Select
              multiple
              fullWidth
              value={finalizedSelectedChatIds}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={chatIdToUsernameMap[value]} />
                  ))}
                </Box>
              )}
              onChange={handleSelectChat}
            >
              {availableChats.map((availableChat) => {
                return (
                  <MenuItem key={availableChat.id} value={availableChat.id}>
                    {availableChat.username}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </>
    </ActionDialog>
  );
}
