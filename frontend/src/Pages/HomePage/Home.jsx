import React, { useEffect, useMemo, useRef, useState } from "react";
import ProtectedRoute from "../../Components/ProtectedRoute";
import { FaAngleLeft, FaArrowLeft, FaBell, FaDoorOpen, FaSearch } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import {
  checkPropExist,
  normalizeTime,
  SOCKET_URL,
  URL_PREFIX,
} from "../../Helper/Helper";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Home.css";
import io from "socket.io-client";

const Home = () => {
  //States
  const newSocket = useMemo(() => io(SOCKET_URL), []);
  const { user, isAuth } = JSON.parse(localStorage.getItem("auth")) || {
    isAuth: false,
    user: null,
  };
  const [loader, setLoader] = useState(false);
  const [mainLoader, setMainLoader] = useState(false);
  const [val, setVal] = useState(0);
  const recievers = useRef([]);
  const [users, setUsers] = useState("");
  const [conversation, setConversation] = useState("");
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const chatContainer = useRef(null);
  const currRecieverIdRef = useRef(null);
  const [notifyMsg, setNotifyMsg] = useState([]);
  const [currRevConversationId, setCurrRevConversationId] = useState("");

  //Methods
  const handleLogout = () => {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        isAuth: false,
        user: null,
      })
    );
    toast.success("Logout Successfully.");
    navigate("/login");
  };
  const getData = async (loadingFunction = setMainLoader) => {
    loadingFunction(true);
    try {
      const res1 = await axios.get(`${URL_PREFIX}/conversation/${user?.id}`);
      recievers.current = res1.data.data;
      const res2 = await axios.get(`${URL_PREFIX}/users`);
      setUsers(res2.data?.data.filter((x) => x.id !== user?.id));
    } catch (err) {
      console.log(err);
    }
    loadingFunction(false);
  };

  const sendMessage = async () => {
    //sending message to backend
    newSocket.emit("send_message", {
      text,
      reciever: conversation.reciever?.id,
      sender: user?.id,
      senderData: user,
      revConversationId: currRevConversationId,
      conversationId: conversation.id,
    });

    setMessages((prev) => [
      ...prev,
      {
        text,
        time: Date.now(),
        type: "sent",
      },
    ]);
    setText("");
    let conversationId = conversation.id;
    try {
      // if (conversation.id === -1) {
      //   const res = await axios.post(`${URL_PREFIX}/conversation/create/new`, {
      //     senderId: user?.id,
      //     recieverId: conversation.reciever?.id,
      //   });
      //   const convo = res.data.data;
      //   conversationId = convo.id;
      //   setConversation({
      //     ...conversation,
      //     id: convo.id,
      //   });
      //   await getData();
      //   setVal(0);
      //   setSearch("");
      //   await axios.post(`${URL_PREFIX}/conversation/create/new`, {
      //     recieverId: user?.id,
      //     senderId: conversation.reciever?.id,
      //   });
      // }
      if (val === 1) {
        await getData();
        setVal(0);
        setSearch("");
      }
      await axios.post(`${URL_PREFIX}/message/send`, {
        text,
        conversationId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleConversation = async (conversationId, reciever, revId) => {
    console.log(conversationId, reciever, revId);
    currRecieverIdRef.current = reciever.id;
    setNotifyMsg((prev) => {
      const arr = prev;
      return arr.filter((x) => x.id !== reciever.id);
    });
    setCurrRevConversationId(revId);
    try {
      if (conversationId > 0) {
        const res = await axios.get(
          `${URL_PREFIX}/message/get/${conversationId}`
        );
        console.log(res);
        setConversation({
          id: conversationId,
          reciever,
          messages: res.data.data,
        });
        setMessages(res.data.data);
      } else {
        setConversation({
          id: conversationId,
          reciever,
          messages: [],
        });
        setMessages([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkConversation = async (recieverId) => {
    try {
      const res = await axios.post(`${URL_PREFIX}/conversation/check`, {
        senderId: user?.id,
        recieverId,
      });
      const val = await axios.post(`${URL_PREFIX}/conversation/check`, {
        senderId: recieverId,
        recieverId: user?.id,
      });
      let convo = res.data?.data;
      let revConvo = val.data?.data;
      if (convo.id === -1 && val.data?.data?.id === -1) {
        const res1 = await axios.post(`${URL_PREFIX}/conversation/create/new`, {
          senderId: user?.id,
          recieverId,
        });
        convo = res1.data?.data;
        const res2 = await axios.post(`${URL_PREFIX}/conversation/create/new`, {
          senderId: recieverId,
          recieverId: user?.id,
        });
        revConvo = res2.data?.data;
      }
      await handleConversation(convo.id, convo.reciever, revConvo.id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let timeout = null;
    if (search) {
      timeout = setTimeout(async () => {
        setLoader(true);
        try {
          const res = await axios.get(
            `${URL_PREFIX}/users/search?query=${search}`
          );
          setUsers(res.data?.data?.filter((x) => x.id !== user?.id));
          setLoader(false);
        } catch (err) {
          console.log(err);
        }
      }, 500);
    } else getData(setLoader);
    return () => clearTimeout(timeout);
  }, [search]);

  //socket.io-client connections
  useEffect(() => {
    //sending user id to backend
    newSocket.emit("user_online", user?.id);

    //got online users from backend
    newSocket.on("update_online_users", (users) => {
      setOnlineUsers(users);
    });

    //got message from user's backend
    newSocket.on(
      "recieve_message",
      ({
        text,
        sender,
        reciever,
        senderData,
        conversationId,
        revConversationId,
      }) => {
        if (sender === currRecieverIdRef.current)
          setMessages((prev) => {
            const arr = [
              ...prev,
              {
                text,
                time: Date.now(),
                type: "recieved",
              },
            ];
            return arr;
          });
        else {
          console.log(recievers);
          const exist = recievers.current?.some(
            (x) => x.reciever.id === sender
          );
          if (!exist) {
            const old = recievers.current;
            recievers.current = [
              ...old,
              {
                reciever: senderData,
                revConversationId: conversationId,
                id: revConversationId,
              },
            ];
          }
          setNotifyMsg((prev) => {
            const arr = prev;
            const val = [];
            let flag = false;
            for (let x of arr) {
              if (x.id === sender) {
                val.push({ id: x.id, count: x.count + 1 });
                flag = true;
              }
            }
            if (!flag) val.push({ id: sender, count: 1 });
            return val;
          });
        }
      }
    );

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (chatContainer) chatContainer.current?.scrollIntoView();
  }, [messages]);

  if (mainLoader)
    return <Loader size={50} fullHeight={true} fullWidth={true} />;
  return (
    <ProtectedRoute>
      <div id="Home" className={conversation ? "active" : ""}>
        <div className="left">
          <header>
            <div className="user">
              <img src={user?.profile} alt="" />
              <div className="content">
                <h3>{user?.name}</h3>
                <h5>{user?.email}</h5>
              </div>
            </div>
            {window.innerWidth < 999 ? (
              <button onClick={handleLogout}>
                <FaDoorOpen />
                Logout
              </button>
            ) : null}
          </header>
          <div className="chats">
            <div className="search">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search"
              />
              <FaSearch />
            </div>
            {search ? null : (
              <div className="btns">
                <button
                  className={val === 0 ? "active" : ""}
                  onClick={() => setVal(0)}
                >
                  Chats
                </button>
                <button
                  className={val === 1 ? "active" : ""}
                  onClick={() => setVal(1)}
                >
                  All Users
                </button>
              </div>
            )}
            {loader ? (
              <Loader size={50} fullWidth={true} />
            ) : (
              <div className="users">
                {val === 0 && !search ? (
                  recievers.current.length > 0 ? (
                    recievers.current.map(
                      ({ reciever, id, revConversationId }, idx) => {
                        const flag = checkPropExist(
                          notifyMsg,
                          "id",
                          reciever.id
                        );
                        return (
                          <div
                            onClick={() =>
                              handleConversation(
                                id,
                                reciever,
                                revConversationId
                              )
                            }
                            className={`user ${
                              conversation.id === id ? "active" : ""
                            }`}
                            key={idx}
                          >
                            <div className="block">
                              <img src={reciever.profile} alt="" />
                              <div className="content">
                                <h3>{reciever.name}</h3>
                                <h5>{reciever.email}</h5>
                              </div>
                            </div>
                            {onlineUsers.includes(String(reciever.id)) ? (
                              <div className="circle"></div>
                            ) : null}
                            {flag ? (
                              <div className="notify">
                                <h3>
                                  {
                                    notifyMsg.find((x) => x.id === reciever.id)
                                      ?.count
                                  }
                                </h3>
                              </div>
                            ) : null}
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div id="content">
                      <h3>No Conversations</h3>
                      <p>Press On users to start conversation</p>
                    </div>
                  )
                ) : users.length > 0 ? (
                  users.map((user, idx) => (
                    <div
                      onClick={() => checkConversation(user.id)}
                      className="user"
                      key={idx}
                    >
                      <div className="block">
                        <img src={user.profile} alt="" />
                        <div className="content">
                          <h3>{user.name}</h3>
                          <h5>{user.email}</h5>
                        </div>
                      </div>
                      {onlineUsers.includes(String(user.id)) ? (
                        <div className="circle"></div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div id="content">
                    <h3>No Other Users</h3>
                    <p>Wait for other users to join the app.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="right">
          {conversation ? (
            <>
              <header>
                {window.innerWidth < 999 ? (
                  <div className="back" onClick={() => setConversation("")}>
                    <FaAngleLeft />
                  </div>
                ) : null}
                <div className="reciever">
                  <img src={conversation.reciever?.profile} alt="" />
                  <div className="content">
                    <h3>{conversation.reciever?.name}</h3>
                    <h5>{conversation.reciever?.email}</h5>
                    {onlineUsers.includes(String(conversation.reciever?.id)) ? (
                      <h5 style={{ color: "var(--secColor)", marginTop: 10 }}>
                        Online
                      </h5>
                    ) : null}
                  </div>
                </div>
                {window.innerWidth < 999 ? null : (
                  <button onClick={handleLogout}>
                    <FaDoorOpen />
                    Logout
                  </button>
                )}
              </header>
              <div className="messages">
                {messages?.map((message, key) => (
                  <div key={key} className={`message ${message.type}`}>
                    <div className="top">
                      {message.type === "recieved" ? (
                        <img src={conversation.reciever?.profile} alt="" />
                      ) : null}
                      <p>{message.text}</p>
                    </div>
                    <h5>{normalizeTime(message.time)}</h5>
                  </div>
                ))}
                <div ref={chatContainer}></div>
              </div>
              <div className="type-message">
                <input
                  onChange={(e) => setText(e.target.value)}
                  type="text"
                  placeholder="Type a message..."
                  value={text}
                  onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
                />
                <div
                  style={{ visibility: text ? "visible" : "hidden" }}
                  onClick={sendMessage}
                  className="icon"
                >
                  <IoSend />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="logout">
                <button onClick={handleLogout}>
                  <FaDoorOpen />
                  Logout
                </button>
              </div>
              <div className="content">
                <img src={require("../../Assets/fullLogo.png")} alt="" />
                <h3>Hello {user?.name} 👋</h3>
                <p>
                  What's the most exciting thing happening in your life right
                  now?
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Home;
