import { JobsContext } from "@/app/(main)/jobs/layout";
import { Box, Button, Pagination, TextField } from "@mui/material";
import { useContext } from "react";
import PaginationSectionSkeleton from "./skeleton/paginationSectionSkeleton";

export default function PaginationSection() {
  const {
    filteredJobs,
    jobsPerPage,
    page,
    setPage,
    pageToJumpTo,
    setPageToJumpTo,
    invalidEntry,
    jobsLoading
  } = useContext(JobsContext);

  const changePage = (event: React.ChangeEvent<unknown>, pageVal: number) => {
    setPage(pageVal);
  };

  const changePageToJumpTo = (event: React.ChangeEvent<unknown>) => {
    const eventVal = (event.target as HTMLInputElement).value;
    if (eventVal) { // If there's a page to jump to that has been set
      let pageVal = Number(eventVal);
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
          count={
            // This section was originally just: Math.ceil(filteredJobs.length / jobsPerPage)
            // This new code ensures that we don't divide by 0 and that there is at least 1 page
            (filteredJobs.length === 0 || jobsPerPage === 0 || filteredJobs.length < jobsPerPage) ?
            1 :
            Math.ceil(filteredJobs.length / jobsPerPage)
          }
          page={page}
          onChange={changePage}
          size={'large'}
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#ffffff',
              '&.Mui-selected': {
                background: '#2d2d30',
              },
            },
            '& .MuiPaginationItem-previousNext': {
              height: {xs: '35px', md: '40px'},
              minWidth: {xs: '35px', md: '40px'},
              maxWidth: {xs: '35px', md: '40px'},
            },
            '& .MuiPaginationItem-page': {
              height: {xs: '35px', md: '40px'},
              minWidth: {xs: '35px', md: '40px'},
              maxWidth: {xs: '35px', md: '40px'},
            },
            marginRight: 1,
            marginBottom: {xs: 2, sm: 0},
            marginLeft: {xs: 0, sm: -2}
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
                max:
                  // This section was originally just: Math.ceil(filteredJobs.length / jobsPerPage)
                  (filteredJobs.length === 0 || jobsPerPage === 0 || filteredJobs.length < jobsPerPage) ?
                  1 :
                  Math.ceil(filteredJobs.length / jobsPerPage),
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
              `Must be 1-${
                  // This section was originally just: Math.ceil(filteredJobs.length / jobsPerPage)
                  (filteredJobs.length === 0 || jobsPerPage === 0 || filteredJobs.length < jobsPerPage) ?
                  1 :
                  Math.ceil(filteredJobs.length / jobsPerPage)
              }` :
              ''
            }
          />
          <Button
            variant="contained"
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              // Need min and max width instead of just width
              // maxWidth: '40px',
              // minWidth: '40px',
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