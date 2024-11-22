'use client'
import { useState } from 'react';
import styles from './responsiveSidebar.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import SidebarContent from '../sidebar_content/sidebarContent';

// Needed to move this to own component since I need to pass currentPage to it,
// but I didn't want to define it inside the ResponsiveSidebar code below.
// const sidebarContent = ... ;

export default function ResponsiveSidebar(
  {currentPage} : {currentPage: string}
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
        <SidebarContent currentPage={currentPage} />
      </div>
      {/* "Mobile" sidebar when breakpoint is below md. */}
      <div className={
        `${styles['sidebar']} ${styles['sidebar-mobile']}
        ${styles[mobileSidebarDisplay]}`
      }>
        <SidebarContent currentPage={currentPage} />
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