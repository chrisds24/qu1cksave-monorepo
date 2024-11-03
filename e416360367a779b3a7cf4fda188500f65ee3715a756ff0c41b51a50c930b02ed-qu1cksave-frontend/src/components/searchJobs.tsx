import { FiltersContext } from "@/contexts/FiltersContext";
import { JobsContext } from "@/contexts/JobsContext";
import { JobsPerPageContext } from "@/contexts/JobsPerPageContext";
import { PageContext, SetPageContext } from "@/contexts/PageContext";
import { SearchByContext, SetSearchByContext } from "@/contexts/SearchByContext";
import { SearchInputContext, SetSearchInputContext } from "@/contexts/SearchInputContext";
import applySearch from "@/lib/applySearch";
import getFilteredJobs from "@/lib/getFilteredJobs";
import { states } from "@/lib/states";
import { Job } from "@/types/job";
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useContext, useMemo } from "react";

const jobProps = {
  'title': 'Title',
  'company_name': 'Company',
  'job_description': 'Description',
  'notes': 'Notes',
  'is_remote': 'Remote',
  'country': 'Country',
  'us_state': 'State',
  'city': 'City',
  'found_from': 'Found From'
} as any;

const specialOptions = {
  'job_description': [],
  'notes': [],
  'is_remote': ['Remote', 'Hybrid', 'On-site'],
  'us_state': Object.keys(states),
} as any;

function getSearchSuggestions(
  searchBy: string,
  filteredJobs: Job[]
): Array<string> {
  if (searchBy in specialOptions) {
    return specialOptions[searchBy];
  }

  // Get the all existing suggestions based on the specified searchBy option
  // Converting to a set then back to an array to remove duplicates
  return Array.from(new Set(filteredJobs.map(
    (job) => job[searchBy as keyof Job]
  ) as Array<string>));
}

export default function SearchJobs() {
  const jobs = useContext(JobsContext);
  const {
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
  } = useContext(FiltersContext);
  const searchInput = useContext(SearchInputContext);
  const setSearchInput = useContext(SetSearchInputContext);
  const searchBy = useContext(SearchByContext);
  const setSearchBy = useContext(SetSearchByContext);
  const jobsPerPage = useContext(JobsPerPageContext);
  const page = useContext(PageContext);
  const setPage = useContext(SetPageContext);

  // Note: Search suggestions are based on the filtered jobs (Without the
  //   search applied).
  const filteredJobs = useMemo(
    () => getFilteredJobs(
      jobs,
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
    ), [
      jobs,
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
    ]
  );

  // Note: We are passing the suggestions to the autocomplete based on the jobs
  //   that satisfy the filters and the chosen search by option. Then the
  //   autocomplete takes care of updating the shown suggestions as the
  //   search input is changed. As searchInput changes, this component
  //   re-renders. But we don't want to recalculate the search suggestions
  //   since those stay the same unless the filtered jobs (w/o search applied)
  //   or the search by option changes, so we utilize useMemo here.
  const searchSuggestions = useMemo(
    () => getSearchSuggestions(searchBy, filteredJobs),
    [searchBy, filteredJobs]
  );

  // https://stackoverflow.com/questions/72417636/cannot-read-properties-of-undefined-reading-label
  return (
    <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: 3}}>
      {/* https://mui.com/material-ui/react-autocomplete/#controlled-states */}
      <Autocomplete
        freeSolo
        inputValue={searchInput}
        onInputChange={(event, newSearchInput) => {
          setSearchInput(newSearchInput);

          // Get the the new filtered jobs after applying the search
          // Note: No need to re-apply the filters to recalculate the filtered
          //   jobs since only the search is changing.
          // We need this next state for the next render since we need to
          //   adjust the page in advance here in case our current page goes
          //   over the last page for the next render. 
          const searchedJobs = applySearch(
            filteredJobs,
            newSearchInput, // Notice how we're using the new searchInput
            searchBy
          );

          let lastPage;
          // Note that paginationSection and discreteSliderValues use filteredJobs
          //   since their filteredJobs have the search applied to it. The filteredJobs
          //   here do not.
          if (searchedJobs.length === 0 || jobsPerPage === 0 || searchedJobs.length < jobsPerPage) {
            lastPage = 1; // Last page is at least 1
          } else {
            lastPage = Math.ceil(searchedJobs.length / jobsPerPage);
          }

          // Changing the search input changes the jobs to be shown, which
          //   affects the total number of pages.
          // Therefore, we need to adjust the current page in advance as needed
          // If we're at a page higher than our last page, go to the last page
          if (page > lastPage) {
            setPage(lastPage);
          }
        }}
        id="search-jobs-autocomplete"
        options={searchSuggestions}
        getOptionLabel={(option) => option}
        sx={{ width: 300, marginRight: 2 }}
        renderInput={(params: any) => <TextField {...params} label="Search" />}
      />

      {/* Search By dropdown */}
      <FormControl sx={{minWidth: 90, marginRight: 2}}>
        <InputLabel sx={{color: '#636369'}} id="searchBy-label">Search By</InputLabel>
        <Select
          labelId="searchBy-label"
          id="searchBy"
          name="searchBy"
          placeholder="Search By"
          value={searchBy}
          label="Search By"
          onChange={
            (event: SelectChangeEvent) => {
              const newSearchBy = event.target.value as string;
              setSearchBy(newSearchBy);

              // Get the new filtered jobs with the applied search
              const searchedJobs = applySearch(
                filteredJobs,
                searchInput,
                newSearchBy // Notice how we're using the new search by option
              );

              let lastPage;
              // Note that paginationSection and discreteSliderValues use filteredJobs
              //   since their filteredJobs have the search applied to it. The filteredJobs
              //   here do not.
              if (searchedJobs.length === 0 || jobsPerPage === 0 || searchedJobs.length < jobsPerPage) {
                lastPage = 1; // Last page is at least 1
              } else {
                lastPage = Math.ceil(searchedJobs.length / jobsPerPage);
              }

              if (page > lastPage) {
                setPage(lastPage);
              }
            }                 
          }
          sx={{
            color: '#ffffff',
            "& .MuiOutlinedInput-notchedOutline": {
              border: 'solid #636369',
            },
          }}
          inputProps={{
            MenuProps: {
              MenuListProps: {
                sx: {
                  backgroundColor: '#000000',
                  color: '#ffffff'
                }
              }
            }
          }}
          fullWidth
        >
          {Object.keys(jobProps).map((jobProp) => 
            <MenuItem
              key={`Search By ${jobProps[jobProp]}`}
              value={jobProp}
            >
              {jobProps[jobProp]}
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};