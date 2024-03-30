'use client'

import { User } from '@/types/user';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const item = localStorage.getItem('user');
    if (!item) {
      router.push('/login');
    } else {
      const { id, accessToken } = JSON.parse(item as string)
      const fetchData = async () => {
        await fetch(`http://localhost:3010/api/v0/user/${id}`,{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw res;
            }
            return res.json();
          })
          .then((json) => {
            setUser(json);
          })
          .catch((err) => {
            // console.log(err);
            // TODO: Go to error page instead of an alert
            alert('User not found.');
          });
      };
      fetchData();
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(undefined);
    router.push('/login');
  };
   
  return (
    <>
      <h1>Hello {user ? user.name : ''}!</h1>
      <Button
        variant="contained"
        onClick={() => {
          logout();
        }}
      >
        Log Out
      </Button>
    </>
  );
}