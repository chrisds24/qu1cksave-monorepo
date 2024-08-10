'use server'

import { Job, NewJob } from "@/types/job";
import { cookies } from "next/headers";

export async function addOrEditJob(newJob: Partial<NewJob>, jobId: string | undefined): Promise<Job | undefined> {   
  const token = cookies().get("session")?.value; 
  if (!token) {
    return undefined;
  }

  // let fetchString = 'http://localhost:3010/api/v0/job';
  let fetchString = 'https://qu1cksave-backend.onrender.com/api/v0/job';
  if (jobId) { // In EDIT mode
    fetchString += `/${jobId}`;
  }

  // ISSUE (SOLVED): Getting 413 Payload Too Large (SOLVED)
  // Possible solutions
  // - https://nextjs.org/docs/app/api-reference/next-config-js/serverActions
  //   -- Set server actions bodySizeLimit in next.config.mjs (DIDN'T WORK)
  // - https://github.com/vercel/next.js/discussions/60270
  //   -- "For anyone reading this, I was with this problem for 1 month and
  //       turns out it was nginx settings and not NextJS. Just added
  //       client_max_body_size config and it worked!"
  // SOLVED
  // - Turns out it was coming from the express backend
  // - I set the limit to 2mb

  const job: Job | undefined = await fetch(fetchString, {
    method: jobId ? "PUT" : "POST",
    body: JSON.stringify(newJob),
    headers: {
      Authorization: 'Bearer ' + token,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json()
    })
    .catch((err) => {
      console.error(err);
      return undefined;
    })

  return job;
}