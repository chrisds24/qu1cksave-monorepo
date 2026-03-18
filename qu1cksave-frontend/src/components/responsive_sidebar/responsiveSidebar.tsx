'use client'
import { useState } from 'react';
import styles from './responsiveSidebar.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import { usePathname, useRouter } from 'next/navigation';
import WorkIcon from '@mui/icons-material/Work';
import FolderIcon from '@mui/icons-material/Folder';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Skeleton } from '@mui/material';
import stringAvatar from '@/lib/stringAvatar';
import { removeCookieAndGoToLoginPage } from '@/actions/auth';
import { signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const navItems = [
  {name: 'Jobs', icon: <WorkIcon sx={{color: '#ffffff', height: '24px'}}/>, route: 'jobs'},
  {name: 'Documents', icon: <FolderIcon sx={{color: '#ffffff', height: '24px'}}/>, route: 'documents'},
  {name: 'Statistics', icon: <BarChartIcon sx={{color: '#ffffff', height: '24px'}}/>, route: 'statistics'}
];

export default function ResponsiveSidebar(
  {
    sessionUser
  } :
  {
    sessionUser: User | undefined
  }
) {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileSidebarDisplay = mobileOpen ? 'mobile-open' : 'mobile-closed';
  const backdropDisplay = mobileOpen ? '': 'backdrop-closed';

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

  // MUI defines the drawer (sidebar content) inside the component too for its
  //   responsive drawer
  const sidebarContent = (
    <>
      <div className={styles['logo-container']}>
        {/* 
          Note: Don't use Link or a tag to wrap this. It causes the whole page
          to reload. Just use router.push like I did below
        */}
        <img
          src="/qu1cksave_black_bg.png"
          alt="qu1cksave logo"
          height="56px"
          className="qu1cksave-logo"
          onClick={() => router.push('/')}
        />
      </div>
      <ul className={styles['nav-item-list']}>
        {navItems.map((navItem) => 
          <li key={`${navItem.name} Nav`}>
            <div 
              className={
                `${styles['nav-item-container']}
                ${currentPage === navItem.name ? styles['selected'] : ''}`
              }
              onClick={() => router.push(`/${navItem.route}`)}
            >
              <div className={styles['nav-item-logo-container']}>
                {navItem.icon}
              </div>
              <div className={styles['nav-item-text-container']}>
                <p className={styles['nav-item-text']}>
                  {navItem.name}
                </p>
              </div>
            </div>
          </li>
        )}
        <li key={'Account Nav'}>
          <div className={
            `${styles['nav-item-container']}
            ${currentPage === 'Account' ? styles['selected'] : ''}`
          }>
            <div className={styles['nav-item-logo-container']}>
              {
                // If no sessionUser, then onAuthStateChanged hasn't set
                //   one yet
                // - Remember that a user could possibly not have a
                //   displayName in Firebase if updateProfile fails during
                //   Firebase signup. In this case, use 'No Name'
                sessionUser ?
                <Avatar {...stringAvatar(
                  sessionUser.displayName ?
                  sessionUser.displayName :
                  'No Name'
                )} /> :
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{bgcolor: '#4b4e50'}}
                />                
              }
            </div>
            <div className={styles['nav-item-text-container']}>
              <p className={styles['nav-item-text']}>
                {
                  sessionUser ?
                  (sessionUser.displayName ? sessionUser.displayName : 'No Name'):
                  <Skeleton
                    variant="text"                 
                    sx={{
                      bgcolor: '#4b4e50',
                      fontSize: '20px',
                      width: '91px'
                    }}
                  />                  
                }
              </p>
            </div>
          </div>
        </li>
        <li
          key={`logout`}
          onClick={async () => {
            // Log out from Firebase
            await signOut(auth)
              .then(() => {
                // Remove session from cookie and redirect to login
                // - This is needed so I can use Next.js' way of deleting
                //   cookies easily and redirecting
                removeCookieAndGoToLoginPage();
                // Again, onAuthStateChanged should detect when signOut logs out
                //   the user so it can set sessionUser to undefined.
                // setSessionUser(undefined);
              })
              .catch(() => {
                alert('Error signing out.')
              });
          }}
        >
          <div className={styles['nav-item-container']}>
            <div className={styles['nav-item-logo-container']}>
              <LogoutIcon sx={{color: '#ffffff'}}/>
            </div>
            <div className={styles['nav-item-text-container']}>
              <p className={styles['nav-item-text']}>
                Logout
              </p>
            </div>
          </div>
        </li>
      </ul>
    </>
  )

  return (
    <>
      <div className={styles['navbar']}>
        <button
          className={styles['menu-button']}
          onClick={() => setMobileOpen(true)}
        >
          <MenuIcon />
        </button>
        <p className={styles['current-page-text']}>
          {currentPage}
        </p>
      </div>
      {/* Sidebar when breakpoint is md or above */}
      <div className={`${styles['sidebar']} ${styles['sidebar-wide']}`}>
        {sidebarContent}
      </div>
      {/* "Mobile" sidebar when breakpoint is below md. */}
      <div className={
        `${styles['sidebar']} ${styles['sidebar-mobile']}
        ${styles[mobileSidebarDisplay]}`
      }>
        {sidebarContent}
      </div>
      {/* Sidebar backdrop with open sidebar below md breakpoint. */}
      <div
        className={`
          ${styles['backdrop']} ${styles[backdropDisplay]}`}
        onClick={() => setMobileOpen(false)}
      />
    </>
  );
}