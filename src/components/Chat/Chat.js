import React, {useState, useEffect} from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SendIcon from '@mui/icons-material/Send';
import './Chat.css';

const Chat = ({socket, username, roomID}) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((prevMessages) => [...prevMessages, data]);
        })
    }, [socket])

    const sendMessage = async () => {
        if(currentMessage!=="") {
            const messageData = {
                roomID: roomID,
                username: username,
                message: currentMessage,
                time: getTime(new Date()),
                // time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            await socket.emit("send_message", messageData);
            setMessageList((prevMessages) => [...prevMessages, messageData]);
            setCurrentMessage("");
        }
    }

    const getTime = (time) => {
        let getHours = time.getHours();
        let getMinutes = time.getMinutes();
        let getAMPM = "AM";
        if(getHours>12) {
            getHours = parseInt(getHours) - 12;
            getAMPM = "PM";
        }
        if(getMinutes<10) {
            getMinutes = "0" + getMinutes;
        }
        return getHours + ":" + getMinutes + " " + getAMPM;
    }

    return (
        <Box
            sx={{
                width: '90vw',
                backgroundColor: 'rgb(67, 67, 67)',
                overflow: 'auto'
            }}
        >
            <Stack>
                <Typography variant="button" color="white" style={{ backgroundColor: 'black', display: 'flex', justifyContent: 'start', paddingLeft: '2%', fontWeight: 'bold', overflowX: 'hidden'}}>Live Chat</Typography>
                <div className='chat-body'>
                    <ScrollToBottom className='message-container'>
                        {
                            messageList.map(message => {
                                return (
                                    <Grid container key={message} className='message' id={username===message.username ? "alignMessageRight" : "alignMessageLeft"}>
                                        <Grid item xs={8} id={username===message.username ? "you" : "otherUser"}>
                                            <div className='message-content'>
                                                <Typography variant="body2" style={{lineBreak: 'anywhere'}}>{message.message}</Typography>
                                            </div>
                                            <div className='message-meta'>
                                                <Typography variant="caption">{message.time}</Typography>&nbsp;&nbsp;
                                                <Typography variant="caption" style={{fontWeight: 'bold'}}>{message.username}</Typography>
                                            </div>
                                        </Grid>
                                    </Grid>
                                )
                            })
                        }
                    </ScrollToBottom>
                </div>
                <div className='chat-footer'>
                    <Grid container>
                        <Grid item xs={11}>
                            <Input
                                placeholder='Send Message...'
                                value={currentMessage}
                                className="message-input"
                                onChange={(event) => {
                                    setCurrentMessage(event.target.value)
                                }}
                                onKeyPress={(event) => {
                                    event.key==="Enter" && sendMessage();
                                }}
                                style={{display: "flex"}}
                            />
                        </Grid>
                        <Grid item xs={1} className='centerAligned'>
                            <SendIcon
                                onClick={sendMessage}
                                fontSize="medium"
                                className="buttonColor"
                            >
                            </SendIcon>
                        </Grid>
                    </Grid>
                </div>
            </Stack>
        </Box>
    )
}
export default Chat;