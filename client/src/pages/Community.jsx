import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Community.css";

function Community() {
  const token = localStorage.getItem("token");

  const [community, setCommunity] = useState(null);
  const [createData, setCreateData] = useState({
    name: "",
    city: "",
    description: "",
  });

  useEffect(() => {
    fetchMyCommunity();
  }, []);

  const fetchMyCommunity = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/community/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommunity(res.data);
    } catch (error) {
      setCommunity(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/community",
        createData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchMyCommunity();
    } catch (error) {
      alert(error.response?.data?.message || "Creation failed");
    }
  };

  return (
    <div className="community-page">

      {community ? (
        <div className="community-card">
          <h2>{community.name}</h2>
          <p><strong>City:</strong> {community.city}</p>
          <p>{community.description}</p>

          {community.inviteCode && (
            <div className="invite-box">
              <p><strong>Invite Code:</strong> {community.inviteCode}</p>

              <p className="invite-link">
                {`${window.location.origin}/join/${community.inviteCode}`}
              </p>

              <button
                className="copy-btn"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/join/${community.inviteCode}`
                  )
                }
              >
                Copy Join Link
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="create-section">
          <h3>Create Community (Admin Only)</h3>

          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Community Name"
              onChange={(e) =>
                setCreateData({ ...createData, name: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="City"
              onChange={(e) =>
                setCreateData({ ...createData, city: e.target.value })
              }
              required
            />

            <textarea
              placeholder="Description"
              onChange={(e) =>
                setCreateData({ ...createData, description: e.target.value })
              }
            />

            <button type="submit">Create Community</button>
          </form>
        </div>
      )}

    </div>
  );
}

export default Community;
