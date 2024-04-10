'use client'

import { getSessionUser, logout } from '@/actions/auth';
import { Job } from '@/types/job';
import { User } from '@/types/user';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<User>();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const getSession = async () => {
      // Get user from session in cookies
      // TODO: Maybe put this in layout?
      //   If in layout, need a way to pass this into jobs page
      //   Then have the sidebar in the layout as a component
      await getSessionUser()
        .then(async (sesUser) => {
          if (sesUser) {
            setSessionUser(sesUser);
              
            // Get all jobs for current user
            await fetch(`/api/job?id=${sesUser.id}`)
              .then((res) => {
                if (!res.ok) {
                  throw res;
                }
                return res.json()
              })
              .then((jobs: Job[]) => {
                setJobs(jobs)
              })
              .catch((err) => {
                alert(`Jobs collection for ${sesUser.name} not found.`)
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

      <h1>{sessionUser ? sessionUser.name : ''}'s Jobs: </h1>
      <ul>
        {jobs.map((job) => {
          return (
            <li key={job.id}>
              {`Job Title: ${job.title}`} <br />
              {`Company: ${job.company_name}`} <br />
              {`Status: ${job.job_status}`} <br />
              <br />
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