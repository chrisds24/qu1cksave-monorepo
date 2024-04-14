'use client'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import WorkIcon from '@mui/icons-material/Work';
import FolderIcon from '@mui/icons-material/Folder';
import BarChartIcon from '@mui/icons-material/BarChart';
import Link from 'next/link';
import { getSessionUser, logout } from '@/actions/auth';
import { Context, ReactNode, createContext, useEffect, useState } from 'react';
import { User } from '@/types/user';

const drawerWidth = 180;

const navItems = [
  {name: 'Jobs', icon: <WorkIcon sx={{color: '#ffffff'}}/>, route: 'jobs'},
  {name: 'Documents', icon: <FolderIcon sx={{color: '#ffffff'}}/>, route: 'documents'},
  {name: 'Statistics', icon: <BarChartIcon sx={{color: '#ffffff'}}/>, route: 'statistics'}
]

export const SessionUserContext: Context<any> = createContext(null);

export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [sessionUser, setSessionUser] = useState<User>();

  useEffect(() => {
    const getSession = async () => {
      // Get user from session in cookies
      // NOTE: This isn't an API call, so it's fine to use Server Actions
      //   which are POST requests by default
      await getSessionUser()
        .then(async (sesUser) => {
          if (sesUser) {
            setSessionUser(sesUser);
          }
        })
    };
    getSession();
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#1e1e1e',
        height: 64 // The Toolbar that MUI uses to add the space has height 64
      }}>
        <img
          height={56}
          width={'auto'}
          src="/qu1cksave_darkgray_bg.png"
          alt="qu1cksave logo"
          style={{marginTop: 4}}
        />
      </Box>   
      {/* <Divider /> */}
      <List>
        {navItems.map((navItem) => (
          <Link key={navItem.name} href={`/${navItem.route}`}>
            <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {navItem.icon}
                  </ListItemIcon>
                  <ListItemText primary={navItem.name} sx={{ color: '#ffffff' }}/>
                </ListItemButton>
            </ListItem>
          </Link>
        ))}
        <ListItem key={'sessionUser'} disablePadding>
            <ListItemText primary={sessionUser ? sessionUser.name : ''} sx={{ color: '#ffffff' }}/>
        </ListItem>
        <ListItem key={'logout'} disablePadding>
          <ListItemButton onClick={() => {
            logout();
            setSessionUser(undefined);
          }}>
            <ListItemText primary={'Logout'} sx={{ color: '#ffffff' }}/>
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: { sm: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            qu1cksave
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          PaperProps={{
            sx: {
              backgroundColor: '#1e1e1e',
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
          PaperProps={{
            sx: {
              backgroundColor: '#1e1e1e',
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <SessionUserContext.Provider value={{ sessionUser }}>
          {children}
        </SessionUserContext.Provider>
      </Box>
    </Box>
  );
}