'use server'

import { Job, NewJob } from "@/types/job";
import { cookies } from "next/headers";

export async function addOrEditJob(newJob: Partial<NewJob>, jobId: string | undefined): Promise<Job | undefined> {
  const token = cookies().get("session")?.value; 
  if (!token) {
    return undefined;
  }

  // let fetchString = 'http://localhost:3010/api/v0/job';
  // let fetchString = 'https://qu1cksave-backend.onrender.com/api/v0/job';
  let fetchString = `${process.env.BACKEND_URL}/api/v0/job`;
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
  // - Turns out it was coming from the Express backend
  // - I set the limit to 2mb

  // NOTE: The reason why I had to use Server Actions is because PUT/POST
  //   has a body size limit for Next.js, which I needed to set.
  //   - Though, the error mentioned above is from the Express backend
  const job: Job | undefined = await fetch(fetchString, {
    method: jobId ? "PUT" : "POST",
    body: JSON.stringify(newJob),
    headers: {
      Authorization: `Bearer ${process.env.API_KEY} ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      // The Express backend only sets the status code to an error for
      //   Unauthorized. Otherwise, it simply returns undefined when other
      //   errors happen. Calling res.json() should trigger the catch block
      // When the Express API returns undefined, res and/or res.body isn't
      //   actually undefined. But res.json throws SyntaxError: Unexpected
      //   end of JSON input
      // NOTE: The Spring Boot API returns null instead but sets the status
      //   code to not ok, so we still go to the catch block like we used to
      //   in the Express version.
      if (!res.ok) {
        throw res;
      }
      return res.json()
    })
    .catch((err) => {
      // console.error(err);
      return undefined;
    })

  return job;
}