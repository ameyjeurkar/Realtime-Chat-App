import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat/Chat';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import './App.css';

const socket = io.connect('http://localhost:4000');

function App() {
  const [username, setUsername] = useState("");
  const [roomID, setRoomID] = useState("");
  const [showChatWindow, setShowChatWindow] = useState(false);

  const joinRoom = (e) => {
    if(username!=="" && roomID!=="") {
      socket.emit("join_room", roomID);
      setShowChatWindow(true);
    }
  }

  return (
    <Grid container className="roomForm">
      {
        !showChatWindow ? 
        (
          <Stack spacing={2} padding={2} className="room">
            <Typography variant="h4">Join Chat</Typography>
            <TextField 
              type="text" 
              label="Username"
              size="medium"
              onChange={(event) => setUsername(event.target.value)}
              onKeyPress={(event) => {
                event.key === "Enter" && joinRoom()
              }}
            />
            <TextField 
              type="text" 
              label="Room ID"
              size="medium"
              onChange={(event) => setRoomID(event.target.value)}
              onKeyPress={(event) => {
                event.key === "Enter" && joinRoom()
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size='medium'
              onClick={joinRoom}
            >
                Join Room
            </Button>
          </Stack>
        )
        :
        (
          <Stack spacing={2} padding={2}>
            <Chat socket={socket} username={username} roomID={roomID}/>
          </Stack>
        )
      }
    </Grid>
  );
}
export default App;