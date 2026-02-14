import { useEffect, useState } from "react";
import { getThreads, createThread } from "../services/threadService";
import { useNavigate } from "react-router-dom";
import "../css/Threads.css";

function Threads() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [threads, setThreads] = useState([]);
  const [type, setType] = useState("");
const [formData, setFormData] = useState({
  title: "",
  description: "",
  type: "general",
});
const handleCreate = async (e) => {
  e.preventDefault();

  try {
    await createThread(token, formData);

    setFormData({
      title: "",
      description: "",
      type: "general",
    });

    fetchThreads();
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    fetchThreads();
  }, [type]);

  const fetchThreads = async () => {
    try {
      const data = await getThreads(token, type);
      setThreads(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="threads-page">

      <h1>Community Discussions</h1>
<div className="create-thread">
  <h2>Start New Discussion</h2>

  <form onSubmit={handleCreate} className="create-thread-form">
    <input
      type="text"
      placeholder="Thread Title"
      value={formData.title}
      onChange={(e) =>
        setFormData({ ...formData, title: e.target.value })
      }
      required
    />

    <textarea
      placeholder="Description"
      value={formData.description}
      onChange={(e) =>
        setFormData({ ...formData, description: e.target.value })
      }
      required
    />

    <select
      value={formData.type}
      onChange={(e) =>
        setFormData({ ...formData, type: e.target.value })
      }
    >
      <option value="general">General Discussion</option>
      <option value="event">Event Discussion</option>
    </select>

    <button type="submit">Create Thread</button>
  </form>
</div>

      <div className="thread-filters">
        <button onClick={() => setType("")}>All</button>
        <button onClick={() => setType("general")}>General</button>
        <button onClick={() => setType("event")}>Events</button>
      </div>

      <div className="thread-list">
        {threads.map((thread) => (
          <div
            key={thread._id}
            className="thread-card"
            onClick={() => navigate(`/threads/${thread._id}`)}
          >
            <h3>{thread.title}</h3>
            <p>{thread.description}</p>
            <span>
              {thread.messageCount} messages
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Threads;
