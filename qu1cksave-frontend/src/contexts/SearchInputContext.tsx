import { Context, createContext, ReactNode, useState } from "react";

export const SearchInputContext: Context<any> = createContext(null);
export const SetSearchInputContext: Context<any> = createContext(null);

export function SearchInputProvider({ children } : { children: ReactNode }) {
  const [searchInput, setSearchInput] = useState<string>('');

  return (
    <SearchInputContext.Provider value={searchInput}>
      <SetSearchInputContext.Provider value={setSearchInput}>
        {children}
      </SetSearchInputContext.Provider>
    </SearchInputContext.Provider>
  );
}