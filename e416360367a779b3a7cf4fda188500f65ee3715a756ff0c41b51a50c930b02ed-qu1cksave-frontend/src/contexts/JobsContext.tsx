import { Context, createContext } from "react";

export const JobsContext: Context<any> = createContext(null);
export const SetJobsContext: Context<any> = createContext(null);

// Note: Moving jobs state to jobs/layout.tsx since the setter is needed there
// export function JobsProvider({ children } : { children: ReactNode }) {
//   // The reason for the undefined is when there's an error?
//   const [jobs, setJobs] = useState<Job[] | undefined>([]);

//   return (
//     <JobsContext.Provider value={jobs}>
//       <SetJobsContext.Provider value={setJobs}>
//         {children}
//       </SetJobsContext.Provider>
//     </JobsContext.Provider>
//   );
// }