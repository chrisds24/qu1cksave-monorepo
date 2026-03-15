'use client'

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { ReactNode, useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SessionUserContext } from '@/contexts/SessionUserContext';
import ResponsiveSidebar from '@/components/responsive_sidebar/responsiveSidebar';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const drawerWidth = 180;

export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: ReactNode
}) {
  // Auth user from Firebase
  const [sessionUser, setSessionUser] = useState<User>();

  useEffect(() => {
    // Get current user by using an observer on auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSessionUser(user);
      } else {
        setSessionUser(undefined);
      }
    });

    // https://react.dev/learn/synchronizing-with-effects#subscribing-to-events
    // - If your Effect subscribes to something, the cleanup function should unsubscribe
    return () => unsubscribe();
  }, []); // Having sessionUser as a dependency causes an infinite effect call

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <ResponsiveSidebar
          sessionUserName={sessionUser?.displayName}
          // I won't need this. When I logout, I can just
          //   use the signOut function Firebase provides. This should update
          //   auth and onAuthStateChanged should automatically detect it and
          //   set sessionUser to null
          // setSessionUser={setSessionUser}
        />
        <Box
          component="main"
          sx={{ flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: '#1e1e1e',
            marginLeft: {xs: 0, md: `${drawerWidth}px`}
          }}
        >
          <Toolbar sx={{display: { xs: 'block', md: 'none' }}}/>
          <SessionUserContext.Provider value={ sessionUser }>
            {children}
          </SessionUserContext.Provider>
        </Box>
      </>
    </LocalizationProvider>
  );
}