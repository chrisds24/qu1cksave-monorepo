'use client'

import { useContext, useEffect } from "react";
import JobsList from "@/components/job/list";
import { Box, Fab, Typography } from "@mui/material";
import DiscreteSliderValues from "@/components/discreteSliderValues";
import { JobsContext } from "./layout";
import AddOrEditDialog from "@/components/addOrEditDialog";
import AddIcon from '@mui/icons-material/Add';
import Filters from "@/components/filters";
import SortOptions from "@/components/sortOptions";
import DeleteDialog from "@/components/deleteDialog";
import PaginationSection from "@/components/paginationSection";

export default function Page() {
  const {
    filteredJobs,
    page,
    setPage,
    jobsPerPage,
    setJobsInPage,
    pageToJumpTo,
    setInvalidEntry,
    setIsAdd,
    setDialogJob,
    setOpen,
    jobs
  } = useContext(JobsContext);

  // React TODO:
  // - Unneeded effect
  // - Can just re-calculate jobsInPage in PaginationSection component
  // When page changes
  useEffect(() => {
    setJobsInPage(filteredJobs.slice(jobsPerPage * (page - 1), jobsPerPage * page));
  }, [page])

  // React TODO:
  // - Unneeded effect
  // - MOVE ALL THIS LOGIC to DiscreteSliderValues component
  // When jobsPerPage changes
  // When number of jobs per page change, the following also change:
  // 1.) Jobs shown in current page
  // 2.) The page, if current page ends up higher than our last page due to the
  //     change in number of jobs per page
  //     - As a result of the page change, jobs shown in current page changes 
  useEffect(() => {
    if (filteredJobs.length) { // So this doesn't trigger when jobs are still loading initially
      // -------------------
      // This "wrapped" section was originally just: lastPage = Math.ceil(filteredJobs.length / jobsPerPage)
      // This new code ensures that we don't divide by 0 and that the last page is at least 1
      let lastPage;
      if (filteredJobs.length === 0 || jobsPerPage === 0 || filteredJobs.length < jobsPerPage) {
        lastPage = 1; // Last page is at least 1
      } else {
        lastPage = Math.ceil(filteredJobs.length / jobsPerPage) 
      }
      // --------------------

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

  // React TODO:
  // - Unneeded effect
  // - MOVE ALL THIS LOGIC to pageToJumpTo
  useEffect(() => {
    if (pageToJumpTo !== undefined) {
      // -------------------
      // This "wrapped" section was originally just: lastPage = Math.ceil(filteredJobs.length / jobsPerPage)
      let lastPage;
      if (filteredJobs.length === 0 || jobsPerPage === 0 || filteredJobs.length < jobsPerPage) {
        lastPage = 1; // Last page is at least 1
      } else {
        lastPage = Math.ceil(filteredJobs.length / jobsPerPage) 
      }
      // --------------------
      if (pageToJumpTo < 1 || pageToJumpTo > lastPage) {
        setInvalidEntry(true);
      } else {
        setInvalidEntry(false);
      }
    }
  }, [pageToJumpTo]);

  if (jobs !== undefined) {
    return (
      <Box>
        <Filters />
  
        <Box sx={{ display: 'flex', flexDirection:  {xs: 'column', md: 'row'}, justifyContent: 'space-between', marginBottom: 3, alignItems: {xs: 'center', sm: 'flex-start'}}}>
          <SortOptions />
          <DiscreteSliderValues />
        </Box>
  
        <PaginationSection />
        <Box sx={{marginBottom: 2.5 }} />
  
        <AddOrEditDialog />
        <DeleteDialog />
  
        <JobsList />
  
        <Box sx={{marginTop: '3vh' }} />
        <PaginationSection />
  
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
  } else {
    return (
      <Box sx={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around'}}>
        <Box sx={{display: 'flex', height: '100%', width: '60%', flexDirection: 'row', alignItems: 'center'}}>
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Typography variant="h3" sx={{fontWeight: 'bold', color: '#ffffff'}}>
              An error occured. Please try again later.
            </Typography>
          </Box>
        </Box>
      </Box>
    );      
  }
}