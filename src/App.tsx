import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import "./App.css";

let socket: Socket;
const CONNECTION = "musk-chat-app.herokuapp.com/";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<any[]>([]);

  useEffect(() => {
    socket = io(CONNECTION);
  }, [CONNECTION]);

  useEffect(() => {
    socket.on("receive_text", (text) => {
      setMessageList([...messageList, text]);
    });
  });
  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
  };
  const sendText = async () => {
    let messageContent: {
      room : string;
      content: { author: string; message: string };
    } = {
      room: room,
      content: {
        author: userName,
        message: message,
      },
    };
    await socket.emit("send_text", messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage("");
  };
  return (
    <div className="App">
      {!loggedIn ? (
        <div className="logIn">
          <div className="inputs">
            <input
              type="text"
              placeholder="Name..."
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <input
              type="number"
              placeholder="Room..."
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
          </div>
          <button onClick={connectToRoom}>Enter Chat</button>
        </div>
      ) : (
        <div className="chatContainer">
          <div className="messages">
            {messageList.map((val, key) => {
              return (
                <div
                  className="messageContainer"
                  id={val.author == userName ? "You" : "Other"}
                >
                  <div className="messageIndividual">
                    {val.author}: {val.message}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="messageInputs">
            <input
              type="text"
              placeholder="Message..."
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button onClick={sendText}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
