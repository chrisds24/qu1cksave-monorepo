'use client'

import { getSessionUser, logout } from '@/actions/auth';
import { User } from '@/types/user';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getSession = async () => {
      await getSessionUser()
        .then((user) => {
          if (user) {
            setUser(user);
          }
        })
    };
    getSession();
  }, []);

  const signout = async () => {
    await logout()
      .then(() => {
        router.push('/login');
      })
  };
   
  return (
    <>
      <h1>Hello {user ? user.name : ''}!</h1>
      <Button
        variant="contained"
        onClick={() => {
          signout();
        }}
      >
        Log Out
      </Button>
    </>
  );
}