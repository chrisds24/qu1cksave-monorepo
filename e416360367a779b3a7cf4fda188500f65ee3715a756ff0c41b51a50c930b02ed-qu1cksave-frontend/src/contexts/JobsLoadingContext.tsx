import { Context, createContext } from "react";

export const JobsLoadingContext: Context<any> = createContext(null);
export const SetJobsLoadingContext: Context<any> = createContext(null);

// Note: Moving state to jobs/layout.tsx sicne the setter is needed there