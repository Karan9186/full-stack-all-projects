import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import UserMessageBar from "./userMessageBar";

const socket = io("http://localhost:4000");

function LeftBar() {
  const navigate = useNavigate();
  const loginUserInfo = localStorage.getItem("user");
  const loginUser = JSON.parse(loginUserInfo);
  const [allUser, setAllUser] = useState([]);
  const [user, setUser] = useState("");
  const [rId, setRId] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastMessages, setLastMessages] = useState({}); // Stores last messages

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Function to fetch all users
  const fetchAllUser = useCallback(async () => {
    try {
      const result = await fetch("http://localhost:4000/getAll", {
        method: "GET",
      });
      const response = await result.json();
      setAllUser(response);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  }, []);

  // Function to fetch the last message for a user
  const fetchLastMessage = async (sender, receiver) => {
    try {
      const response = await fetch("http://localhost:4000/getlastmsg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender, receiver }),
      });
      const data = await response.json();
      return data.msg || "No messages"; // Fallback if no message found
    } catch (error) {
      console.error("Error fetching last message:", error);
      return "Error"; // Fallback for error fetching messages
    }
  };

  // Format text for display
  const formatText = (text, size) => {
    if (text.length > size) {
      return text.slice(0, size) + "...";
    }
    return text;
  };

  // Listen for updates on the list of online users
  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users.map((user) => user.username));
    });

    // Emit "user connected" event when the component mounts
    socket.emit("user connected", loginUser?.user);

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.off("onlineUsers");
    };
  }, [loginUser?.user]);

  // Fetch all users when the component mounts
  useEffect(() => {
    fetchAllUser();
  }, [fetchAllUser]);

  // Fetch the last message for each user after fetching all users
  useEffect(() => {
    const fetchMessages = async () => {
      const messages = {};
      for (const v of allUser) {
        if (v.user !== loginUser?.user) {
          const lastMessage = await fetchLastMessage(loginUser?.id, v.id);
          messages[`${loginUser?.id}-${v.id}`] = lastMessage;
        }
      }
      setLastMessages(messages); // Set all last messages in one batch
    };

    if (allUser.length > 0) {
      fetchMessages();
    }
  }, [allUser, loginUser?.id]);

  // Filter out the logged-in user from the list of all users
  const AlluserData = allUser
    .filter((v) => v.user !== loginUser?.user)
    .map((v, i) => {
      const isOnline = onlineUsers.includes(v.user); // Check if the user is online

      // Retrieve last message from the state
      const lastMessage =
        lastMessages[`${loginUser?.id}-${v.id}`] || "No messages";

      return (
        <div key={i} className="mt-2 flex flex-col mx-2 my-2">
          <button
            onClick={() => {
              setUser(v.user);
              setRId(v.id);
            }}
            className="bg-white mt-2 relative rounded-md flex gap-2 shadow-md shadow-green-100 px-2 py-1"
          >
            <img
              src="https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg?t=st=1734430344~exp=1734433944~hmac=0707115c92007d799e17c204dea028a3de24044351e17a4e13cf9d69cd0ba8bf&w=740"
              alt=""
              className="h-[40px] w-[40px] rounded-[50%] object-cover"
            />
            <div>
              <h1 className="font-semibold text-md capitalize">{v.user}</h1>
              <p className="text-slate-400">{formatText(lastMessage, 30)}</p>
              <p className="absolute right-3 bottom-1 text-slate-400">
                {isOnline ? "online" : "offline"}
              </p>
            </div>
            <div
              className={`absolute top-0 right-0 w-3 h-3 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
          </button>
        </div>
      );
    });

  return (
    <>
      <div className="w-[30%] bg-slate-100 h-[100vh] scrollbar-hide border-r border-green-300">
        <div className="flex items-center justify-between mx-2 px-2 mt-2 rounded shadow-xl border border-red-100 shadow-white py-3 bg-white">
          <button
            onClick={toggleDropdown}
            className="text-white rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            type="button"
          >
            <img
              src="https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg?t=st=1734430344~exp=1734433944~hmac=0707115c92007d799e17c204dea028a3de24044351e17a4e13cf9d69cd0ba8bf&w=740"
              alt=""
              className="h-[40px] w-[40px] rounded-[50%] object-cover"
            />
          </button>
          <h1 className="font-semibold text-md capitalize">
            {loginUser?.user}
          </h1>
          <button
            className="bg-red-500 px-2 py-1 text-white rounded"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
        <div className="relative">
          {isOpen && (
            <div className="z-10 absolute bg-green-50 shadow shadow-slate-400 left-3 top-[-16px] divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Update Profile
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
        {AlluserData}   
      </div>
      <UserMessageBar user={user} receiverId={rId} onlineUser={onlineUsers} />
    </>
  );
}

export default LeftBar;
