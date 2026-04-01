import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, Box, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (form.username.length < 4) {
      alert("Username must be at least 4 characters");
      return;
    }
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (tab === 0) {
      // Login flow
      // **Logic to hit endpoint to authenticate user**
      // store token in local storage and set auth context
      alert("Login successful");
      // navigte to view all teams
      navigate("/teams", { state: form });
    } else {
      // Signup flow
      // **Logic to hit endpoint to create user**
      // store token in local storage and set auth context
      alert("Account created! Please complete your profile.");
      navigate("/profile-update", { state: form });
    }
  };

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

          <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
            Requirements:
            <br />• Username: at least 4 characters
            <br />• Password: at least 6 characters
          </Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, borderRadius: 2 }}
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
