import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";

import DATE_FNS_DATE_FORMAT from "../../constants/dateFormat";
import RegistrantIcon from "../../icons/RegistrantIcon";
import SubscriberInterface from "../../interfaces/subscriber";
import { APP_BACKGROUND_COLOR } from "../../constants/styling";
import IconButton from "../../components/IconButton";
import CheckIcon from "../../icons/CheckIcon";

interface IProps {
  registrant: SubscriberInterface;
  onApproveRegistrant: (id: string) => Promise<void>;
}

export default function RegistrantCard(props: IProps) {
  const { registrant, onApproveRegistrant } = props;
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
          borderTop: "2px solid",
          borderColor: APP_BACKGROUND_COLOR,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
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
