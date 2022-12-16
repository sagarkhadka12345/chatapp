import React, { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import axios from "axios";
import { conversation, messages } from "../types/conversations";
import { Link } from "react-router-dom";
import { socketApi } from "./api/api";

interface message {
  sender: string;
  receiver: string;
  text: string;
}
interface friend {
  friend: string;
  conversationId: string;
}
interface User {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  username: string;
  address: string;
  friends: Array<friend> | [];
}

const Chat: React.FC = (): JSX.Element => {
  const [friends, setFriends] = useState<string[]>();
  const [friend, setFriend] = useState<string>("");
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userName, setUserName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [conversations, setConversations] = useState<message>({
    sender: userName,
    receiver: friend,
    text: message,
  });
  const [conversationId, setConversationId] = useState("");
  const [receivedMessage, setReceivedMessage] = useState<any[]>([]);
  const [socketMessage, setSocketMessage] = useState<any[]>([]);

  const newFriend = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(e.target);

    setFriend((e.target as HTMLDivElement).innerText);
  };

  const socket = useSocket(socketApi, {
    reconnectionAttempts: 10,
    reconnectionDelay: 0,
    autoConnect: true,
    auth: {
      token: localStorage.getItem("token"),
    },
  });

  useEffect(() => {
    axios
      .get(`/api/user/find`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setUser(res.data);
        setUserName((res.data as User).username);
        setFriends((res.data as User).friends.map((user) => user.friend));

        axios({
          method: "POST",
          url: "/api/message/findByBoth",
          data: {
            receiver: friend,
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
          .then((res) => {
            setReceivedMessage(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log("Please login or create User");
        setUser(undefined);
      });
  }, [friend]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    setConversations((conversations) => ({
      sender: userName,
      receiver: friend,
      text: message,
    }));
  };
  useEffect(() => {
    socket.connect();
    socket.on("receive-message", (message) => {
      console.log(message);
    });

    user &&
      friend !== undefined &&
      socket.emit("user_id", user.username, user.username, friend);

    return () => {
      socket.close();
    };
  }, [user, friend, friends, socket]);
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  socket?.on("received-message", (message: string, sender) =>
    setReceivedMessage([...receivedMessage, { text: message, sender }])
  );

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    socket.emit("send-message", message, user, friend);
  };

  const join = () => {
    user && socket.emit("user_id", user.username, user.username, friend);
  };

  return (
    <>
      <div className="flex justify-between items-center w-96 mb-12 mr-12 ml-12">
        {user?.firstname}
        {user === undefined && (
          <button>
            <Link to="/register" className="to-blue-500">
              Register
            </Link>
          </button>
        )}
        {user === undefined && (
          <button>
            <Link to="/login" className="to-blue-500">
              Login
            </Link>
          </button>
        )}
        <button>
          <Link to="/addFriend">Add Friend</Link>
        </button>
        {user !== undefined && <button onClick={logout}>Log out</button>}
      </div>
      <div className="flex">
        <div className="bg-gray-400">{user?.username}</div>
        <div className="border border-indigo-200">
          {friends?.map((res) => (
            <div
              onClick={(e) => newFriend(e)}
              className="cursor-pointer w-16 h-16 "
            >
              {res}
            </div>
          ))}
        </div>
        <div className="border-2 border-purple-200 p-4 w-[30rem] h-[30rem]">
          <div className=" bg-gray-200 h-[80%] overflow-scroll">
            <div className="flex flex-col-reverse">
              {receivedMessage.map((res: messages) => (
                <>
                  {res.sender === user?.username && res.receiver === friend && (
                    <div className="text-left rounded-sm bg-blue-200 w-max px-4 my-2">
                      {res.text}
                    </div>
                  )}
                  {res.sender === friend && res.receiver === user?.username && (
                    <div className="text-right mr-0 rounded-sm bg-gray-400 w-max px-4 my-2 ">
                      {res.text}
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
          <div className="flex mt-4">
            <button onClick={join}>JOIN</button>
            <input
              type="text"
              className="w-[80%] h-12 mr-2 border-2 border-green-300 hover:border-orange-200 px-2"
              onChange={(e) => handleChange(e)}
            />
            <button
              className="border bg-green-200 px-4 py-2"
              onClick={(event) => handleClick(event)}
            >
              {" "}
              Send{" "}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
