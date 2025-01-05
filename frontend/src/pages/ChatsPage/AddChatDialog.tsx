import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

import fetchTelegramChat from "../../api/fetchTelegramChat";
import InformationDialog from "../../components/dialog/InformationDialog";
import { APP_BACKGROUND_COLOR } from "../../constants/styling";
import SearchIcon from "../../icons/SearchIcon";
import { TelegramChatInterface } from "../../interfaces/chat";
import AddChatCard from "./AddChatCard";
import addChat from "../../api/addChat";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddChatDialog(props: IProps) {
  const { isOpen, onClose } = props;
  const [chat, setChat] = useState<TelegramChatInterface | null | undefined>();
  const searchRef = useRef<TextFieldProps>(null);

  useEffect(() => {
    if (isOpen) {
      setChat(undefined); // set chat to undefined
    }
  }, [isOpen]);

  async function handleSearch() {
    if (!searchRef.current || searchRef.current.value == "") {
      return;
    }

    try {
      const response = await fetchTelegramChat(
        searchRef.current.value as string
      );
      setChat(response);
    } catch {
      setChat(null);
    }
  }

  async function handleAddChat(_chat: TelegramChatInterface) {
    await addChat(_chat);
    onClose();
  }

  return (
    <InformationDialog
      heading="Add Telegram chat"
      subheading="Search for a valid telegram channel/group and add it to the system"
      isOpen={isOpen}
      onClose={onClose}
    >
      <>
        <Grid container alignItems="center" spacing={2}>
          <Grid flexGrow={1}>
            <TextField
              inputRef={searchRef}
              fullWidth
              slotProps={{
                input: {
                  sx: {
                    borderRadius: 50,
                    bgcolor: APP_BACKGROUND_COLOR,
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
              placeholder="Search for a valid telegram chat/channel..."
            />
          </Grid>
          <Grid>
            <IconButton color="primary" onClick={handleSearch} size="large">
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
        {chat && <AddChatCard chat={chat} onAddChat={handleAddChat} />}
        {chat === null && (
          <Typography sx={{ mt: 2 }}>
            This chat may not exist or could be set to private
          </Typography>
        )}
      </>
    </InformationDialog>
  );
}

export default AddChatDialog;
