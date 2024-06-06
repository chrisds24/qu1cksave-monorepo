import { JobsContext } from "@/app/(main)/jobs/layout";
import { Box, Slider } from "@mui/material";
import { useContext } from "react";

function valuetext(value: number) {
  return `${value}`;
}

export default function DiscreteSliderValues(props: any) {
  const changeJobsPerPage = props.changeJobsPerPage;
  const { filteredJobs, jobsPerPage } = useContext(JobsContext);
  // const allJobsCount = jobs.length;
  const allJobsCount = filteredJobs.length;

  const marks = [
    { value: 10, label: '10' },
    { value: 30, label: '' },
    { value: 50, label: '' },
    { value: 100, label: ''},
    { value: 200, label: ''},
    { value: 500, label: ''},
    { value: allJobsCount, label: `${allJobsCount}`},
  ];
  
  return (
    <Box sx={{ width: 250, marginRight: '1vw' }}>
      <Slider
        aria-label="Restricted values"
        // defaultValue={10}
        defaultValue={jobsPerPage}
        getAriaValueText={valuetext}
        step={null}
        valueLabelDisplay="auto"
        marks={marks}
        max={allJobsCount}
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
  );
}