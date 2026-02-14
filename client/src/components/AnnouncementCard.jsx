import "../css/AnnouncementCard.css";

function AnnouncementCard({ announcement }) {
  return (
    <div className="announcement-card">

      <div className="card-header">
        <h3>{announcement.title}</h3>
        <span className={`priority ${announcement.priority}`}>
          {announcement.priority}
        </span>
      </div>

      <p className="description">
        {announcement.description}
      </p>

      <div className="card-footer">
        <span>{announcement.category}</span>
        <span>
          {new Date(announcement.createdAt).toLocaleDateString()}
        </span>
      </div>

    </div>
  );
}

export default AnnouncementCard;
