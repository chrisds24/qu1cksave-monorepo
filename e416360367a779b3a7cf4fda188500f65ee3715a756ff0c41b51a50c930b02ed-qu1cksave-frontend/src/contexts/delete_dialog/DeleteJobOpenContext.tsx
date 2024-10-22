import { Context, createContext, ReactNode, useState } from "react";

// DeleteDialog-related contexts to open/close the delete dialog

export const DeleteJobOpenContext: Context<any> = createContext(null);
export const SetDeleteJobOpenContext: Context<any> = createContext(null);

export function DeleteJobOpenProvider({ children } : { children: ReactNode }) {
  const [deleteJobOpen, setDeleteJobOpen] = useState(false);

  return (
    <DeleteJobOpenContext.Provider value={deleteJobOpen}>
      <SetDeleteJobOpenContext.Provider value={setDeleteJobOpen}>
        {children}
      </SetDeleteJobOpenContext.Provider>
    </DeleteJobOpenContext.Provider>
  );
}

// React TODO:
// - Same idea as for the addOrEditDialog
// - Do I move these states down or not?