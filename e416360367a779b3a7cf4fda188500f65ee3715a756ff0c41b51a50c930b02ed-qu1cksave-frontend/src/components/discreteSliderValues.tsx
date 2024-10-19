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
  
  // TODO: Remove this if the other way works
  // const changeJobsPerPage: any = (event: React.ChangeEvent<unknown>, jobsPerPageVal: number) => {
  //   setJobsPerPage(jobsPerPageVal);
  // };

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
            // onChange={changeJobsPerPage} // TODO: Remove if other way works
            onChange={
              (event: Event, jobsPerPageVal: number | number[]) =>
                setJobsPerPage(jobsPerPageVal)                             
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