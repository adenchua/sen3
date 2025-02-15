import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import { useNavigate } from "react-router";

import Button from "../../components/Button";
import Switch from "../../components/Switch";
import APP_ROUTES from "../../constants/routes";
import { APP_BACKGROUND_COLOR } from "../../constants/styling";
import RegistrantIcon from "../../icons/RegistrantIcon";
import SubscriberInterface from "../../interfaces/subscriber";
import DATE_FNS_DATE_FORMAT from "../../constants/dateFormat";

interface IProps {
  subscriber: SubscriberInterface;
}

export default function SubscriberCard(props: IProps) {
  const { subscriber } = props;
  const { firstName, lastName, registeredDate, username, id, allowNotifications } = subscriber;
  const navigate = useNavigate();

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
            <Avatar variant="rounded">
              <RegistrantIcon />
            </Avatar>
          </Grid>
          <Grid>
            <Typography>
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              @{username}
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" color="textSecondary">
          Joined {format(registeredDate, DATE_FNS_DATE_FORMAT)}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          borderTop: "2px solid",
          borderColor: APP_BACKGROUND_COLOR,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={() => navigate(`${APP_ROUTES.subscribersPage.path}/${id}`)}
          color="inherit"
        >
          Manage deck
        </Button>
        <Switch checked={allowNotifications} />
      </CardActions>
    </Card>
  );
}
