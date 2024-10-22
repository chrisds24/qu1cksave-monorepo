import { Context, createContext, ReactNode, useState } from "react";

export const SortByContext: Context<any> = createContext(null);
export const SetSortByContext: Context<any> = createContext(null);

export function SortByProvider({ children } : { children: ReactNode }) {
  const [sortBy, setSortBy] = useState('Date Saved');

  return (
    <SortByContext.Provider value={sortBy}>
      <SetSortByContext.Provider value={setSortBy}>
        {children}
      </SetSortByContext.Provider>
    </SortByContext.Provider>
  );
}