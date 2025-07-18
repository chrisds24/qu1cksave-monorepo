import { Box, Slider, Typography } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import DiscreteSliderValuesSkeleton from "./skeleton/discreteSliderValuesSkeleton";
import { JobsPerPageContext, SetJobsPerPageContext } from "@/contexts/JobsPerPageContext";
import { PageContext, SetPageContext } from "@/contexts/PageContext";
import { JobsContext } from "@/contexts/JobsContext";
import { FiltersContext } from "@/contexts/FiltersContext";
import { JobsLoadingContext } from "@/contexts/JobsLoadingContext";
import getFilteredJobs from "@/lib/getFilteredJobs";
import applySearch from "@/lib/applySearch";
import { SearchInputContext } from "@/contexts/SearchInputContext";
import { SearchByContext } from "@/contexts/SearchByContext";
import { Job } from "@/types/job";
import { debounce } from "@/lib/debounce";

function valuetext(value: number) {
  return `${value}`;
}

function updateJobsPerPage(
  setJobsPerPage: any,
  newSliderVal: number,
  filteredJobs: Job[],
  page: number,
  setPage: any  
) {
  setJobsPerPage(newSliderVal);
            
  // When jobsPerPage changes, the following also change:
  // 1.) jobsInPage (automatically done once state updates since jobs list
  //     re-renders)
  // 2.) page: If current page ends up higher than our last page due to the
  //     change in number of jobs per page, move to the new last page
  //     As a result of the page change, jobs shown in current page will be
  //     adjusted to the new last page
  // Important:
  // - Use newSliderVal since sliderVal woudln't be updated yet
  //   We want to set lastPage based on the new sliderVal
  // - filteredJobs remains the same
  // - page needs to be set here so it's updated in the following render
  // - invalidEntry (to check if currently inputted pageToJumpTo is valid) is
  //   calculated in paginationSection

  // This section was originally just: lastPage = Math.ceil(filteredJobs.length / sliderVal)
  // This new code ensures that we don't divide by 0 and that the last page is at least 1
  let lastPage;
  if (filteredJobs.length === 0 || newSliderVal === 0 || filteredJobs.length < (newSliderVal as number)) {
    lastPage = 1; // Last page is at least 1
  } else {
    lastPage = Math.ceil(filteredJobs.length / (newSliderVal as number)) 
  }

  // If we're at a page higher than our last page, go to the last page
  if (page > lastPage) {
    setPage(lastPage);
  }
}

const debouncedUpdateJobsPerPage = debounce(updateJobsPerPage, 500);

export default function DiscreteSliderValues() {
  const jobsPerPage = useContext(JobsPerPageContext);
  const setJobsPerPage = useContext(SetJobsPerPageContext);
  const page = useContext(PageContext);
  const setPage = useContext(SetPageContext);
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
  const searchBy = useContext(SearchByContext);
  const jobsLoading = useContext(JobsLoadingContext);

  const [sliderVal, setSliderVal] = useState<number>(jobsPerPage);

  // Filtered jobs WITH search applied
  // Note: Search affects available pages since search affects the jobs that
  //   are to be shown, which obviously affects the total number of pages.
  //   So search is basically an additional filter on top of the already
  //   specified filters.
  const filteredJobs = useMemo(
    () => applySearch(
      getFilteredJobs(
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
      ),
      searchInput,
      searchBy
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
      postedFilter,
      searchInput,
      searchBy
    ]
  );

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
            // value={jobsPerPage}
            value={sliderVal}
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
            // onChange={changeJobsPerPage}
            onChange={
              (event, newSliderVal) => {
                setSliderVal(newSliderVal as number);
                debouncedUpdateJobsPerPage(
                  setJobsPerPage,
                  newSliderVal,
                  filteredJobs,
                  page,
                  setPage  
                );
              }
            }
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