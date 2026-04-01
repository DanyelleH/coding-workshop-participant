import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  IconButton,
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ProfileUpdate({ open, onClose, user, onSave }) {
  const [form, setForm] = useState(user || {});

  // Sync with parent user data
  useEffect(() => {
    setForm(user || {});
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.organization) {
      alert("Please fill in all required fields");
      return;
    }

    onSave(form);   // update parent state
    onClose();      // close dialog
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Update Profile
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          
          <TextField
            label="Full Name"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Organization"
            name="organization"
            value={form.organization || ""}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Enterprise Technology">Enterprise Technology</MenuItem>
            <MenuItem value="Credit Cards">Credit Cards</MenuItem>
            <MenuItem value="Private Banking">Private Banking</MenuItem>
          </TextField>

          <TextField
            label="Role"
            name="role"
            value={form.role || ""}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Location"
            name="location"
            value={form.location || ""}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Region"
            name="region"
            value={form.region || ""}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="NA">North America</MenuItem>
            <MenuItem value="EU">Europe</MenuItem>
            <MenuItem value="APAC">Asia</MenuItem>
          </TextField>

          <Button
            variant="contained"
            sx={{ mt: 2, borderRadius: 2 }}
            onClick={handleSubmit}
          >
            Save Changes
          </Button>

        </Box>
      </DialogContent>
    </Dialog>
  );
}