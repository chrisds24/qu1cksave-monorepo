import { Context, createContext, ReactNode, useState } from "react";

// DeleteDialog-related contexts to open/close the delete dialog

export const DeleteJobIdContext: Context<any> = createContext(null);
export const SetDeleteJobIdContext: Context<any> = createContext(null);

export function DeleteJobIdProvider({ children } : { children: ReactNode }) {
  const [deleteJobId, setDeleteJobId] = useState<string>('');

  return (
    <DeleteJobIdContext.Provider value={deleteJobId}>
      <SetDeleteJobIdContext.Provider value={setDeleteJobId}>
        {children}
      </SetDeleteJobIdContext.Provider>
    </DeleteJobIdContext.Provider>
  );
}