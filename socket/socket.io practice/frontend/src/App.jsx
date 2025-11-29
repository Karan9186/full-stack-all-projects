import React, { useState, useEffect, useRef } from "react";
import socket from "socket.io-client";

const App = () => {
  const [connect, setConnect] = useState(false);
  const [messages, setMessages] = useState([]); // To store and display messages
  const message = useRef(""); // Ref for message input
  const client = socket("http://localhost:3000");

  // Handle sending a message
  const handleSendMessage = () => {
    const currMessage = message.current.value;
    if (currMessage.trim() !== "") {
      client.emit("message", currMessage); // Send message to the server
      message.current.value = ""; // Clear input field
    }
  };

  // Set up a listener for new messages from the server
  useEffect(() => {
    client.on("newMessage", (msg) => {
      console.log("Received new message:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]); // Add new message to state
    });

    // Cleanup the event listener when component unmounts
    return () => {
      client.off("newMessage");
    };
  }, [client]); // The useEffect runs only once when the component mounts

  return (
    <div>
      <h1>Click here to connect</h1>
      <button onClick={() => setConnect(true)}>Connect User</button>
      {connect && (
        <>
          <div>
            <input type="text" ref={message} />
            <button onClick={handleSendMessage}>Send</button>
          </div>
          <div>
            <h1>Your Messages</h1>
            <div>
              {messages.map((msg, index) => (
                <p key={index}>{msg}</p> // Render all messages received
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
