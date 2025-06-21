import CheckedIcon from "@mui/icons-material/CheckBox";
import UncheckedIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import fetchChats from "../api/chats/fetchChats";
import Chip from "./Chip";
import { SECONDARY_BACKGROUND_COLOR } from "../constants/styling";

interface IProps {
  defaultSelectedChatIds?: string[];
  onUpdate: (selectedChatIds: string[]) => void;
}

export default function ChatSelectDropdown(props: IProps) {
  const { onUpdate, defaultSelectedChatIds = [] } = props;
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>(defaultSelectedChatIds);

  const {
    data: availableChats,
    isPending,
    isError,
  } = useQuery({
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

  function handleSelectChat(event: SelectChangeEvent<string[]>) {
    const {
      target: { value },
    } = event;
    const selectedChatIds = typeof value === "string" ? value.split(",") : value;
    setSelectedChatIds(selectedChatIds);
    onUpdate(selectedChatIds); // update parent caller
  }

  const sx = {
    backgroundColor: SECONDARY_BACKGROUND_COLOR, // background of the displayed value box
    borderRadius: "8px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "divider",
    },
    "& .MuiSvgIcon-root": {
      fill: "transparent", // arrow icon color
    },
  };

  if (isPending) {
    return (
      <FormControl fullWidth>
        <Select sx={sx} fullWidth size="small" value="" />
      </FormControl>
    );
  }

  if (isError) {
    return (
      <FormControl fullWidth>
        <Select sx={sx} fullWidth size="small" value="" />
      </FormControl>
    );
  }

  return (
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
        sx={sx}
        multiple
        fullWidth
        size="small"
        value={selectedChatIds}
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
            const isSelected = selectedChatIds.includes(availableChat.id);
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
  );
}
