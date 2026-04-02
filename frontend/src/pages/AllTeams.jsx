import React from "react";
import { useState } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";
import { getAllTeams } from "../api/teams";
// Mock data
// const teams = [
//   { id: "TEAM101", name: "Alpha Team", leader: "Emma Wilson" },
//   { id: "TEAM102", name: "Beta Team", leader: "Liam Martinez" },
//   { id: "TEAM103", name: "Gamma Team", leader: "Ethan Wong" }
// ];

export default function AllTeams() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  const cardStyle = {
    cursor: "pointer",
    borderRadius: 4,
    boxShadow: 4,
    height: "100%",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    '&:hover': {
      boxShadow: 10,
      transform: "translateY(-4px) scale(1.02)",
      backgroundColor: "#f5f5f5"
    }
  };

  React.useEffect(() => {
    const fetchTeams = async () => {
      const data = await getAllTeams();
      setTeams(data);
    };
    fetchTeams();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        All Teams
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {teams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team.id}>
            <Card
              sx={cardStyle}
              onClick={() => navigate(`/teams/${team.id}`)}
            >
              <CardContent>
                <GroupIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />

                <Typography variant="h6" fontWeight={600}>
                  {team.name}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 1 }}>
                  <StarIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {team.leader}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}