'use client'

import { User } from '@/types/user';
import { access } from 'fs';
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
        console.log('id', id);
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
            alert('User not found.');
          });
      };
      fetchData();
    }
  }, []);
   
  // if (!user) {
  //   return;
  // } else {
  //   return (
  //     <h1>Hello {user.name}!</h1>
  //   );
  // }
  if (user) {
    return (
      <h1>Hello {user.name}!</h1>
    );
  }
}