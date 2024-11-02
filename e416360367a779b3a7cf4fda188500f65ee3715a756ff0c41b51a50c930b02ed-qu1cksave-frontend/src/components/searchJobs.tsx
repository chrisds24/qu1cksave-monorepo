import { FiltersContext } from "@/contexts/FiltersContext";
import { JobsContext } from "@/contexts/JobsContext";
import { SearchByContext, SetSearchByContext } from "@/contexts/SearchByContext";
import { SearchInputContext, SetSearchInputContext } from "@/contexts/SearchInputContext";
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

  // Note: Search suggestions are based on the filtered jobs.
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
        onInputChange={(event, newInputValue) => {
          setSearchInput(newInputValue);
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
            (event: SelectChangeEvent) =>
              setSearchBy(event.target.value as string)                   
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
                  // backgroundColor: '#1e1e1e',
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