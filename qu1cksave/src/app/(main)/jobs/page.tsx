'use client'

import { useContext, useEffect } from "react";
import JobsList from "@/components/job/list";
import { Box, Button, Fab, Pagination, TextField, Typography } from "@mui/material";
import DiscreteSliderValues from "@/components/discreteSliderValues";
import { JobsContext } from "./layout";
import AddOrEditDialog from "@/components/addOrEditDialog";
import AddIcon from '@mui/icons-material/Add';
import Filters from "@/components/filters";
import SortOptions from "@/components/sortOptions";
import DeleteDialog from "@/components/deleteDialog";

export default function Page() {
  const {
    filteredJobs,
    page,
    setPage,
    jobsPerPage,
    setJobsPerPage,
    setJobsInPage,
    pageToJumpTo,
    setPageToJumpTo,
    invalidEntry,
    setInvalidEntry,
    setIsAdd,
    setDialogJob,
    setOpen
  } = useContext(JobsContext);

  // When page changes
  // - Set jobs shown once current page changes
  useEffect(() => {
    setJobsInPage(filteredJobs.slice(jobsPerPage * (page - 1), jobsPerPage * page));
  }, [page])

  // When jobsPerPage changes
  // When number of jobs per page change, the following also change:
  // 1.) Jobs shown in current page
  // 2.) The page, if current page ends up higher than our last page due to the
  //     change in number of jobs per page
  //     - As a result of the page change, jobs shown in current page changes 
  useEffect(() => {
    if (filteredJobs.length) { // So this doesn't trigger when jobs are still loading initially
      const lastPage = Math.ceil(filteredJobs.length / jobsPerPage)
      // If we're at a page higher than our last page, go to the last page
      // Will automatically update jobs shown in current page
      if (page > lastPage) {
        setPage(lastPage);
      } else { // Just change jobs shown in current page
        setJobsInPage(filteredJobs.slice(jobsPerPage * (page - 1), jobsPerPage * page));
      }

      // If there's a page to jump to that has been set, do the check below
      if (pageToJumpTo !== undefined) {
        if (pageToJumpTo < 1 || pageToJumpTo > lastPage) {
          setInvalidEntry(true);
        } else {
          setInvalidEntry(false);
        }
      }
    }
  }, [jobsPerPage])

  useEffect(() => {
    if (pageToJumpTo !== undefined) {
      const lastPage = Math.ceil(filteredJobs.length / jobsPerPage);
      if (pageToJumpTo < 1 || pageToJumpTo > lastPage) {
        setInvalidEntry(true);
      } else {
        setInvalidEntry(false);
      }
    }
  }, [pageToJumpTo]);

  const changePage = (event: React.ChangeEvent<unknown>, pageVal: number) => {
    setPage(pageVal);
  };

  const changeJobsPerPage = (event: React.ChangeEvent<unknown>, jobsPerPageVal: number) => {
    setJobsPerPage(jobsPerPageVal);
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

  return (
    <Box>
      <Filters />

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3}}>
        <SortOptions />
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Typography sx={{color: '#ffffff', paddingRight: 3, paddingTop: 0.5}}>
            {'Jobs Per Page: '}
          </Typography>
          <DiscreteSliderValues
            changeJobsPerPage={changeJobsPerPage}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 2.5 }}>
        <Pagination
          count={Math.ceil(filteredJobs.length / jobsPerPage)}
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
            marginRight: '1vw'
          }}
        />
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
              max: Math.ceil(filteredJobs.length / jobsPerPage),
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
            marginRight: '0.5vw',
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
            `Must be 1-${Math.ceil(filteredJobs.length / jobsPerPage)}` :
            ''
          }
        />
        <Button
          variant="contained"
          sx={{
            color: '#ffffff',
            backgroundColor: '#000000',
            height: '40px'
          }}
          onClick={jumpToPage}
        >
          Go
        </Button>
      </Box>

      <AddOrEditDialog />
      <DeleteDialog />

      <JobsList />

      <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '3vh' }}>
        <Pagination
          count={Math.ceil(filteredJobs.length / jobsPerPage)}
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
            marginRight: '1vw'
          }}
        />
        <TextField
          id="jump-to-page-bottom"
          label="Page"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputProps: {
              min: 1,
              max: Math.ceil(filteredJobs.length / jobsPerPage),
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
            marginRight: '0.5vw',
            padding: '1px',
            "& .MuiOutlinedInput-notchedOutline": {
              border: 'solid #2d2d30',
            },
            "& label": {
              color: '#ffffff',
            },
          }}
          value={pageToJumpTo}
          error={invalidEntry}
          helperText={
            invalidEntry ?
            `Must be 1-${Math.ceil(filteredJobs.length / jobsPerPage)}` :
            ''
          }
        />
        <Button
          variant="contained"
          sx={{
            color: '#ffffff',
            backgroundColor: '#000000',
            height: '40px'
          }}
          onClick={jumpToPage}
        >
          Go
        </Button>
      </Box>
      <Fab
        aria-label='add'
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          backgroundColor: '#2ea043',
          height: 80,
          width: 80,
          '&:hover': {
            backgroundColor: '#4ecc65',
          },
        }}
        onClick={
          () =>  {
            setIsAdd(true);
            setDialogJob(undefined);
            setOpen(true);
          }
        }
      >
        <AddIcon sx={{color: '#ffffff', height: 48, width: 48}} />
      </Fab>
    </Box>
  );
}