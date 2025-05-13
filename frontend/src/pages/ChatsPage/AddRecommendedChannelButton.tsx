import Button from "../../components/Button";
import { TelegramChatInterface } from "../../interfaces/chat";

interface IProps {
  channel: TelegramChatInterface;
  isExists: boolean;
  onAddChannel: (chat: TelegramChatInterface) => Promise<void>;
}

export default function AddRecommendedChannelButton(props: IProps) {
  const { channel, isExists, onAddChannel } = props;

  if (isExists) {
    return (
      <Button sx={{ width: "120px" }} disabled>
        Added
      </Button>
    );
  }

  return (
    <Button sx={{ width: "120px" }} onClick={() => onAddChannel(channel)}>
      Add Channel
    </Button>
  );
}
