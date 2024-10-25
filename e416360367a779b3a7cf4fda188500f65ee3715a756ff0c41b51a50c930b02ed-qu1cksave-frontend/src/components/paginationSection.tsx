import { Box, Button, Pagination, TextField } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import PaginationSectionSkeleton from "./skeleton/paginationSectionSkeleton";
import { JobsContext } from "@/contexts/JobsContext";
import { JobsPerPageContext } from "@/contexts/JobsPerPageContext";
import { JobsLoadingContext } from "@/contexts/JobsLoadingContext";
import { PageContext, SetPageContext } from "@/contexts/PageContext";
import { FiltersContext } from "@/contexts/FiltersContext";
import getFilteredJobs from "@/lib/getFilteredJobs";

export default function PaginationSection() {
  const jobs = useContext(JobsContext);
  const jobsPerPage = useContext(JobsPerPageContext);
  const jobsLoading = useContext(JobsLoadingContext);
  const page = useContext(PageContext);
  const setPage = useContext(SetPageContext);

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

  // Note: I want these in layout IF I want to preserve it in between
  //   renders. Though, I'll keep it here since I don't want that behavior.
  const [pageToJumpTo, setPageToJumpTo] = useState<number>();

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
  
  let lastPage;
  // This section was originally just: Math.ceil(filteredJobs.length / jobsPerPage)
  // This new code ensures that we don't divide by 0 and that there is at least 1 page
  if (filteredJobs.length === 0 || jobsPerPage === 0 || filteredJobs.length < jobsPerPage) {
    lastPage = 1; // Last page is at least 1
  } else {
    lastPage = Math.ceil(filteredJobs.length / jobsPerPage) 
  }

  let invalidEntry = false;
  if (pageToJumpTo !== undefined) { // If there's a page to jump to that has been set
    if (pageToJumpTo < 1 || pageToJumpTo > lastPage) {
      invalidEntry = true
    } else {
      invalidEntry = false
    }
  }

  const changePageToJumpTo = (event: React.ChangeEvent<unknown>) => {
    const eventVal = (event.target as HTMLInputElement).value;
    if (eventVal) { // If there's a page to jump to that has been set
      let pageVal = Number(eventVal);
      // if (pageVal < 1 || pageVal > lastPage) {
      //   setInvalidEntry(true);
      // } else {
      //   setInvalidEntry(false);
      // }
      setPageToJumpTo(pageVal);
    }
  };

  const jumpToPage = () => {
    if (pageToJumpTo && !invalidEntry) { // If there's a page to jump to that has been set
      setPage(pageToJumpTo);
    }
  };

  if (!jobsLoading) {
    return (
      // alignItems: 'center' is important when screen width at xs
      <Box sx={{ display: 'flex', flexDirection:  {xs: 'column', sm: 'row'}, alignItems: 'center'}}>
        <Pagination
          count={lastPage}
          page={page}
          onChange={
            (event: React.ChangeEvent<unknown>, pageVal: number) =>
              setPage(pageVal)
          }
          size={'large'}
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#ffffff',
              '&.Mui-selected': {
                background: '#2d2d30',
              },
            },
            '& .MuiPaginationItem-previousNext': {
              height: {xs: '30px', md: '40px'},
              minWidth: {xs: '30px', md: '40px'},
              maxWidth: {xs: '30px', md: '40px'},
            },
            '& .MuiPaginationItem-page': {
              height: {xs: '30px', md: '40px'},
              minWidth: {xs: '30px', md: '40px'},
              maxWidth: {xs: '30px', md: '40px'},
            },
            marginRight: {xs: -1, sm: 1},
            marginBottom: {xs: 2, sm: 0},
            marginLeft: {xs: -1, sm: -2}
          }}
        />
        <Box>
          <TextField
            id="jump-to-page"
            label="Page"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputProps: {
                min: 1,
                max: lastPage,
                step: "1" 
              },
              style: {
                height: '40px',
                width: '90px',
                color: '#ffffff',
              }
            }}
            onChange={changePageToJumpTo}
            sx={{
              marginBottom: {xs: 0, sm: 1},
              marginRight: 1,
              padding: '1px',
              "& .MuiOutlinedInput-notchedOutline": {
                border: 'solid #2d2d30',
              },
              "& label": {
                color: '#ffffff',
              }
            }}
            value={pageToJumpTo}
            error={invalidEntry}
            helperText={
              invalidEntry ?
              `Must be 1-${lastPage}` :
              ''
            }
          />
          <Button
            variant="contained"
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              height: '40px',
            }}
            onClick={jumpToPage}
          >
            Go
          </Button>
        </Box>
      </Box>    
    )
  } else {
    return (
      <PaginationSectionSkeleton />
    );
  }
}