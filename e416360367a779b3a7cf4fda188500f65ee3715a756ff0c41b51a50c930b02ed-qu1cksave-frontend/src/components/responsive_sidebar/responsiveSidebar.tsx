'use client'
import { useState } from 'react';
import styles from './responsiveSidebar.module.css';
import MenuIcon from '@mui/icons-material/Menu';

const sidebarContent = <>
  <div className={styles['logo-container']}>
    <a href="/">
      <img
        src="/qu1cksave_black_bg.png"
        alt="qu1cksave logo"
        height="56px"
        className="qu1cksave-logo"
      />
    </a>
  </div>
  <div>
    TODO
  </div>
</>;

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
        {sidebarContent}
      </div>
      {/* "Mobile" sidebar when breakpoint is below md. */}
      <div className={
        `${styles['sidebar']} ${styles[mobileSidebarDisplay]}`
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