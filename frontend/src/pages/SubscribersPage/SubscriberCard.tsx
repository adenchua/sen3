import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import Button from "../../components/Button";
import RegistrantIcon from "../../icons/RegistrantIcon";
import SubscriberInterface from "../../interfaces/subscriber";
import { useNavigate } from "react-router";
import APP_ROUTES from "../../constants/routes";

interface IProps {
  subscriber: SubscriberInterface;
}

export default function SubscriberCard(props: IProps) {
  const { subscriber } = props;
  const { firstName, lastName, registeredDate, username, id } = subscriber;
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
          Application date: {registeredDate}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          onClick={() => navigate(`${APP_ROUTES.subscribersPage.path}/${id}`)}
          color="inherit"
        >
          Manage
        </Button>
      </CardActions>
    </Card>
  );
}
