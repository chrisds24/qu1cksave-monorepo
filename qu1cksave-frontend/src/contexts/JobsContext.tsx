import { Job } from "@/types/job";
import { Context, createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react";
import { SessionUserContext } from "./SessionUserContext";
import { SetJobsLoadingContext } from "./JobsLoadingContext";

export const JobsContext: Context<any> = createContext(null);
export const JobsDispatchContext: Context<any> = createContext(null);

export function JobsProvider({ children } : { children: ReactNode }) {
  // No longer using sessionUserId since the Firebase token won't
  //   have it since the addition of FirebaseAuth. For conditionals that
  //   rely on sessionUserId, I'll use sessionUser instead
  const sessionUser = useContext(SessionUserContext);
  const setJobsLoading = useContext(SetJobsLoadingContext);

  const [jobs, dispatch] = useReducer(jobsReducer, []);

  useEffect(() => {
    const getJobs = async () => {
      // If there's a sessionUser, then a user is logged in
      //   to Firebase
      if (sessionUser) {
        // https://firebase.google.com/docs/reference/js/auth.user.md#usergetidtoken
        // Returns the current token if it has not expired or if it will not
        //   expire in the next five minutes. Otherwise, this will refresh
        //   the token and return a new one.
        const jwt = await sessionUser.getIdToken();
        // Get all jobs for current user
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v0/job`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
          .then((res) => {
            // When the Java backend encounters an exception, it goes to my
            //   custom exception handler that sets the status code depending
            //   on the exception and returns null (TEMPORARILY null for now)
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
  }, [sessionUser]);
  // Important:
  // - For the sessionUser dependency above, think about the following:
  // - https://react.dev/learn/removing-effect-dependencies
  //   -- In "Move dynamic objects and functions inside your Effect", it talks
  //      about moving the creation of an object inside the effect.
  //   -- In my case, maybe I should just pass the sessionUser.id from
  //      (main)/layout.tsx
  // Solution: I changed it so that there's SessionUserIdContext instead of
  //   SessionUserContext (Now SessionUserFirebaseUidContext)

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