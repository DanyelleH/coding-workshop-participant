import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  Button,
  TextField
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";

// Mock data
const initialTeams = {
  TEAM101: {
    name: "Alpha Team",
    leader: "Emma Wilson",
    members: ["Alice Johnson", "Brian Smith", "Carla Gomez", "David Lee", "Frank Chen"],
    achievements: ["Top Performing Team", "Delivery Excellence"]
  },
  TEAM102: {
    name: "Beta Team",
    leader: "Liam Martinez",
    members: ["Alice Johnson", "Carla Gomez", "Sofia Ramirez", "Noah Kim", "Olivia Turner"],
    achievements: ["Innovation Excellence"]
  },
  TEAM103: {
    name: "Gamma Team",
    leader: "Ethan Wong",
    members: ["Carla Gomez", "Isabella Perez", "Lucas Brown", "Mia Fischer", "Jakob Svensson"],
    achievements: ["Customer Impact Award"]
  }
};

export function Team() {
  const { teamId } = useParams();
  const [teams, setTeams] = useState(initialTeams);

  const [newMember, setNewMember] = useState("");
  const [newLeader, setNewLeader] = useState("");
  const [newAchievement, setNewAchievement] = useState("");

  const team = teams[teamId];

  if (!team) return <Typography>Team not found</Typography>;

  const addMember = () => {
    if (!newMember) return;
    setTeams({
      ...teams,
      [teamId]: {
        ...team,
        members: [...team.members, newMember]
      }
    });
    setNewMember("");
  };

  const removeMember = (member) => {
    setTeams({
      ...teams,
      [teamId]: {
        ...team,
        members: team.members.filter((m) => m !== member)
      }
    });
  };

  const updateLeader = () => {
    if (!newLeader) return;
    setTeams({
      ...teams,
      [teamId]: {
        ...team,
        leader: newLeader
      }
    });
    setNewLeader("");
  };

  const addAchievement = () => {
    if (!newAchievement) return;
    setTeams({
      ...teams,
      [teamId]: {
        ...team,
        achievements: [...team.achievements, newAchievement]
      }
    });
    setNewAchievement("");
  };

  const cardStyle = {
    mb: 3,
    borderRadius: 4,
    boxShadow: 4,
    transition: "all 0.3s ease",
    '&:hover': {
      boxShadow: 8,
      transform: "translateY(-2px)"
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {team.name}
      </Typography>

      {/* Leader */}
      <Card sx={cardStyle}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StarIcon color="primary" />
            <Typography variant="h6">Team Leader</Typography>
          </Box>

          <Typography sx={{ mt: 1 }}>{team.leader}</Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="New Leader"
              value={newLeader}
              onChange={(e) => setNewLeader(e.target.value)}
              size="small"
            />
            <Button variant="contained" onClick={updateLeader}>
              Reassign
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Members */}
      <Card sx={cardStyle}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon color="primary" />
            <Typography variant="h6">Members</Typography>
          </Box>

          <List>
            {team.members.map((member, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Button color="error" onClick={() => removeMember(member)}>
                    Remove
                  </Button>
                }
              >
                {member}
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Add Member"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              size="small"
            />
            <Button variant="contained" onClick={addMember}>
              Add
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card sx={cardStyle}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmojiEventsIcon color="primary" />
            <Typography variant="h6">Achievements</Typography>
          </Box>

          <List>
            {team.achievements.map((ach, index) => (
              <ListItem key={index}>{ach}</ListItem>
            ))}
          </List>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="New Achievement"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              size="small"
            />
            <Button variant="contained" onClick={addAchievement}>
              Reward
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}