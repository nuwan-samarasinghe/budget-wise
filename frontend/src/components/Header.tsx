import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import {
  Avatar,
  Box,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../assets/logo.svg';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/my-profile');
    handleMenuClose();
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    handleMenuClose();
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
      {/* Logo and title */}
      <Box display="flex" alignItems="center" gap={1}>
        <img src={logoIcon} alt="Logo" style={{ height: 32 }} />
        <Typography variant="h6" color="common.white" fontWeight="bold">
          BUDGET WISE
        </Typography>
      </Box>

      {/* Avatar and menu */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src="/profile.jpg"
          sx={{ border: '2px solid #4ade80', cursor: 'pointer' }}
          onClick={handleMenuOpen}
        />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
