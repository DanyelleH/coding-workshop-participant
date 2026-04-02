import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Pagination
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";

import { getAllTeams, createTeam } from "../api/teams";
import { getAllIndividuals } from "../api/individuals";
import { getAllAchievements } from "../api/achievements";

export default function AllTeams() {
  const [teams, setTeams] = useState([]);
  const [individuals, setIndividuals] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");

  // 🔥 Pagination
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [teamsData, individualsData, achievementsData] =
        await Promise.all([
          getAllTeams(),
          getAllIndividuals(),
          getAllAchievements()
        ]);

      setTeams(teamsData);
      setIndividuals(individualsData);
      setAchievements(achievementsData);
    };

    fetchData();
  }, []);

  const generateTeamId = () =>
    "TEAM" + Math.floor(1000 + Math.random() * 9000);

  const [form, setForm] = useState({
    _id: generateTeamId(),
    name: "",
    leaderId: "",
    members: []
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateTeam = async () => {
    try {
      const newTeam = {
        _id: generateTeamId(),
        name: form.name,
        leaderId: form.leaderId,
        members: form.members
      };

      await createTeam(newTeam);

      const updated = await getAllTeams();
      setTeams(updated);

      setOpen(false);
      setForm({
        _id: generateTeamId(),
        name: "",
        leaderId: "",
        members: []
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create team");
    }
  };

  // 🔥 Helpers
  const getTeamSize = (team) => team.members?.length || 0;

  const getAchievementCount = (teamId) =>
    achievements.filter((a) => a.teamId === teamId).length;

  // 🔥 Sorting
  const sortedTeams = [...teams].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "size") return getTeamSize(b) - getTeamSize(a);
    if (sortBy === "achievements")
      return (
        getAchievementCount(b._id) -
        getAchievementCount(a._id)
      );
    return 0;
  });

  // 🔥 Pagination slice
  const paginatedTeams = sortedTeams.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(
    sortedTeams.length / ITEMS_PER_PAGE
  );

  const cardStyle = {
    cursor: "pointer",
    borderRadius: 4,
    boxShadow: 3,
    height: "100%",
    transition: "all 0.25s ease",
    textAlign: "center",
    "&:hover": {
      boxShadow: 8,
      transform: "translateY(-4px)"
    }
  };

  const leaderOptions = individuals.filter(
    (user) =>
      !user.isLeader &&
      (!user.teamIds || user.teamIds.length === 0)
  );

  const memberOptions = individuals.filter(
    (user) =>
      !user.isLeader &&
      user._id !== form.leaderId
  );

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 4 }}>

      {/* 🔹 Header */}
      <Typography variant="h4" sx={{ mb: 2 }}>
        Teams
      </Typography>

      {/* 🔥 Sticky Controls */}
      <Box
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 1000,
          mb: 3,
          p: 2,
          borderRadius: 3,
          backdropFilter: "blur(8px)",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(26,26,26,0.9)"
              : "rgba(249,249,249,0.9)",
          boxShadow: 3,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="name">Alphabetical</MenuItem>
            <MenuItem value="size">Team Size</MenuItem>
            <MenuItem value="achievements">
              Achievements
            </MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={() => setOpen(true)}>
          + Create Team
        </Button>
      </Box>

      {/* 🔹 Teams Grid */}
      <Grid container spacing={3}>
        {paginatedTeams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team._id}>
            <Card
              sx={cardStyle}
              onClick={() =>
                navigate(`/teams/${team._id}`, { state: team })
              }
            >
              <CardContent>
                <GroupIcon
                  color="primary"
                  sx={{ fontSize: 36, mb: 1 }}
                />

                <Typography variant="h6" fontWeight={600}>
                  {team.name}
                </Typography>

                <Typography variant="body2">
                  Leader:{" "}
                  {individuals.find(
                    (u) => u._id === team.leaderId
                  )?.name || "None"}
                </Typography>

                <Typography variant="body2">
                  Members: {getTeamSize(team)}
                </Typography>

                <Typography variant="body2">
                  Achievements:{" "}
                  {getAchievementCount(team._id)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔥 Pagination */}
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

      {/* 🔹 Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Team</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Team Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Team Leader</InputLabel>
            <Select
              name="leaderId"
              value={form.leaderId}
              label="Team Leader"
              onChange={handleChange}
            >
              {leaderOptions.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Team Members</InputLabel>
            <Select
              multiple
              name="members"
              value={form.members}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 5) {
                  setForm({ ...form, members: value });
                }
              }}
              renderValue={(selected) =>
                selected
                  .map(
                    (id) =>
                      individuals.find((u) => u._id === id)?.name
                  )
                  .join(", ")
              }
            >
              {memberOptions.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTeam}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}