import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  TextField
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// Mock data
const achievements = [
  {
    _id: "ACH01",
    name: "Top Performing Team",
    description: "Exceeded quarterly performance goals.",
    teamId: "TEAM101",
    dateAwarded: "2024-03-01T00:00:00Z",
    points: 200,
    category: "Performance"
  },
  {
    _id: "ACH02",
    name: "Innovation Excellence",
    description: "Delivered innovative solutions improving efficiency.",
    teamId: "TEAM102",
    dateAwarded: "2024-02-15T00:00:00Z",
    points: 150,
    category: "Innovation"
  },
  {
    _id: "ACH03",
    name: "Customer Impact Award",
    description: "Significantly improved customer satisfaction.",
    teamId: "TEAM103",
    dateAwarded: "2024-01-20T00:00:00Z",
    points: 180,
    category: "Customer Success"
  }
];

export default function Achievements() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatDate = (date) => new Date(date).toLocaleDateString();

  // 🔥 Filter logic
  const filteredAchievements = achievements.filter((ach) => {
    const date = new Date(ach.dateAwarded);

    if (startDate && date < new Date(startDate)) return false;
    if (endDate && date > new Date(endDate)) return false;

    return true;
  });

  const cardStyle = {
    borderRadius: 4,
    boxShadow: 4,
    height: "100%",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    '&:hover': {
      boxShadow: 10,
      transform: "translateY(-4px) scale(1.01)"
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Team Achievements
      </Typography>

      {/* 🔍 Date Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          mb: 4,
          flexWrap: "wrap"
        }}
      >
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            '& input': {
              color: "text.primary"
            },
            '& label': {
              color: "text.secondary"
            }
          }}
        />

        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            '& input': {
              color: "text.primary"
            },
            '& label': {
              color: "text.secondary"
            }
          }}
        />
      </Box>

      <Grid container spacing={4}>
        {filteredAchievements.map((ach) => (
          <Grid item xs={12} sm={6} md={4} key={ach._id}>
            <Card sx={cardStyle}>
              <CardContent>

                {/* Header */}
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <EmojiEventsIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    {ach.name}
                  </Typography>
                </Stack>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {ach.description}
                </Typography>

                {/* Meta */}
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <StarIcon fontSize="small" color="action" />
                    <Typography variant="body2">Points: {ach.points}</Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatDate(ach.dateAwarded)}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Footer */}
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                  <Chip label={ach.category} color="primary" size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {ach.teamId}
                  </Typography>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty state */}
      {filteredAchievements.length === 0 && (
        <Typography textAlign="center" sx={{ mt: 4 }}>
          No achievements found for selected date range.
        </Typography>
      )}
    </Box>
  );
}
