import { Context, createContext, ReactNode, useState } from "react";

// Dialog-related contexts to open/close the dialog

export const OpenContext: Context<any> = createContext(null);
export const SetOpenContext: Context<any> = createContext(null);

export function OpenProvider({ children } : { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <OpenContext.Provider value={open}>
      <SetOpenContext.Provider value={setOpen}>
        {children}
      </SetOpenContext.Provider>
    </OpenContext.Provider>
  );
}

// React TODO:
// - I don't think I want the current behavior where if the dialog is open in
//   the single job view and we press back to go to the jobs list view, the
//   dialog remains open.
// For dialog
// - Used by both jobs/page.tsx and jobs/[id]/page.tsx
// - Note that jobs/[id]/page.tsx is not a subroute of jobs/page.tsx
//   -- It is a subroute of jobs, which is why state is in the layout
//
// Should this be in the layout??? Maybe I could move it down?
// I can also probably return a cleanup function that calls handleClose so that
//   the dialog will close open leaving the current page.