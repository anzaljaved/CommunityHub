import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMessages, sendMessage } from "../services/threadService";
import MessageBubble from "../components/MessageBubble";
import "../css/ThreadDetail.css";

function ThreadDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getMessages(token, id);
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      await sendMessage(token, id, content);
      setContent("");
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="thread-detail-page">

      <div className="messages-container">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}
      </div>

      <form onSubmit={handleSend} className="message-input-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

    </div>
  );
}

export default ThreadDetail;
