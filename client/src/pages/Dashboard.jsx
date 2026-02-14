import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../css/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      fetchCommunity();
    } catch (error) {
      console.log("Invalid token");
      navigate("/login");
    }
  }, []);

  const fetchCommunity = async () => {
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
      console.error(error);
    }
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-container">

        <h1>Welcome, {user?.email}</h1>

        <div className="dashboard-cards">

          <div className="card">
            <h3>Your Details</h3>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>

          <div className="card">
            <h3>Your Community</h3>
            {community ? (
              <>
                <p><strong>Name:</strong> {community.name}</p>
                <p><strong>City:</strong> {community.city}</p>
              </>
            ) : (
              <p>You are not part of a community.</p>
            )}
          </div>

        </div>

        <h2 className="section-title">Quick Access</h2>

        <div className="quick-links">
  

  <div
    className="link-card"
    onClick={() => navigate("/threads")}
  >
    Threads
  </div>

  <div
    className="link-card"
    onClick={() => navigate("/announcements")}
  >
    Announcements
  </div>
  <div
    className="link-card"
    onClick={() => navigate("/community")}
  >
    Community Code
  </div>
</div>


      </div>

    </div>
  );
}

export default Dashboard;
