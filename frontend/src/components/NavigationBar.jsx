import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NavigationBar({ userRole = "user" }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  const isMenuOpen = Boolean(menuAnchor);

  // 🔥 Get user from storage
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 Logout logic (GLOBAL + CLEAN)
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated"); // optional

    setMenuAnchor(null);
    setMobileOpen(false);

    navigate("/"); // or "/login"
  };

  const navItems = [
    { label: "View Teams", path: "/teams" },
    { label: "Achievements", path: "/achievements" },
    ...(userRole === "admin"
      ? [{ label: "Administration", path: "/admin", highlight: true }]
      : []),
  ];

  const handleNavigate = (path) => {
    setMobileOpen(false);
    setMenuAnchor(null);
    navigate(path);
  };

  return (
    <>
      <AppBar sx={{ backgroundColor: "#121212" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{ cursor: "pointer", fontWeight: 700 }}
            onClick={() => handleNavigate("/")}
          >
            Teams Manager
          </Typography>

          {/* Desktop Nav */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  textTransform: "none",
                  color: item.highlight ? "#ffc107" : "#e0e0e0",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Profile + Mobile */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            
            {/* Profile Menu */}
            <Button
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              sx={{ display: { xs: "none", md: "block" }, color: "#e0e0e0" }}
            >
              {user?.name || "Profile"}
            </Button>

            <Menu
              anchorEl={menuAnchor}
              open={isMenuOpen}
              onClose={() => setMenuAnchor(null)}
            >
              <MenuItem onClick={() => handleNavigate("/user-profile")}>
                My Profile
              </MenuItem>


              <MenuItem
                onClick={handleLogout}
                sx={{ color: "red" }}
              >
                Logout
              </MenuItem>
            </Menu>

            {/* Mobile Menu */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: "flex", md: "none" }, color: "#e0e0e0" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box sx={{ width: 250 }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton onClick={() => handleNavigate(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}

            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate("/user-profile")}>
                <ListItemText primary="My Profile" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate("/settings")}>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}