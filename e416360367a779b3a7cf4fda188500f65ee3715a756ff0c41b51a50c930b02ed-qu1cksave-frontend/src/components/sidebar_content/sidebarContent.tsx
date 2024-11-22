'use client'
import styles from './sidebarContent.module.css';
import WorkIcon from '@mui/icons-material/Work';
import FolderIcon from '@mui/icons-material/Folder';
import BarChartIcon from '@mui/icons-material/BarChart';

const navItems = [
  {name: 'Jobs', icon: <WorkIcon sx={{color: '#ffffff', height: '24px'}}/>, route: 'jobs'},
  {name: 'Documents', icon: <FolderIcon sx={{color: '#ffffff', height: '24px'}}/>, route: 'documents'},
  {name: 'Statistics', icon: <BarChartIcon sx={{color: '#ffffff', height: '24px'}}/>, route: 'statistics'}
];

export default function SidebarContent(
  {currentPage} : {currentPage: string}
) {
  return (
    <>
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
      <ul className={styles['nav-item-list']}>
        {navItems.map((navItem) => 
          <a href={`/${navItem.route}`}>
            <li key={`${navItem.name} Nav`}>
              <div className={
                `${styles['nav-item-container']}
                ${currentPage === navItem.name ?
                  styles['selected'] :
                  ''
                }
                `
              }>
                <div className={styles['nav-item-logo-container']}>
                  {navItem.icon}
                </div>
                <div className={styles['nav-item-text-container']}>
                  <p>
                    {navItem.name}
                  </p>
                </div>
              </div>
            </li>
          </a>
        )}
      </ul>
    </>
  )
}