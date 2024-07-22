import { JobsContext } from "@/app/(main)/jobs/layout";
import { Box, Slider, Typography } from "@mui/material";
import { useContext } from "react";
import DiscreteSliderValuesSkeleton from "./skeleton/discreteSliderValuesSkeleton";

function valuetext(value: number) {
  return `${value}`;
}

export default function DiscreteSliderValues() {
  const { filteredJobs, jobsPerPage, jobsLoading, setJobsPerPage } = useContext(JobsContext);
  // const allJobsCount = jobs.length;
  const filteredJobsCount = filteredJobs.length;
  
  const changeJobsPerPage: any = (event: React.ChangeEvent<unknown>, jobsPerPageVal: number) => {
    setJobsPerPage(jobsPerPageVal);
  };

  let maxCount;
  // Ensures that the job slider's max doesn't go below 10
  if (filteredJobsCount < 10) {
    maxCount = 10;
  } else {
    maxCount = filteredJobsCount
  }

  const marks = [
    { value: 10, label: '10' },
    { value: 30, label: '' },
    { value: 50, label: '' },
    { value: 100, label: ''},
    { value: 200, label: ''},
    { value: 500, label: ''},
    // { value: filteredJobsCount, label: `${filteredJobsCount}`},
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
            // defaultValue={10}
            defaultValue={jobsPerPage}
            getAriaValueText={valuetext}
            step={null}
            valueLabelDisplay="auto"
            marks={marks}
            // max={filteredJobsCount}
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