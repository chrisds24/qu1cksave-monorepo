'use client'

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { getSessionUser, logout } from '@/actions/auth';
import { ReactNode, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { usePathname } from 'next/navigation';
import { SessionUserIdContext } from '@/contexts/SessionUserIdContext';
import ResponsiveSidebar from '@/components/responsive_sidebar/responsiveSidebar';

const drawerWidth = 180;

export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: ReactNode
}) {
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <ResponsiveSidebar
          currentPage={currentPage}
          sessionUserName={sessionUser?.name}
          setSessionUser={setSessionUser}
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
          <SessionUserIdContext.Provider value={ sessionUser?.id }>
            {children}
          </SessionUserIdContext.Provider>
        </Box>
      </>
    </LocalizationProvider>
  );
}