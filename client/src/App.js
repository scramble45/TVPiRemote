import axios from 'axios';

import {
  Button,
  ButtonGroup,
  Typography
} from '@material-ui/core';

import './App.css';

function App() {
  return (
    <div className="App">
      <Typography variant="h4">Remote Control</Typography>
      <div className="GroupPadding">
        <ButtonGroup size="large" color="primary" aria-label="remote button group 1">
          <Button onClick={()=> apiRequest('/power/toggle')}>Power</Button>
          <Button onClick={()=> apiRequest('/volume/mute')}>Mute</Button>
        </ButtonGroup>
      </div>

      <div className="GroupPadding">
        <ButtonGroup size="large" color="primary" aria-label="remote button group 2">
          <Button onClick={()=> apiRequest('/volume/up')}>Volume Up</Button>
          <Button onClick={()=> apiRequest('/volume/down')}>Volume Down</Button>
        </ButtonGroup>
      </div>

      <div className="GroupPadding">
        <ButtonGroup size="large" color="primary" aria-label="remote button group 3">
          <Button onClick={()=> apiRequest('/source/aux2')}>Switch</Button>
          <Button onClick={()=> apiRequest('/source/bluray')}>PS5</Button>
        </ButtonGroup>
      </div>

      <div className="GroupPadding">
        <ButtonGroup size="large" color="primary" aria-label="remote button group 4">
          <Button onClick={()=> apiRequest('/source/game')}>MiSTer</Button>
          <Button onClick={()=> apiRequest('/source/media')}>AppleTV</Button>
        </ButtonGroup>
      </div>

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
