import { Context, createContext, ReactNode, useState } from "react";

export const SearchByContext: Context<any> = createContext(null);
export const SetSearchByContext: Context<any> = createContext(null);

export function SearchByProvider({ children } : { children: ReactNode }) {
  const [searchBy, setSearchBy] = useState<string>('title');

  return (
    <SearchByContext.Provider value={searchBy}>
      <SetSearchByContext.Provider value={setSearchBy}>
        {children}
      </SetSearchByContext.Provider>
    </SearchByContext.Provider>
  );
}