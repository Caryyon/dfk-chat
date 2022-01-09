/*global chrome*/
import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";

function App({ isExt }) {
  const [msgList, setMsgList] = useState([]);
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [msgList]);

  async function getMsgs() {
    let { data: dfk, error } = await supabase.from("dfk").select("*");
    setMsgList(dfk);
  }
  useEffect(() => {
    getMsgs();
  }, []);

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

  const sendMsg = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("dfk")
        .insert([{ username: "someValue", message: msg }]);
    } catch (err) {
      console.log(err);
    } finally {
      setMsg("");
    }
  };
  const updateMsg = ({ target: { value } }) => {
    setMsg(value);
  };

  return (
    <>
      <div className="dfkc-App">
        {msgList.map(({ username, message }, i) => (
          <div className="dfkc-ChatItem" key={i}>
            <span className="dfkc-username">{username}: </span>
            <p className="dfkc-message"> {message}</p>
          </div>
        ))}
      </div>
      <form className="dfkc-MsgInput" onSubmit={sendMsg} ref={messagesEndRef}>
        <input value={msg} onChange={updateMsg} />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default App;
