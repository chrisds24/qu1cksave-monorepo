import { Context, createContext, ReactNode, useState } from "react";

export const PageContext: Context<any> = createContext(null);
export const SetPageContext: Context<any> = createContext(null);

export function PageProvider({ children } : { children: ReactNode }) {
  const [page, setPage] = useState<number>(1);

  return (
    <PageContext.Provider value={page}>
      <SetPageContext.Provider value={setPage}>
        {children}
      </SetPageContext.Provider>
    </PageContext.Provider>
  );
}