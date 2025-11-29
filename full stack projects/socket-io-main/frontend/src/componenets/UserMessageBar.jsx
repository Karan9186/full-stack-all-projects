import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaFileImage } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function UserMessageBar({ user, receiverId, onlineUser }) {
  const [message, setMessage] = useState("");
  // console.log("receriver=", user);
  // const receriverUser = user;
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [readMessages, setReadMessages] = useState(new Set()); // Track read messages
  const [showFileDia, setShowFileDia] = useState();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typeerId, setTyperId] = useState(null);
  const messagesContainerRef = useRef(null);
  const handleIconClick = () => {
    fileInputRef.current.click();
  };
  // Fetch logged-in user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setLoggedInUser(JSON.parse(userData));
    }
  }, []);

  // Send a message via socket
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: loggedInUser.id,
        name: loggedInUser ? loggedInUser.user : "Anonymous",
        receiverId: receiverId,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        msg: message,
        status: "sent", // Initially set status as 'sent'
      };

      // Add the message to the state immediately (for the sender)
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Emit the message to the server
      socket.emit("chat message", newMessage);
      scrollToBottom();
      setIsTyping(false); // Reset typing status

      socket.emit("typing", {
        senderId: loggedInUser.id,
        receiverId,
        typing: false,
      }); // Notify receiver that typing has stopped

      // Clear the message input field
      setMessage("");
    }
  };

  // Fetch message history between the user and the receiver
  const fetchMessagesHistory = useCallback(async () => {
    if (!loggedInUser || !receiverId) return; // Ensure we have user and receiver

    const ids = {
      senderid: loggedInUser.id,
      receiverId: receiverId,
    };

    try {
      const response = await fetch("http://localhost:4000/getmsg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ids),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setMessages(result);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [loggedInUser, receiverId]);

  // Scroll to the bottom of the messages when new messages are added
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  // Auto-mark message as "read" when it enters the view (only once)
  const markMessageAsRead = (messageId) => {
    // Only mark as "read" if it hasn't been read before
    if (!readMessages.has(messageId)) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, status: "read" } : msg
        )
      );
      setReadMessages((prev) => new Set(prev.add(messageId))); // Mark as read in the set
      socket.emit("message read", { messageId, receiverId });
    }
  };

  useEffect(() => {
    // Fetch message history only when loggedInUser or receiverId changes
    fetchMessagesHistory();
  }, [loggedInUser, receiverId, fetchMessagesHistory, messages]);

  // Listen for incoming chat messages from the server
  useEffect(() => {
    const handleNewMessage = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    socket.on("chat message", handleNewMessage);

    return () => {
      socket.off("chat message", handleNewMessage);
    };
  }, [loggedInUser, message, messages]);

  // Automatically mark message as read when it becomes visible in the chat container
  useEffect(() => {
    if (messagesContainerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const messageId = entry.target.id; // Message id
              if (messageId) {
                if (user && onlineUser.includes(user))
                  markMessageAsRead(messageId);
              }
            }
          });
        },
        {
          threshold: 1.0, // Trigger when 100% of the element is visible
        }
      );

      const messageElements =
        messagesContainerRef.current.querySelectorAll(".message");

      if (messageElements) {
        messageElements.forEach((messageElement) =>
          observer.observe(messageElement)
        );
      }

      return () => {
        if (messageElements) {
          messageElements.forEach((messageElement) =>
            observer.unobserve(messageElement)
          );
        }
      };
    }
  }, [messages, message, markMessageAsRead]);
  const handleTyping = () => {
    console.log(loggedInUser.id, receiverId);

    socket.emit("typing", {
      senderId: loggedInUser.id,
      receiverId: receiverId,
      typing: true,
    });
    setIsTyping(true);
  };

  // Optionally, you can emit 'typing: false' when the sender stops typing
  // const handleStopTyping = () => {
  //   if (isTyping) {
  //     setIsTyping(false);
  //     socket.emit("typing", {
  //       senderId: loggedInUser.id, // Sender's ID
  //       receiverId: receiverId, // Receiver's ID
  //       typing: false, // Typing status (false)
  //     });
  //   }
  // };

  useEffect(() => {
    socket.on("typing", (data) => {
      {
        console.log("the data=", data);
      }
      if (data.senderId != loggedInUser.id) {
        setTyperId(data.senderId);
        setIsTyping(false); // Show typing indicator for the receiver
      } else {
        // setTyperId(data.senderId);
        setIsTyping(true);
      }
    });

    return () => {
      socket.off("typing");
    };
  }, [message, messages]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setShowFileDia(true);
    if (file) {
      setSelectedFile(file);

      // If the file is an image, generate a preview URL
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result); // Set the preview URL once the file is loaded
        };
        reader.readAsDataURL(file); // Read the file as a data URL
      }
    }
  };

  // Handle file upload (you can replace this with your actual upload logic)
  const handleFileUpload = async (e) => {
    e.preventDefault();

    // Check if a file is selected
    if (selectedFile) {
      // Create a FormData object to send the file in the request body
      const formData = new FormData();
      formData.append("file", selectedFile);

      // You can also append other data (like sender, receiver, etc.) to the FormData if needed
      formData.append("sender", loggedInUser.id);
      formData.append("receiver", receiverId);
      formData.append("isRead", "0");

      try {
        // Make a POST request to your file upload API
        const response = await fetch("http://localhost:4000/sendfile", {
          method: "POST",
          body: formData, // FormData automatically sets the correct Content-Type header
        });

        // Handle the response from the server
        if (!response.ok) {
          throw new Error("File upload failed");
        }

        const result = await response.json();
        // alert("File uploaded successfully!");
        setShowFileDia(false);
        console.log("Upload response:", result);

        // Optional: You can reset the file preview after successful upload
        setSelectedFile("");
        setPreviewUrl("");
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("File upload failed. Please try again.");
        setShowFileDia(!showFileDia);
      }
    } else {
      alert("No file selected!");
    }
  };
  const handleChange = (e) => {
    setMessage(e.target.value);
    handleTyping(); // Emit typing event when the user types
  };

  useEffect(() => {
    // Scroll to the bottom when messages change
    scrollToBottom();
  }, [messages, message]);

  return (
    <div className="mx-3 bg-slate-100 px-2 py-2 w-full mt-2 mb-2">
      {user === "" ? (
        "No user selected"
      ) : (
        <>
          <div className="mt-2 bg-white rounded px-2 flex gap-3 items-center py-2">
            <img
              src="https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg?t=st=1734430344~exp=1734433944~hmac=0707115c92007d799e17c204dea028a3de24044351e17a4e13cf9d69cd0ba8bf&w=740"
              alt="user avatar"
              className="h-[40px] w-[40px] rounded-[50%] object-cover"
            />
            <div>
              <h1 className="capitalize font-semibold">{user}</h1>

              {isTyping && typeerId != loggedInUser.id ? (
                <p>Someone is typing...</p>
              ) : (
                ""
              )}

              <p
                className={`mx-3 ${
                  isOnline ? "text-green-400" : "text-gray-400"
                }`}
              >
                {/* Display online status */}
              </p>
            </div>
          </div>

          <div
            className="h-[76vh] px-2 py-2 bg-white mt-1 overflow-y-auto"
            ref={messagesContainerRef}
          >
            <div className="h-[93%] flex flex-col">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    id={msg.id} // Set id for each message
                    className={`message my-2 ${
                      msg.sender === loggedInUser.id
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded ${
                        msg.sender === loggedInUser.id
                          ? "bg-blue-400 text-white float-right"
                          : "bg-gray-200 text-black float-left"
                      }`}
                    >
                      <strong>
                        {msg.sender === loggedInUser.id ? "You" : user}:
                      </strong>{" "}
                      {msg.msg}
                      {/* Display read tick mark if the message is read and sent by the logged-in user */}
                      {msg.isread === "read" &&
                      msg.sender === loggedInUser.id ? (
                        <span className="text-white-500">✓</span>
                      ) : (
                        ""
                      )}
                      {/* Check if the message contains a file */}
                      {msg.file && (
                        <div className="mt-2">
                          {/* If the file is an image, display an image preview */}
                          {msg.file ? (
                            <img
                              src={`http://localhost:4000/${msg.file}`}
                              alt="file"
                              className="max-w-[150px] max-h-[150px] rounded-lg"
                            />
                          ) : (
                            // Otherwise, display a download link for the file
                            <a
                              href={`http://localhost:4000/${msg.file}`}
                              download
                              className="text-blue-500 hover:underline"
                            >
                              Download {msg.file}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3 relative">
            <input
              type="text"
              className="w-full  focus:outline-none  border-b-2"
              value={message}
              onChange={handleChange}
            />
            <div className="flex ">
              <div className="flex items-center bg-green-400 text-white px-4 mx-4 py-2">
                <input
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef} // Set ref for file input
                  className="hidden" // Hide the file inpu
                />

                <FaFileImage
                  onClick={handleIconClick}
                  className="cursor-pointer"
                />
              </div>

              {/* file dialog box */}
              <form onSubmit={handleFileUpload} className="">
                <div
                  className={`${
                    showFileDia ? "visible" : "hidden"
                  } absolute bottom-[10px] left-[10px]   bg-white h-[250px] w-[250px] rounded shadow-xl border border-slate-100 shadow-slate-200`}
                >
                  <div className="absolute bottom-2 left-3">
                    {/* File Input */}

                    {/* File Preview (only if there's a previewUrl) */}
                    {showFileDia && (
                      <div className="mt-2">
                        <h2>Preview:</h2>
                        <img
                          src={previewUrl}
                          alt="File preview"
                          className="h-[220px] w-[220px] object-cover border border-slate-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </form>

              <button
                className="bg-green-400 text-white px-4 mx-4 py-2"
                onClick={previewUrl ? handleFileUpload : sendMessage}
              >
                <IoMdSend />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserMessageBar;
