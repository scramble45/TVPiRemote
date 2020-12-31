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
          <Button onClick={apiRequest} value={'/power/on'}>Power</Button>
          <Button onClick={apiRequest} value={'/volume/mute'}>Mute</Button>
        </ButtonGroup>
      </div>

      <div className="GroupPadding">
        <ButtonGroup size="large" color="primary" aria-label="remote button group 2">
          <Button onClick={apiRequest} value={'/volume/up'}>Volume Up</Button>
          <Button onClick={apiRequest} value={'/volume/down'}>Volume Down</Button>
        </ButtonGroup>
      </div>

      <div className="GroupPadding">
        <ButtonGroup size="large" color="primary" aria-label="remote button group 3">
          <Button onClick={apiRequest} value={'/source/aux2'}>Aux2</Button>
          <Button onClick={apiRequest} value={'/source/bluray'}>PS5</Button>
        </ButtonGroup>
      </div>

      <div className="GroupPadding">
        <ButtonGroup size="large" color="primary" aria-label="remote button group 4">
          <Button onClick={apiRequest} value={'/source/game'}>Game</Button>
          <Button onClick={apiRequest} value={'/source/media'}>AppleTV</Button>
        </ButtonGroup>
      </div>

    </div>
  );
}

const apiRequest = (event) => {
  axios.get(event.target.value, {
    auth: {
      username: 'admin',
      password: 'password'
    }
  }).then((response) => {
    console.log(response.data)
  })
}

export default App;
