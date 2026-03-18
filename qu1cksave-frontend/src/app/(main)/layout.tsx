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

  // Before: login sets session in cookie. Get decoded user from cookie here
  // Now: Firebase login sets auth, which onAuthStateChanged listens to
  //   and gets the user from
  // Important: Need to make sure to not set sessionUser until email has been
  //   verified.
  // - When successfully logging in via Firebase, check there (in the frontend)
  //   if email has been verified. If not, signOut from Firebase so auth gets
  //   cleared.
  // - Here, don't set sessionUser until email is verified.
  // - Because of this, sessionUser and auth.currentUser won't
  //   always be the same until the email gets verified. Therefore, I should
  //   use sessionUser when I need auth.currentUser
  useEffect(() => {
    // Get current user by using an observer on auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
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
          // Passing user instead of sessionUser?.displayName so I can
          //   differentiate between the sessionUser not being set yet or the
          //   the user not having a displayName in Firebase
          sessionUser={sessionUser}
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