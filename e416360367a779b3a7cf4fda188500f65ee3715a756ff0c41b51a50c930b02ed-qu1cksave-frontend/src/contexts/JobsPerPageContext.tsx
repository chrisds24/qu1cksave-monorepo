import { Context, createContext, ReactNode, useState } from "react";

export const JobsPerPageContext: Context<any> = createContext(null);
export const SetJobsPerPageContext: Context<any> = createContext(null);

export function JobsPerPageProvider({ children } : { children: ReactNode }) {
  const [jobsPerPage, setJobsPerPage] = useState<number>(10);

  return (
    <JobsPerPageContext.Provider value={jobsPerPage}>
      <SetJobsPerPageContext.Provider value={setJobsPerPage}>
        {children}
      </SetJobsPerPageContext.Provider>
    </JobsPerPageContext.Provider>
  );
}