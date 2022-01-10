/*global chrome*/
import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";
import createPersistedState from "use-persisted-state";
const useUsernameState = createPersistedState("username");

function App({ isExt }) {
  const [msgList, setMsgList] = useState([]);
  const [msg, setMsg] = useState("");
  const [toggle, setToggle] = useState(false);
  const [username, setUsername] = useUsernameState("");

  // sets up a function for keeping chat at the bottom
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    if (messagesEndRef) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(scrollToBottom, [msgList]);

  // call for messages
  async function getMsgs() {
  let { data: dfk, error } = await supabase.from("dfk").select("*");
  setMsgList(dfk);
  }
   inital setup  for the chat history
  useEffect(() => {
  getMsgs();
  }, []);

  // sets up a subscription listener
  useEffect(() => {
    const dfk = supabase
      .from("dfk")
      .on("*", (payload) => {
        if (payload.eventType === "INSERT") {
          setMsgList([...getMsgs(), payload.new]);
        }
      })
      .subscribe();
    return () => dfk();
  }, []);

  // sends the new message
  const sendMsg = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("dfk")
        .insert([{ username, message: msg }]);
    } catch (err) {
      console.log(err);
    } finally {
      setMsg("");
    }
  };
  // updates messsage inside input
  const updateMsg = ({ target: { value } }) => setMsg(value);
  const updateUsername = ({ target: { value } }) => setUsername(value);

  return (
    <>
      <div className="dfkc-App">
        {msgList.map(({ username, message }, i) => (
          <div className="dfkc-ChatItem" key={i}>
            <span className="dfkc-username">{username}:</span>
            <p className="dfkc-message">{message}</p>
          </div>
        ))}
      </div>
      {toggle && username ? (
        <form className="dfkc-MsgInput" onSubmit={sendMsg} ref={messagesEndRef}>
          <input
            placeholder="Message"
            value={msg}
            autoFocus
            onChange={updateMsg}
          />
          <button type="submit">Send</button>
        </form>
      ) : (
        <form
          className="dfkc-MsgInput"
          onSubmit={(e) => {
            e.preventDefault();
            setToggle(true);
          }}
          ref={messagesEndRef}
        >
          <input
            placeholder="Pick a Username"
            value={username}
            autoFocus
            onChange={updateUsername}
          />
          <button type="submit">Send</button>
        </form>
      )}
    </>
  );
}

export default App;
