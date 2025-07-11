import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";

import IconButton from "../../components/IconButton";
import DATE_FNS_DATE_FORMAT from "../../constants/dateFormat";
import CheckIcon from "../../icons/CheckIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import RegistrantIcon from "../../icons/RegistrantIcon";
import SubscriberInterface from "../../interfaces/subscriber";

interface IProps {
  registrant: SubscriberInterface;
  onApproveRegistrant: (id: string) => Promise<void>;
  onDeleteRegistrant: (id: string) => Promise<void>;
}

export default function RegistrantCard(props: IProps) {
  const { registrant, onApproveRegistrant, onDeleteRegistrant } = props;
  const { firstName, lastName, registeredDate, username, id } = registrant;

  return (
    <Card
      sx={{
        height: "100%",
        width: "320px",
        display: "flex",
        flexDirection: "column",
      }}
      elevation={0}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid>
            <Avatar>
              <RegistrantIcon />
            </Avatar>
          </Grid>
          <Grid>
            <Typography>
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              @{username} ({id})
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" color="textSecondary">
          Application date: {format(registeredDate, DATE_FNS_DATE_FORMAT)}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          variant="outlined"
          icon={<DeleteIcon />}
          title="Delete registrant"
          onClick={() => onDeleteRegistrant(id)}
        />
        <IconButton
          variant="outlined"
          icon={<CheckIcon />}
          title="Approve registrant"
          onClick={() => onApproveRegistrant(id)}
        />
      </CardActions>
    </Card>
  );
}
