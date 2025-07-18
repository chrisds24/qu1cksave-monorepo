import { YearMonthDateFilter } from "@/types/common";
import { Context, createContext, ReactNode, useState } from "react";

export const FiltersContext: Context<any> = createContext(null);
export const SetFiltersContext: Context<any> = createContext(null);

export function FiltersProvider({ children } : { children: ReactNode }) {
  // Filters
  // Note: These are not the values for the fields in the filters component.
  const [jobFilter, setJobFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Dropdown
  const [remoteFilter, setRemoteFilter] = useState(''); // Dropdown
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState(''); // Dropdown
  const [countryFilter, setCountryFilter] = useState('');
  const [fromFilter, setFromFilter] = useState('');
  const [savedFilter, setSavedFilter]  = useState<YearMonthDateFilter | null>(null);
  const [appliedFilter, setAppliedFilter] = useState<YearMonthDateFilter | null>(null);
  const [postedFilter, setPostedFilter] = useState<YearMonthDateFilter | null>(null);

  return (
    <FiltersContext.Provider value={{
      jobFilter,
      companyFilter,
      statusFilter,
      remoteFilter,
      cityFilter,
      stateFilter,
      countryFilter,
      fromFilter,
      savedFilter,
      appliedFilter,
      postedFilter
    }}>
      <SetFiltersContext.Provider value={{
        setJobFilter,
        setCompanyFilter,
        setStatusFilter,
        setRemoteFilter,
        setCityFilter,
        setStateFilter,
        setCountryFilter,
        setFromFilter,
        setSavedFilter,
        setAppliedFilter,
        setPostedFilter
      }}>
        {children}
      </SetFiltersContext.Provider>
    </FiltersContext.Provider>
  );
}