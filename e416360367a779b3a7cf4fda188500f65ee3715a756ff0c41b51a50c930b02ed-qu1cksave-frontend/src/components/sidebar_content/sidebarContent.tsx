'use client'
import styles from './sidebarContent.module.css';
import WorkIcon from '@mui/icons-material/Work';
import FolderIcon from '@mui/icons-material/Folder';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { User } from '@/types/user';
import { Avatar, Skeleton } from '@mui/material';
import stringAvatar from '@/lib/stringAvatar';
import { logout } from '@/actions/auth';
import { Dispatch, SetStateAction } from 'react';

const navItems = [
  {name: 'Jobs', icon: <WorkIcon sx={{color: '#ffffff', height: '24px'}}/>, route: 'jobs'},
  {name: 'Documents', icon: <FolderIcon sx={{color: '#ffffff', height: '24px'}}/>, route: 'documents'},
  {name: 'Statistics', icon: <BarChartIcon sx={{color: '#ffffff', height: '24px'}}/>, route: 'statistics'}
];

export default function SidebarContent(
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
          <a href={`/${navItem.route}`} key={`${navItem.name} Nav`}>
            <li>
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
                  <p className={styles['nav-item-text']}>
                    {navItem.name}
                  </p>
                </div>
              </div>
            </li>
          </a>
        )}
        <li key={'Account Nav'}>
          <div className={
            `${styles['nav-item-container']}
            ${currentPage === 'Account' ?
              styles['selected'] :
              ''
            }
            `
          }>
            <div className={styles['nav-item-logo-container']}>
              {
                sessionUserName ?
                <Avatar {...stringAvatar(sessionUserName)} /> :
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
                  sessionUserName ?
                  sessionUserName :
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
          onClick={() => {
            logout();
            setSessionUser(undefined);
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
}