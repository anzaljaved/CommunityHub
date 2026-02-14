import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/JoinCommunity.css";

function JoinCommunity() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    houseName: "",
    houseNumber: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:5000/api/community/join/${inviteCode}`,
        formData
      );

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Join failed");
    }
  };

  return (
    <div className="join-page">
      <div className="join-card">

        <h2>Join Community</h2>
        <p className="invite-display">
          Invite Code: <strong>{inviteCode}</strong>
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="houseName"
            placeholder="House Name"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="houseNumber"
            placeholder="House Number"
            onChange={handleChange}
            required
          />

          <button type="submit">Join Community</button>

        </form>

      </div>
    </div>
  );
}

export default JoinCommunity;
