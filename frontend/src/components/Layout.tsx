import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import SidebarContent from './Sidebar';

const drawerWidth = 240;

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const toolbarHeight = isSmUp ? 64 : 56;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{ ml: { md: drawerWidth }, width: { md: '100%' } }}
        className="bg-brand-800 border-b border-brand-700"
      >
        <Toolbar className="!bg-transparent">
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer}
              className="text-brand-50"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Header />
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
          mt: { xs: 7, sm: 8 },
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          className="!bg-transparent"
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              position: isMobile ? 'absolute' : 'fixed',
              top: `${toolbarHeight}px`,
              height: `calc(100% - ${toolbarHeight}px)`,
              zIndex: (theme) => theme.zIndex.appBar - 1,
            },
          }}
        >
          <SidebarContent onLinkClick={() => isMobile && toggleDrawer()} />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: 'auto', pt: 2 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
