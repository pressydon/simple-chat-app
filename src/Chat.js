import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

function Chat({socket, room, username}) {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]); 

    const sendMessage = async()  =>{
        if(currentMessage !== ''){
            const messageData = {
                key: Math.random()*Math.floor()+10000,
                room:room,
                authour: username,
                message: currentMessage,
                time:
                new Date(Date.now()).getHours() +
                ":" + 
                new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list)=> [...list, messageData]);
            setCurrentMessage('');
        }
    };

    useEffect(()=>{
        socket.on("recieve_message", (data)=>{

            setMessageList((list)=> [...list, data]);
           
        })
    },[socket])

  return (
    <div className='chat-window'>
        <div className='chat-header'>
            <p>Live Chat</p>
        </div>
        <div className='chat-body'>
            <ScrollToBottom className='message-container'>
            {
                messageList.map((messageContent)=>{
                    return <div key={messageContent.key} className='message' id={username === messageContent.authour ? "you" : "other"}>
                            <div>
                                <div className='message-content'>
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className='message-meta'>
                                    <p id='time'>{messageContent.time}</p>
                                    <p id='author'>{messageContent.authour}</p>
                                </div>
                            </div> 
                        </div>
                })
            }
            </ScrollToBottom>
        </div>
        
        <div className='chat-footer'>
            <input 
            type="text" 
            value={currentMessage}
            placeholder='Hey...' 
            onChange={(event=>setCurrentMessage(event.target.value))}
            onKeyPress={event=>{
                event.key === 'Enter' && sendMessage()
            }}/>
            <button onClick={sendMessage}>&#9658;</button>
        </div>
      
    </div>
  )
}

export default Chat
