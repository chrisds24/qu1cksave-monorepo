import { Job } from "@/types/job";
import { Context, createContext, ReactNode, useState } from "react";

// Dialog-related contexts to determine the job "passed" to the dialog

export const DialogJobContext: Context<any> = createContext(null);
export const SetDialogJobContext: Context<any> = createContext(null);

export function DialogJobProvider({ children } : { children: ReactNode }) {
  const [dialogJob, setDialogJob] = useState<Job | undefined>(undefined);

  return (
    <DialogJobContext.Provider value={dialogJob}>
      <SetDialogJobContext.Provider value={setDialogJob}>
        {children}
      </SetDialogJobContext.Provider>
    </DialogJobContext.Provider>
  );
}