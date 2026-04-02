import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Tabs,
  Tab
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../api/auth";

export default function Login() {
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    name: ""
  });

  const navigate = useNavigate();

  // 🔥 Check if user already logged in
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateId = () =>
    "IND" + Math.floor(1000 + Math.random() * 9000);

  const handleSubmit = async () => {
    try {
      if (form.username.length < 4) {
        alert("Username must be at least 4 characters");
        return;
      }

      if (form.password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      if (tab === 0) {
        const res = await login({
          username: form.username,
          password: form.password
        });

        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);

        navigate("/teams");
      } else {
        if (!form.email || !form.name) {
          alert("Name and email are required");
          return;
        }

        await signup({
          _id: generateId(),
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password
        });

        alert("Account created! You can now log in.");
        setTab(0);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔥 IF LOGGED IN → SHOW WELCOME
  if (user) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #e3f2fd, #fce4ec)"
        }}
      >
        <Card sx={{ width: 400, borderRadius: 4, boxShadow: 6 }}>
          <CardContent sx={{ textAlign: "center" }}>
            
            <Typography variant="h5" gutterBottom>
              Welcome back, {user.name} 👋
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              You’re already logged in
            </Typography>

            <Button
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
              onClick={() => navigate("/teams")}
            >
              Go to Dashboard
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>

          </CardContent>
        </Card>
      </Box>
    );
  }

  // 🔥 NORMAL LOGIN UI
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3f2fd, #fce4ec)"
      }}
    >
      <Card sx={{ width: 400, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            {tab === 0 ? "Login" : "Sign Up"}
          </Typography>

          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            centered
            sx={{ mb: 2 }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          {tab === 1 && (
            <>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                margin="normal"
                value={form.name}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                margin="normal"
                value={form.email}
                onChange={handleChange}
              />
            </>
          )}

          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            value={form.username}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={form.password}
            onChange={handleChange}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            {tab === 0 ? "Login" : "Create Account"}
          </Button>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, cursor: "pointer" }}
            onClick={() => setTab(tab === 0 ? 1 : 0)}
          >
            {tab === 0
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}