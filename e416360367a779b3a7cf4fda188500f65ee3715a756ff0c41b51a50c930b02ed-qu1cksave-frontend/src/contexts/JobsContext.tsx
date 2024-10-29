import { Job } from "@/types/job";
import { Context, createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react";
import { SessionUserIdContext } from "./SessionUserIdContext";
import { SetJobsLoadingContext } from "./JobsLoadingContext";

export const JobsContext: Context<any> = createContext(null);
export const JobsDispatchContext: Context<any> = createContext(null);

export function JobsProvider({ children } : { children: ReactNode }) {
  const sessionUserId = useContext(SessionUserIdContext);
  const setJobsLoading = useContext(SetJobsLoadingContext);

  // The reason for the undefined is when there's an error?
  // const [jobs, setJobs] = useState<Job[] | undefined>([]);
  const [jobs, dispatch] = useReducer(jobsReducer, []);

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
            dispatch({type: 'api call success', jobs: jobs});
            setJobsLoading(false);
          })
          .catch(() => {
            dispatch({type: 'api call error'});
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
      <JobsDispatchContext.Provider value={dispatch}>
        {children}
      </JobsDispatchContext.Provider>
    </JobsContext.Provider>
  );
}

function jobsReducer(jobs: Job[] | undefined, action: any): Job[] | undefined {
  switch (action.type) {
    case 'api call success': {
      return action.jobs;
    }
    case 'api call error': {
      return undefined;
    }
    case 'added': {
      return [...(jobs as Job[]), action.job]
    }
    case 'edited': {
      let newJobs = (jobs as Job[]).filter((j) => j.id !== action.job.id);
      newJobs.push(action.job);
      return newJobs;
    }
    case 'deleted': {
      return (jobs as Job[]).filter((j) => j.id !== action.jobId);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}