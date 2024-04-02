'use client'

import { getSessionUser, logout } from '@/actions/auth';
import { User } from '@/types/user';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<User>();
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getSession = async () => {
      // Get user from session in cookies
      await getSessionUser()
        .then(async (sesUser) => {
          if (sesUser) {
            setSessionUser(sesUser);

            // Get current user from backend
            await fetch(`/api/user/${sesUser.id}`)
              .then((res) => {
                if (!res.ok) {
                  throw res;
                }
                return res.json()
              })
              .then((user: User) => {
                setUser(user)
              })
              .catch((err) => {
                alert('User not found.')
              })

            // Get all users
            await fetch(`/api/user`)
              .then((res) => {
                if (!res.ok) {
                  throw res;
                }
                return res.json()
              })
              .then((users: User[]) => {
                setUsers(users)
              })
              .catch((err) => {
                alert('Users collection not found.')
              })            
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
      <h1>Hello Session User: {sessionUser ? sessionUser.name : ''}!</h1>
      <h1>Hello User: {user ? user.name : ''}!</h1>
      <h1>Number of users: {users ? users.length : 'Users collection does not exist.'}</h1>
      <h1>List of users: </h1>
      <ul>
        {users.map((user) => {
          return (
            <li key={user.id}>
              {user.name}
            </li>
          )
        })}
      </ul>

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