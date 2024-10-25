'use client'

import { ReactNode, useContext, useEffect, useState } from "react";
import { SessionUserIdContext } from "@/contexts/SessionUserIdContext";
import { Job } from "@/types/job";
import { JobsContext, SetJobsContext } from "@/contexts/JobsContext";
import { JobsLoadingContext, SetJobsLoadingContext } from "@/contexts/JobsLoadingContext";
import { JobsLayoutProvider } from "@/contexts/JobsLayoutProvider";

export default function JobsLayout({
  children,
}: {
  children: ReactNode
}) {
  const sessionUserId = useContext(SessionUserIdContext);
  // The reason for the undefined is when there's an error?
  // Note: Moving jobs state here since the setter is needed here
  const [jobs, setJobs] = useState<Job[] | undefined>([]);

  // Jobs Loading
  // - Used to indicate if we're showing the skeleton for the jobs
  //   list or not.
  // - I could have made jobs be of type undefined | Jobs[], but
  //   a lot of things rely on jobs being an array. This achieves
  //   the same purpose w/o needing to change a lot of code.
  // Note: Moving jobsLoading state here since the setter is needed here
  const [jobsLoading, setJobsLoading] = useState<boolean>(true); 

  useEffect(() => {
    const getJobs = async () => {
      if (sessionUserId) {
        // Get all jobs for current user
        await fetch(`/api/job?id=${sessionUserId}`)
          .then((res) => {
            if (!res.ok) {
              throw res;
            }
            return res.json()
          })
          .then((jobs: Job[]) => {
            setJobs(jobs)
            setJobsLoading(false);
          })
          .catch(() => {
            setJobs(undefined)
            setJobsLoading(false);
            alert(`Error processing request.`)
          }) 
      }
    }
    getJobs();
  }, [sessionUserId]);
  // Important:
  // - For the sessionUser dependency above, think about the following:
  // - https://react.dev/learn/removing-effect-dependencies
  //   -- In "Move dynamic objects and functions inside your Effect", it talks
  //      about moving the creation of an object inside the effect.
  //   -- In my case, maybe I should just pass the sessionUser.id from
  //      (main)/layout.tsx
  // Solution: I changed it so that there's SessionUserIdContext instead of
  //   SessionUserContext

  return (
    <JobsContext.Provider value={jobs}>
      <SetJobsContext.Provider value={setJobs}>
        <JobsLoadingContext.Provider value={jobsLoading}>
          <SetJobsLoadingContext.Provider value={setJobsLoading}>
            <JobsLayoutProvider>
              { children }
            </JobsLayoutProvider>
          </SetJobsLoadingContext.Provider>
        </JobsLoadingContext.Provider>
      </SetJobsContext.Provider>
    </JobsContext.Provider>
  );
}