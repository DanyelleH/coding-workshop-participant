import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Avatar,
} from "@mui/material";
import ProfileUpdate from "./ProfileUpdate";

export default function Profile() {
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState({
    name: "Alice Johnson",
    username: "alicej",
    email: "alice@example.com",
    organization: "Enterprise Technology",
    role: "Frontend Developer",
    location: "New York",
    region: "NA"
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3f2fd, #fce4ec)",
        p: 2
      }}
    >
      <Card
        sx={{
          width: 420,
          borderRadius: 4,
          boxShadow: 6,
          textAlign: "center",
          p: 2
        }}
      >
        <CardContent>
          {/* Avatar */}
          <Avatar
            sx={{
              width: 70,
              height: 70,
              margin: "0 auto",
              mb: 2,
              bgcolor: "#1976d2",
              fontSize: 28
            }}
          >
            {user.name[0]}
          </Avatar>

          {/* Name + Username */}
          <Typography variant="h5" fontWeight={600}>
            {user.name}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            @{user.username}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Info */}
          <Box sx={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography><strong>Organization:</strong> {user.organization}</Typography>
            <Typography><strong>Role:</strong> {user.role}</Typography>
            <Typography><strong>Location:</strong> {user.location}</Typography>
            <Typography><strong>Region:</strong> {user.region}</Typography>
          </Box>

          {/* Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, borderRadius: 2 }}
            onClick={() => setOpen(true)}
          >
            Update Profile
          </Button>
        </CardContent>
      </Card>

      {/* Dialog */}
      <ProfileUpdate
        open={open}
        onClose={() => setOpen(false)}
        user={user}
        onSave={(updated) => setUser(updated)}
      />
    </Box>
  );
}