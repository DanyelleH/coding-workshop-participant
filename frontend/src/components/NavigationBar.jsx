import PropTypes from 'prop-types';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

/**
 * NavigationBar Component
 * A responsive dark-themed navigation bar for the teams management system.
 * Features navigation links, user profile menu, and mobile support.
 *
 * @param {Object} props - Component props
 * @param {string} props.userRole - The current user's role (e.g., 'admin', 'manager', 'user')
 * @param {Function} props.onLogout - Callback function triggered when user logs out
 * @param {Function} props.onNavigate - Callback function triggered when navigation occurs
 * @returns {JSX.Element} The navigation bar component
 */
function NavigationBar({ userRole = 'user', onLogout = () => {}, onNavigate = () => {} }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);

  /**
   * Handles opening the user profile menu
   * @param {Object} event - The click event
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handles closing the user profile menu
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handles logout and closes menu
   */
  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  /**
   * Handles navigation and closes mobile drawer
   * @param {string} destination - The navigation destination
   */
  const handleNavigation = (destination) => {
    setMobileOpen(false);
    onNavigate(destination);
  };

  /**
   * Handles mobile menu toggle
   */
  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Teams', path: '/teams' },
    { label: 'Team Display', path: '/team-display' },
    { label: 'Achievements', path: '/achievements' },
    { label: 'Individuals', path: '/individuals' },
  ];

  const adminItems = userRole === 'admin' ? [
    { label: 'Administration', path: '/admin' },
  ] : [];

  const mobileNavItems = [...navItems, ...adminItems];

  /**
   * Mobile Navigation Drawer
   */
  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {mobileNavItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: '#424242',
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#121212',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: 0.5,
              cursor: 'pointer',
              minWidth: 200,
            }}
            onClick={() => handleNavigation('/')}
          >
            Teams Manager
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => handleNavigation(item.path)}
                sx={{
                  textTransform: 'none',
                  fontSize: '1rem',
                  color: '#e0e0e0',
                  '&:hover': {
                    backgroundColor: '#2a2a2a',
                    color: '#ffffff',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {item.label}
              </Button>
            ))}
            {userRole === 'admin' && (
              <Button
                color="inherit"
                onClick={() => handleNavigation('/admin')}
                sx={{
                  textTransform: 'none',
                  fontSize: '1rem',
                  color: '#ffc107',
                  '&:hover': {
                    backgroundColor: '#2a2a2a',
                    color: '#ffeb3b',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Administration
              </Button>
            )}
          </Box>

          {/* User Profile Menu and Mobile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Profile Menu (Desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Button
                onClick={handleMenuOpen}
                sx={{
                  textTransform: 'none',
                  color: '#e0e0e0',
                  '&:hover': {
                    backgroundColor: '#2a2a2a',
                  },
                }}
              >
                Profile
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: '#1e1e1e',
                    color: '#e0e0e0',
                  },
                }}
              >
                <MenuItem onClick={() => handleNavigation('/user-profile')}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/settings')}>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: '#ff6b6b' }}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>

            {/* Mobile Menu Toggle */}
            <IconButton
              color="inherit"
              onClick={handleMobileMenuToggle}
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: '#e0e0e0',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: {
            backgroundColor: '#1e1e1e',
            color: '#e0e0e0',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

NavigationBar.propTypes = {
  /**
   * The current user's role for conditional rendering of admin features
   */
  userRole: PropTypes.oneOf(['user', 'manager', 'admin']),
  /**
   * Callback function triggered when user logs out
   */
  onLogout: PropTypes.func,
  /**
   * Callback function triggered when navigation occurs
   */
  onNavigate: PropTypes.func,
};

export default NavigationBar;
