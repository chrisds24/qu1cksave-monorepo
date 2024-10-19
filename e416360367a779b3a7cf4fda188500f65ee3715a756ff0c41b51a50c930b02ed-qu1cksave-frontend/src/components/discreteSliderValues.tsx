import { JobsContext } from "@/app/(main)/jobs/layout";
import { Box, Slider, Typography } from "@mui/material";
import { useContext } from "react";
import DiscreteSliderValuesSkeleton from "./skeleton/discreteSliderValuesSkeleton";
import applyFilters from "@/lib/applyFilters";

function valuetext(value: number) {
  return `${value}`;
}

export default function DiscreteSliderValues() {
  const {
    // Jobs per page
    jobsPerPage,
    setJobsPerPage,
    // Page related
    page,
    setPage,
    // Jobs
    jobs,
    // Filters
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
    postedFilter,
    // Loading state
    jobsLoading
  } = useContext(JobsContext);

  const filteredJobs = jobs?.length > 0 ? applyFilters(
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
  ) : [];
  
  // const changeJobsPerPage = (event: Event, jobsPerPageVal: number | number[]) => {
  // Using this instead of the commented code above so we can divide by jobsPerPageVal
  const changeJobsPerPage: any = (event: React.ChangeEvent<unknown>, jobsPerPageVal: number) => {
    setJobsPerPage(jobsPerPageVal);

    // When jobsPerPage changes, the following also change:
    // 1.) jobsInPage (automatically done once state updates since jobs list
    //     re-renders)
    // 2.) page: If current page ends up higher than our last page due to the
    //     change in number of jobs per page, move to the new last page
    //     As a result of the page change, jobs shown in current page will be
    //     adjusted to the new last page
    // Important:
    // - Use jobsPerPageVal since jobsPerPage woudln't be updated yet
    //   We want to set lastPage based on the new jobsPerPage
    // - filteredJobs remains the same
    // - page needs to be set here so it's updated in the following render
    // - invalidEntry (to check if currently inputted pageToJumpTo is valid) is
    //   calculated in paginationSection

    // This section was originally just: lastPage = Math.ceil(filteredJobs.length / jobsPerPage)
    // This new code ensures that we don't divide by 0 and that the last page is at least 1
    let lastPage;
    if (filteredJobs.length === 0 || jobsPerPageVal === 0 || filteredJobs.length < jobsPerPageVal) {
      lastPage = 1; // Last page is at least 1
    } else {
      lastPage = Math.ceil(filteredJobs.length / jobsPerPageVal) 
    }

    // If we're at a page higher than our last page, go to the last page
    if (page > lastPage) {
      setPage(lastPage);
    }
  };

  // Ensures that the job slider's max doesn't go below 10
  const maxCount = filteredJobs.length < 10 ? 10 : filteredJobs.length;

  const marks = [
    { value: 10, label: '10' },
    { value: 30, label: '' },
    { value: 50, label: '' },
    { value: 100, label: ''},
    { value: 200, label: ''},
    { value: 500, label: ''},
    { value: 1000, label: ''},
    { value: 2000, label: ''},
    { value: maxCount, label: `${maxCount}`},
  ];

  if (!jobsLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Typography sx={{color: '#ffffff', paddingRight: 2, paddingTop: 0.5}}>
          {'Jobs Per Page: '}
        </Typography>
        <Box sx={{ width: 250, marginRight: '1vw' }}>
          <Slider
            aria-label="Restricted values"
            defaultValue={jobsPerPage}
            getAriaValueText={valuetext}
            step={null}
            valueLabelDisplay="auto"
            marks={marks}
            max={maxCount}
            sx={{
              color: '#ffffff', // color of the marks
              "& .MuiSlider-thumb": {
                backgroundColor: '#ffffff' // color of the selected value
              },
              "& .MuiSlider-rail": {
                color: '#2d2d30', // color of the rail
                opacity: 1
              },
              '& .MuiSlider-track': {
                color: "#ffffff"
              },
              '& .MuiSlider-markLabel': {
                color: "#ffffff"
              },
            }}
            onChange={changeJobsPerPage}
          />
        </Box>
      </Box>
    );
  } else {
    return (
      <DiscreteSliderValuesSkeleton />
    );
  }
}