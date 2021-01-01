import axios from 'axios';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import PowerIcon from "@material-ui/icons/Power";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import VolumeMuteIcon from "@material-ui/icons/VolumeMute";
import AppleIcon from "@material-ui/icons/Apple";
import VideogameAssetIcon from "@material-ui/icons/VideogameAsset";
import GamesIcon from "@material-ui/icons/Games";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";

import {
  Typography
} from '@material-ui/core';

import './App.css';

function App() {
  return (
    <div className="App">
      <div className="Center">
        <Typography variant="h4">Remote Control</Typography>
      </div>
      <List>
        <ListItem>
          <ListItemText />
          <ListItem button onClick={()=> apiRequest('/power/toggle')}>
            <ListItemText primary="Power" secondary="Turn on/off TV" />
            <ListItemAvatar>
              <Avatar>
                <PowerIcon />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemText />
          <ListItem button onClick={()=> apiRequest('/volume/up')}>
            <ListItemText primary="Volume Up" secondary="Raise Volume" />
            <ListItemAvatar>
              <Avatar>
                <VolumeUpIcon />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemText />
          <ListItem button onClick={()=> apiRequest('/volume/down')}>
            <ListItemText primary="Volume Down" secondary="Lower Volume" />
            <ListItemAvatar>
              <Avatar>
                <VolumeDownIcon />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemText />
          <ListItem button onClick={()=> apiRequest('/volume/mute')}>
            <ListItemText primary="Mute" secondary="Mute Volume" />
            <ListItemAvatar>
              <Avatar>
                <VolumeMuteIcon />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemText />
          <ListItem button onClick={()=> apiRequest('/source/media')}>
            <ListItemText
              primary="Apple TV"
              secondary="Change source to Apple TV"
            />
            <ListItemAvatar>
              <Avatar>
                <AppleIcon />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemText />
          <ListItem button onClick={()=> apiRequest('/source/bluray')}>
            <ListItemText
              primary="Playstation 5"
              secondary="Change source to Playstation 5"
            />
            <ListItemAvatar>
              <Avatar>
                <GamesIcon />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemText />
          <ListItem button onClick={()=> apiRequest('/source/aux2')}>
            <ListItemText
              primary="Switch"
              secondary="Change source to Nintendo Switch"
            />
            <ListItemAvatar>
              <Avatar>
                <SportsEsportsIcon />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemText />
          <ListItem button onClick={()=> apiRequest('/source/game')}>
            <ListItemText primary="MiSTer" secondary="Change source to MiSTer" />
            <ListItemAvatar>
              <Avatar>
                <VideogameAssetIcon />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        </ListItem>
        <Divider variant="inset" component="li" />
      </List>
    </div>
  );
}

const apiRequest = (event) => {
  axios.get(event, {
    headers: {
      'x-skip-auth': 'true'
    }
  }).then((response) => {
    console.log(response?.data)
  }).catch((error) => {
    console.error(error)
  })
}

export default App;
