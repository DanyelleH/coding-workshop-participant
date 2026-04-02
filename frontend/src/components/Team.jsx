import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";

import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";

import { useLocation } from "react-router-dom";
import { getAllIndividuals } from "../api/individuals";
import { updateTeam } from "../api/teams";
import { getAchievementsByTeam } from "../api/achievements";

export function Team() {
  const location = useLocation();
  const team = location.state;

  const [achievements, setAchievements] = useState([]);
  const [individuals, setIndividuals] = useState([]);
  const [localMembers, setLocalMembers] = useState(team?.members || []);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedLeader, setSelectedLeader] = useState("");

  // 🔹 Fetch individuals
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllIndividuals();
        setIndividuals(data);
      } catch (err) {
        console.error("Failed to fetch individuals", err);
      }
    };
    fetchUsers();
  }, []);

  // 🔹 Fetch achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await getAchievementsByTeam(team._id);
        setAchievements(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (team?._id) fetchAchievements();
  }, [team?._id]);

  if (!team) {
    return <Typography>Team not found (refresh issue)</Typography>;
  }

  // 🔥 Helper: name + region
  const getNameWithRegion = (id) => {
    const user = individuals.find((u) => u._id === id);
    if (!user) return id;
    return `${user.name} (${user.region || "N/A"})`;
  };

  // 🔹 Leader options
  const leaderOptions = individuals.filter(
    (user) =>
      !user.isLeader &&
      (!user.teamIds || user.teamIds.length === 0)
  );

  // 🔹 Member options
  const memberOptions = individuals.filter(
    (user) =>
      !user.isLeader &&
      !localMembers.includes(user._id) &&
      user._id !== team.leaderId
  );

  // 🔹 Update leader
  const handleUpdateLeader = async () => {
    if (!selectedLeader) return;

    try {
      await updateTeam(team._id, {
        leaderId: selectedLeader
      });

      const updatedMembers = localMembers.filter(
        (m) => m !== selectedLeader
      );

      setLocalMembers(updatedMembers);
      team.leaderId = selectedLeader;

      setSelectedLeader("");
    } catch (err) {
      console.error(err);
      alert("Failed to update leader");
    }
  };

  // 🔹 Add member
  const handleAddMember = async () => {
    if (!selectedMember) return;

    const updatedMembers = [...localMembers, selectedMember];

    if (updatedMembers.length > 5) {
      alert("Max 5 members allowed");
      return;
    }

    try {
      await updateTeam(team._id, {
        members: updatedMembers
      });

      setLocalMembers(updatedMembers);
      setSelectedMember("");
    } catch (err) {
      console.error(err);
      alert("Failed to add member");
    }
  };

  // 🔹 Remove member
  const handleRemoveMember = async (memberId) => {
    try {
      const updatedMembers = localMembers.filter(
        (m) => m !== memberId
      );

      await updateTeam(team._id, {
        members: updatedMembers
      });

      setLocalMembers(updatedMembers);
    } catch (err) {
      console.error(err);
      alert("Failed to remove member");
    }
  };

  const cardStyle = {
    mb: 3,
    borderRadius: 4,
    boxShadow: 4,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: 8,
      transform: "translateY(-2px)"
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 4 }}>

      {/* 🔹 Title */}
      <Typography variant="h4" gutterBottom>
        {team.name}
      </Typography>

      {/* 🔹 Leader */}
      <Card sx={cardStyle}>
        <CardContent>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StarIcon color="primary" />
            <Typography variant="h6">Team Leader</Typography>
          </Box>

          <Typography sx={{ mt: 1 }}>
            {getNameWithRegion(team.leaderId)}
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Change Leader</InputLabel>
            <Select
              value={selectedLeader}
              label="Change Leader"
              onChange={(e) => setSelectedLeader(e.target.value)}
            >
              {leaderOptions.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Typography>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.region || "N/A"}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={handleUpdateLeader}
          >
            Reassign Leader
          </Button>
        </CardContent>
      </Card>

      {/* 🔹 Members */}
      <Card sx={cardStyle}>
        <CardContent>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon color="primary" />
            <Typography variant="h6">Members</Typography>
          </Box>

          <List>
            {localMembers.map((memberId) => (
              <ListItem
                key={memberId}
                secondaryAction={
                  <Button
                    color="error"
                    onClick={() => handleRemoveMember(memberId)}
                  >
                    Remove
                  </Button>
                }
              >
                {getNameWithRegion(memberId)}
              </ListItem>
            ))}
          </List>

          {localMembers.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No members assigned
            </Typography>
          )}

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Add Member</InputLabel>
            <Select
              value={selectedMember}
              label="Add Member"
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              {memberOptions.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Typography>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.region || "N/A"}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={handleAddMember}
          >
            Add Member
          </Button>
        </CardContent>
      </Card>

      {/* 🔹 Achievements */}
      <Card sx={cardStyle}>
        <CardContent>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmojiEventsIcon color="primary" />
            <Typography variant="h6">Achievements</Typography>
          </Box>

          <List>
            {achievements.map((ach) => (
              <ListItem key={ach._id}>
                <Box>
                  <Typography fontWeight={600}>
                    {ach.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ach.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(ach.dateAwarded).toLocaleDateString()}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>

          {achievements.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No achievements yet
            </Typography>
          )}

        </CardContent>
      </Card>

    </Box>
  );
}