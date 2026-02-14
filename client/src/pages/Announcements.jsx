import { useEffect, useState } from "react";
import { getAnnouncements, createAnnouncement } from "../services/announcementService";
import AnnouncementCard from "../components/AnnouncementCard";
import { jwtDecode } from "jwt-decode";
import "../css/Announcements.css";

function Announcements() {
  const token = localStorage.getItem("token");
const [formData, setFormData] = useState({
  title: "",
  description: "",
  category: "community",
  priority: "low",
});

  const [announcements, setAnnouncements] = useState([]);
  const [category, setCategory] = useState("");

  let user = null;
  try {
    user = token ? jwtDecode(token) : null;
  } catch (error) {
    console.log("Invalid token");
  }

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchAnnouncements();
  }, [category]);
const handleCreate = async (e) => {
  e.preventDefault();

  try {
    await createAnnouncement(token, formData);

    setFormData({
      title: "",
      description: "",
      category: "community",
      priority: "low",
    });

    fetchAnnouncements();
  } catch (error) {
    console.error(error);
  }
};

  const fetchAnnouncements = async () => {
    try {
      const data = await getAnnouncements(token, category);
      setAnnouncements(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="announcements-page">

      <div className="header">
        <h1>Announcements</h1>
      </div>
{/* ADMIN CREATE SECTION */}
{isAdmin && (
  <div className="create-section">
    <h2>Create Announcement</h2>

    <form onSubmit={handleCreate} className="create-form">

      <input
        type="text"
        placeholder="Title"
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

      <div className="form-row">
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option value="community">Community</option>
          <option value="job">Job</option>
          <option value="event">Event</option>
        </select>

        <select
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button type="submit">Publish</button>

    </form>
  </div>
)}

      <div className="filters">
        <button onClick={() => setCategory("")}>All</button>
        <button onClick={() => setCategory("job")}>Jobs</button>
        <button onClick={() => setCategory("community")}>Community</button>
        <button onClick={() => setCategory("event")}>Events</button>
      </div>

      <div className="announcement-list">
        {announcements.length === 0 ? (
          <p className="empty">No announcements found.</p>
        ) : (
          announcements.map((item) => (
            <AnnouncementCard key={item._id} announcement={item} />
          ))
        )}
      </div>

    </div>
  );
}

export default Announcements;
