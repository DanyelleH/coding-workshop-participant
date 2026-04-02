import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  TextField,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  Pagination
} from "@mui/material";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { getAllAchievements, createAchievement } from "../api/achievements";
import { getAllTeams } from "../api/teams";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [teams, setTeams] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [open, setOpen] = useState(false);

  // 🔥 Pagination
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const [form, setForm] = useState({
    name: "",
    description: "",
    teamId: "",
    category: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const ach = await getAllAchievements();
      const t = await getAllTeams();
      setAchievements(ach);
      setTeams(t);
    };
    fetchData();
  }, []);

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const getTeamName = (id) =>
    teams.find((t) => t._id === id)?.name || id;

  const categories = [
    ...new Set(achievements.map((a) => a.category).filter(Boolean))
  ];

  // 🔍 FILTER
  const filteredAchievements = achievements.filter((ach) => {
    const date = new Date(ach.dateAwarded);

    if (startDate && date < new Date(startDate)) return false;
    if (endDate && date > new Date(endDate)) return false;
    if (selectedCategory && ach.category !== selectedCategory) return false;
    if (selectedTeam && ach.teamId !== selectedTeam) return false;

    return true;
  });

  // 🔥 Pagination slice
  const paginatedAchievements = filteredAchievements.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(
    filteredAchievements.length / ITEMS_PER_PAGE
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateId = () =>
    "ACH" + Math.floor(1000 + Math.random() * 9000);

  const handleCreate = async () => {
    try {
      const newAchievement = {
        _id: generateId(),
        ...form,
        dateAwarded: new Date().toISOString()
      };

      await createAchievement(newAchievement);

      const updated = await getAllAchievements();
      setAchievements(updated);

      setOpen(false);
      setForm({ name: "", description: "", teamId: "", category: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to create achievement");
    }
  };

  const cardStyle = {
    borderRadius: 4,
    boxShadow: 3,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "all 0.25s ease",
    "&:hover": {
      boxShadow: 8,
      transform: "translateY(-4px)"
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 4 }}>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4">Achievements</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Create
        </Button>
      </Box>

      {/* Filters */}
      <Box
  sx={{
    position: "sticky",
    top: 64, // 🔥 adjust if your navbar height is different
    zIndex: 1000,
    mb: 4,
    p: 2,
    borderRadius: 3,
    backdropFilter: "blur(8px)",
    backgroundColor: (theme) =>
      theme.palette.mode === "dark"
        ? "rgba(26,26,26,0.9)"
        : "rgba(249,249,249,0.9)",
    boxShadow: 3,
    border: "1px solid",
    borderColor: "divider"
  }}
>
        <Stack direction="row" spacing={2} flexWrap="wrap">

          <TextField
            label="Start Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <TextField
            label="End Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={selectedCategory}
              displayEmpty
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
            
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={selectedTeam}
              displayEmpty
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <MenuItem value="">All Teams</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team._id} value={team._id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </Stack>
      </Box>

      {/* Cards */}
      <Grid container spacing={3}>
        {paginatedAchievements.map((ach) => (
          <Grid item xs={12} sm={6} md={4} key={ach._id}>
            <Card sx={cardStyle}>
              <CardContent>

                {/* Title */}
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <EmojiEventsIcon color="primary" />
                  <Typography fontWeight={600}>
                    {ach.name}
                  </Typography>
                </Stack>

                {/* Description */}
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {ach.description}
                </Typography>

                {/* Meta */}
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="caption">
                      {formatDate(ach.dateAwarded)}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Footer */}
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Chip label={ach.category} size="small" />
                  <Typography variant="caption">
                    {getTeamName(ach.teamId)}
                  </Typography>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Empty */}
      {filteredAchievements.length === 0 && (
        <Typography textAlign="center" sx={{ mt: 4 }}>
          No achievements match your filters.
        </Typography>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Achievement</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={3}
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal">
            <Select
              name="teamId"
              value={form.teamId}
              displayEmpty
              onChange={handleChange}
            >
              <MenuItem value="">Select Team</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team._id} value={team._id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
  <InputLabel>Category</InputLabel>
  <Select
    value={isCustomCategory ? "custom" : form.category}
    label="Category"
    onChange={(e) => {
      if (e.target.value === "custom") {
        setIsCustomCategory(true);
        setForm({ ...form, category: "" });
      } else {
        setIsCustomCategory(false);
        setForm({ ...form, category: e.target.value });
      }
    }}
  >
    {categories.map((cat) => (
      <MenuItem key={cat} value={cat}>
        {cat}
      </MenuItem>
    ))}

    <MenuItem value="custom">
      ➕ Add New Category
    </MenuItem>
  </Select>
</FormControl>

{/* 🔥 ADD THIS RIGHT HERE */}
{isCustomCategory && (
  <TextField
    fullWidth
    margin="normal"
    label="New Category"
    value={form.category}
    onChange={(e) =>
      setForm({ ...form, category: e.target.value })
    }
    autoFocus
  />
)}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}