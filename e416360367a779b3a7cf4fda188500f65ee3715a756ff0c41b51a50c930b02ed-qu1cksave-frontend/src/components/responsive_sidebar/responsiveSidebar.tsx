'use client'
import { Dispatch, SetStateAction, useState } from 'react';
import styles from './responsiveSidebar.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import SidebarContent from '../sidebar_content/sidebarContent';
import { User } from '@/types/user';

// Needed to move this to own component since I need to pass currentPage to it,
// but I didn't want to define it inside the ResponsiveSidebar code below.
// const sidebarContent = ... ;

export default function ResponsiveSidebar(
  {
    currentPage,
    sessionUserName,
    setSessionUser
  } :
  {
    currentPage: string,
    sessionUserName: string | undefined,
    setSessionUser: Dispatch<SetStateAction<User | undefined>>
  }
) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileSidebarDisplay = mobileOpen ? 'mobile-open' : 'mobile-closed';
  const backdropDisplay = mobileOpen ? '': 'backdrop-closed';

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
        {/* {sidebarContent} */}
        <SidebarContent
          currentPage={currentPage}
          sessionUserName={sessionUserName}
          setSessionUser={setSessionUser}
        />
      </div>
      {/* "Mobile" sidebar when breakpoint is below md. */}
      <div className={
        `${styles['sidebar']} ${styles['sidebar-mobile']}
        ${styles[mobileSidebarDisplay]}`
      }>
        <SidebarContent
          currentPage={currentPage}
          sessionUserName={sessionUserName}
          setSessionUser={setSessionUser}
        />
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