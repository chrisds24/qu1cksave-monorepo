import { Context, createContext, ReactNode, useState } from "react";

// Dialog-related contexts to determine if adding or editing a job

export const IsAddContext: Context<any> = createContext(null);
export const SetIsAddContext: Context<any> = createContext(null);

export function IsAddProvider({ children } : { children: ReactNode }) {
  const [isAdd, setIsAdd] = useState(true);

  return (
    <IsAddContext.Provider value={isAdd}>
      <SetIsAddContext.Provider value={setIsAdd}>
        {children}
      </SetIsAddContext.Provider>
    </IsAddContext.Provider>
  );
}