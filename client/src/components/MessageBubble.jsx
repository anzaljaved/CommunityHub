import jwtDecode from "jwt-decode";
import "../css/MessageBubble.css";

function MessageBubble({ message }) {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const isOwn = message.sender?._id === user?.userId;

  return (
    <div className={`message-bubble ${isOwn ? "own" : ""}`}>

      <div className="message-sender">
        {message.sender?.name}
      </div>

      <div className="message-content">
        {message.content}
      </div>

    </div>
  );
}

export default MessageBubble;
