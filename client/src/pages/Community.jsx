import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Community.css";

function Community() {
  const token = localStorage.getItem("token");

  const [community, setCommunity] = useState(null);
  const [inviteCode, setInviteCode] = useState("");
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

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:5000/api/community/join/${inviteCode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchMyCommunity();
    } catch (error) {
      alert(error.response?.data?.message || "Join failed");
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
      <strong>Invite Code:</strong> {community.inviteCode}
    </div>
  )}
</div>

      ) : (
        <div className="community-actions">

          <div className="join-section">
            <h3>Join Community</h3>
            <form onSubmit={handleJoin}>
              <input
                type="text"
                placeholder="Enter Invite Code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
              <button type="submit">Join</button>
            </form>
          </div>

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
              <button type="submit">Create</button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}

export default Community;
