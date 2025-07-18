import { Context, createContext, ReactNode, useState } from "react";

export const SortIncreasingContext: Context<any> = createContext(null);
export const SetSortIncreasingContext: Context<any> = createContext(null);

export function SortIncreasingProvider({ children } : { children: ReactNode }) {
  const [sortIncreasing, setSortIncreasing] = useState(false);

  return (
    <SortIncreasingContext.Provider value={sortIncreasing}>
      <SetSortIncreasingContext.Provider value={setSortIncreasing}>
        {children}
      </SetSortIncreasingContext.Provider>
    </SortIncreasingContext.Provider>
  );
}