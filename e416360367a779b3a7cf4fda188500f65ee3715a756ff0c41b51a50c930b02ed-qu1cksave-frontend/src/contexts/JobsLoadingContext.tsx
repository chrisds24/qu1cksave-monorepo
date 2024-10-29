import { Context, createContext, ReactNode, useState } from "react";

export const JobsLoadingContext: Context<any> = createContext(null);
export const SetJobsLoadingContext: Context<any> = createContext(null);

export function JobsLoadingProvider({ children } : { children: ReactNode }) {
  // Jobs Loading
  // - Used to indicate if we're showing the skeleton for the jobs
  //   list or not.
  // - I could have made jobs be of type undefined | Jobs[], but
  //   a lot of things rely on jobs being an array. This achieves
  //   the same purpose w/o needing to change a lot of code.
  const [jobsLoading, setJobsLoading] = useState<boolean>(true); 

  return (
    <JobsLoadingContext.Provider value={jobsLoading}>
      <SetJobsLoadingContext.Provider value={setJobsLoading}>
        { children }
      </SetJobsLoadingContext.Provider>
    </JobsLoadingContext.Provider>
  );
}