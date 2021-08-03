import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import "./App.css";
import ToxicityBox from "./toxicityBox";
import ToxicityModel, { Prediction } from "./ToxicityModel";
import Checkbox from "@material-ui/core/Checkbox";

let MODEL: ToxicityModel;
let socket: Socket;
const CONNECTION = "musk-chat-app.herokuapp.com/";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<any[]>([]);
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  useEffect(() => {
    socket = io(CONNECTION);
  }, [CONNECTION]);

  useEffect(() => {
    socket.on("receive_text", async (text) => {
      let result = await MODEL.getSentencePrediction(message);
      text.prediction=result
      setMessageList([...messageList, text]);
    });

  });

  useEffect(() => {
    (async () => {
      try {
        MODEL = new ToxicityModel();
        await MODEL.init();
      } catch (e) {
        console.log(e);
        alert("not loaded model");
      }
    })();
  }, []);

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
  };
  const sendText = async () => {
    let result = await MODEL.getSentencePrediction(message);
    let messageContent: {
      room: string;
      content: { author: string; message: string; prediction: Prediction };
    } = {
      room: room,
      content: {
        author: userName,
        message: message,
        prediction: result,
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
         
          {/* <Checkbox
            value={checked}
            color="primary"
            onChange={handleChange}
            inputProps={{ "aria-label": "secondary checkbox" }}
          /> */}
          <div className="messages">
            {messageList.map((val, key) => {
              return (
                <div
                  className="messageContainer"
                  id={val.author == userName ? "You" : "Other"}
                >
                  <div className="messageIndividual">
                    {val.author}: {val.message}
                    <ToxicityBox predictions={val.prediction} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="messageInputs">
            <input
              type="text"
              placeholder="Enter your text here"
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
