'use client'

import { Context, createContext, useContext, useEffect, useState } from "react";
import { SessionUserContext } from "../layout";
import { Job } from "@/types/job";
import JobsList from "@/components/job/list";
import { Box, Button, Pagination, TextField, Typography } from "@mui/material";
import DiscreteSliderValues from "@/components/discreteSliderValues";

export const JobsContext: Context<any> = createContext(null);

export default function Page() {
  const { sessionUser } = useContext(SessionUserContext);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [page, setPage] = useState<number>(1);
  const [jobsPerPage, setJobsPerPage] = useState<number>(10);
  const [jobsInPage, setJobsInPage] = useState<Job[]>([]);
  const [pageToJumpTo, setPageToJumpTo] = useState<number>();

  // TODO (Maybe): If I want an SPA experience where state is preserved, I
  //   could do all initial data fetches (Ex. getJobs) in the layout.
  //   See CSE 186 Asg 8: Pass hooks in Context
  //
  //   Although this doesn't make much sense since if a user decides to
  //   navigate away from the jobs page, then that means that they're done
  //   working with the jobs page in the meantime.
  //   
  //   Different story with jobs -> single job -> back to jobs.
  //   This is where we want to preserve the context in jobs.
  useEffect(() => {
    const getJobs = async () => {
      if (sessionUser) {
        // Get all jobs for current user
        await fetch(`/api/job?id=${sessionUser.id}`)
          .then((res) => {
            if (!res.ok) {
              throw res;
            }
            return res.json()
          })
          .then((jobs: Job[]) => {
            setJobs(jobs)
            setJobsInPage(jobs.slice(jobsPerPage * (page - 1), jobsPerPage * page));
          })
          .catch((err) => {
            alert(`Jobs collection for ${sessionUser.name} not found.`)
          }) 
      }
    }
    getJobs();
  }, [sessionUser]);

  // WHEN page CHANGES
  // - Set jobs shown once current page changes
  useEffect(() => {
    setJobsInPage(jobs.slice(jobsPerPage * (page - 1), jobsPerPage * page));
  }, [page])

  // WHEN jobsPerPage CHANGES
  // When number of jobs per page change, the following also change:
  // 1.) Jobs shown in current page
  // 2.) The page, if current page ends up higher than our last page due to the
  //     change in number of jobs per page
  //     - As a result of the page change, jobs shown in current page changes 
  useEffect(() => {
    if (jobs.length) { // So this doesn't trigger when jobs are still loading initially
      const lastPage = Math.ceil(jobs.length / jobsPerPage)
      // If we're at a page higher than our last page, go to the last page
      // Will automatically update jobs shown in current page
      if (page > lastPage) {
        setPage(lastPage);
      } else { // Just change jobs shown in current page
        setJobsInPage(jobs.slice(jobsPerPage * (page - 1), jobsPerPage * page));
      }

      // If there's a page to jump to that has been set, do the check below
      if (pageToJumpTo  && (pageToJumpTo > lastPage)) {
        setPageToJumpTo(lastPage);
      }
    }
  }, [jobsPerPage])

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
      const lastPage = Math.ceil(jobs.length / jobsPerPage);
      if (pageVal < 1) {
        pageVal = 1;
      } else if (pageVal > lastPage) {
        pageVal = lastPage;
      }
      setPageToJumpTo(pageVal);
    }
  };

  const jumpToPage = () => {
    if (pageToJumpTo) { // If there's a page to jump to that has been set
      setPage(pageToJumpTo);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '1.5vh'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Pagination
            count={Math.ceil(jobs.length / jobsPerPage)}
            page={page}
            onChange={changePage}
            // size={'large'}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#ffffff',
                '&.Mui-selected': {
                  background: '#2d2d30',
                },
              },
              alignSelf: 'center'
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
                max: Math.ceil(jobs.length / jobsPerPage),
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
              alignSelf: 'center'
            }}
            value={pageToJumpTo}
          />
          <Button
            variant="contained"
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              // width: '10px',
              height: '40px',
              alignSelf: 'center'
            }}
            onClick={jumpToPage}
          >
            Go
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Typography sx={{color: '#ffffff', paddingRight: 3, paddingTop: 0.5}}>
            {'Jobs Per Page: '}
          </Typography>
          <DiscreteSliderValues
            allJobsCount={jobs.length}
            changeJobsPerPage={changeJobsPerPage}
          />
        </Box>
      </Box>
      <JobsContext.Provider value={{ jobsInPage }}>
        <JobsList />
      </JobsContext.Provider>
      <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '3vh' }}>
        <Pagination
          count={Math.ceil(jobs.length / jobsPerPage)}
          page={page}
          onChange={changePage}
          // size={'large'}
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#ffffff',
              '&.Mui-selected': {
                background: '#2d2d30',
              },
            },
            alignSelf: 'center'
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
              max: Math.ceil(jobs.length / jobsPerPage),
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
        />
        <Button
          variant="contained"
          sx={{
            color: '#ffffff',
            backgroundColor: '#000000',
            // width: '10px',
            height: '40px',
            alignSelf: 'center'
          }}
          onClick={jumpToPage}
        >
          Go
        </Button>
      </Box>
    </Box>
  );
}