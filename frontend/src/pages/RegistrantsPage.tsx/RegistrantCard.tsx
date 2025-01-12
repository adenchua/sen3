import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import Button from "../../components/Button";
import RegistrantIcon from "../../icons/RegistrantIcon";
import SubscriberInterface from "../../interfaces/subscriber";

interface IProps {
  registrant: SubscriberInterface;
  onApproveRegistrant: (id: string) => Promise<void>;
}

export default function RegistrantCard(props: IProps) {
  const { registrant, onApproveRegistrant } = props;
  const { firstName, lastName, registeredDate, username, id, isApproved } = registrant;
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
        <Button fullWidth disabled={isApproved} onClick={() => onApproveRegistrant(id)}>
          {isApproved ? "Approved" : "Approve Registrant"}
        </Button>
      </CardActions>
    </Card>
  );
}
