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
import { ReactNode, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { Avatar, Skeleton } from '@mui/material';
import stringAvatar from '@/lib/stringAvatar';
import LogoutIcon from '@mui/icons-material/Logout';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { usePathname } from 'next/navigation';
import { SessionUserIdContext } from '@/contexts/SessionUserIdContext';

const drawerWidth = 180;

const navItems = [
  {name: 'Jobs', icon: <WorkIcon sx={{color: '#ffffff'}}/>, route: 'jobs'},
  {name: 'Documents', icon: <FolderIcon sx={{color: '#ffffff'}}/>, route: 'documents'},
  {name: 'Statistics', icon: <BarChartIcon sx={{color: '#ffffff'}}/>, route: 'statistics'}
]

export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [sessionUser, setSessionUser] = useState<User>();

  const pathname = usePathname();
  let currentPage;
  if (pathname.startsWith('/jobs')) {
    currentPage = 'Jobs';
  } else if (pathname.startsWith('/documents')) {
    currentPage = 'Documents';
  } else if (pathname.startsWith('/statistics')) {
    currentPage = 'Statistics';
  } else {
    currentPage = '';
  }

  useEffect(() => {
    const getSession = async () => {
      // Get user from session in cookies
      // It makes sense to always get the sessionUser to ensure that the
      //   session is still valid.
      // Note: getSessionUser does not perform an API call
      await getSessionUser()
        .then(async (sesUser) => {
          if (sesUser) {
            setSessionUser(sesUser);
          }
        })
    };
    getSession();
  }, []); // Having sessionUser as a dependency causes an infinite effect call

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
        backgroundColor: '#000000',
        height: 64 // The Toolbar that MUI uses to add the space has height 64
      }}>
        <Link href="/">
          <img
            height={56}
            width={'auto'}
            src="/qu1cksave_black_bg.png"
            alt="qu1cksave logo"
            style={{marginTop: 4}}
          />
        </Link>
      </Box>   
      <List>
        {navItems.map((navItem) => (
          <Link key={navItem.name} href={`/${navItem.route}`}>
            <ListItem
              disablePadding
              sx={{
                '&:hover': {
                  backgroundColor: '#171717',
                },
              }}
            >
                <ListItemButton>
                  <ListItemIcon>
                    {navItem.icon}
                  </ListItemIcon>
                  <ListItemText primary={navItem.name} sx={{ color: '#ffffff' }}/>
                </ListItemButton>
            </ListItem>
          </Link>
        ))}
        <ListItem
          key={'sessionUser'}
          disablePadding
          sx={{
            '&:hover': {
              backgroundColor: '#171717',
            },
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              {
                sessionUser?.name ?
                <Avatar {...stringAvatar(sessionUser.name)} /> :
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{bgcolor: '#4b4e50'}}
                />
              }
            </ListItemIcon>
            <ListItemText
              primary={
                sessionUser?.name ?
                sessionUser.name :
                <Skeleton
                  variant="text"                 
                  sx={{
                    bgcolor: '#4b4e50',
                    fontSize: '20px'
                  }}
                />
              }
              sx={{ color: '#ffffff', textOverflow: 'ellipsis' }}
              primaryTypographyProps={{ 
                style: {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
            }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={'logout'}
          disablePadding
          sx={{
            '&:hover': {
              backgroundColor: '#171717',
            },
          }}
        >
          <ListItemButton onClick={() => {
            logout();
            setSessionUser(undefined);
          }}>
            <ListItemIcon>
              <LogoutIcon sx={{color: '#ffffff'}}/>
            </ListItemIcon>
            <ListItemText primary={'Logout'} sx={{ color: '#ffffff' }}/>
          </ListItemButton>
        </ListItem>        
      </List>
    </div>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            display: { md: 'none' },
            backgroundColor: '#000000'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {currentPage}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="drawer options"
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
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            PaperProps={{
              sx: {
                backgroundColor: '#000000',
              }
            }}
            elevation={5}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              // display: { xs: 'none', sm: 'block' },
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
            PaperProps={{
              sx: {
                backgroundColor: '#000000',
              }
            }}
            elevation={5}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: '#1e1e1e',
          }}
        >
          <Toolbar sx={{display: { xs: 'block', md: 'none' }}}/>
          <SessionUserIdContext.Provider value={ sessionUser?.id }>
            {children}
          </SessionUserIdContext.Provider>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}