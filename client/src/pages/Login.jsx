import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', formData);

    try {
      const res = await loginUser(formData);
      console.log('Login successful:', res);
      
      localStorage.setItem("token", res.token);
      setUser(res.user);

      // Save user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(res.user));

      console.log('User role:', res.user.role);
      if (res.user.role === 'resident') {
        console.log('Redirecting to /dashboard');
        navigate("/dashboard");
      } else {
        console.log('Redirecting to /dashboard (default)');
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
