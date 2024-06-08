import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext, useEffect, useState } from "react";
import { states } from "@/lib/states";
import { JobsContext } from "@/app/(main)/jobs/layout";
import applyFilters from "@/lib/applyFilters";
import sortJobs from "@/lib/sortJobs";

const statusList = ['Not Applied', 'Applied', 'Assessment', 'Interview', 'Job Offered', 'Accepted Offer', 'Declined Offer', 'Rejected', 'Ghosted', 'Closed'];

export default function Filters() {
  const {
    jobFilter,
    setJobFilter,
    companyFilter,
    setCompanyFilter,
    statusFilter,
    setStatusFilter,
    remoteFilter,
    setRemoteFilter,
    cityFilter,
    setCityFilter,
    stateFilter,
    setStateFilter,
    countryFilter,
    setCountryFilter,
    fromFilter,
    setFromFilter,
    setFilteredJobs,
    jobs,
    sortBy,
    sortIncreasing,
  } = useContext(JobsContext);

  const changeJobFilter = (event: any) => {
    setJobFilter(event.target.value as string);
  };

  const changeCompanyFilter = (event: any) => {
    setCompanyFilter(event.target.value as string);
  };

  const changeStatusFilter = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as string);
  };

  const changeRemoteFilter = (event: SelectChangeEvent) => {
    setRemoteFilter(event.target.value as string);
  };

  const changeCityFilter = (event: any) => {
    setCityFilter(event.target.value as string);
  };

  const changeStateFilter = (event: SelectChangeEvent) => {
    setStateFilter(event.target.value as string);
  };

  const changeCountryFilter = (event: any) => {
    setCountryFilter(event.target.value as string);
  };

  const changeFromFilter = (event: any) => {
    setFromFilter(event.target.value as string);
  };

  // When filters are applied, we need to sort again otherwise we lose
  // sorting (since the filters are applied to the non-filtered jobs
  // and a new list is returned).
  const apply = () => {
    setFilteredJobs(
      sortJobs(
        applyFilters(
          jobs,
          jobFilter,
          companyFilter,
          statusFilter,
          remoteFilter,
          cityFilter,
          stateFilter,
          countryFilter,
          fromFilter
        ),
        sortBy,
        sortIncreasing
      )
    );
  }

  const reset = () => {
    setJobFilter('');
    setCompanyFilter('');
    setStatusFilter('');
    setRemoteFilter('');
    setCityFilter('');
    setStateFilter('');
    setCountryFilter('');
    setFromFilter('');
  }

  return (
    <Box sx={{marginBottom: 3}}>
      {/* <Accordion defaultExpanded> */}
      <Accordion sx={{backgroundColor: '#111111'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color: '#ffffff'}} />}
          aria-controls="panel3-content"
          id="filters-header"
          sx={{color: '#ffffff', fontWeight: 'bold', fontSize: '19px'}}
        >
          Filters
        </AccordionSummary>
        <AccordionDetails>
          {/* Filters go here. */}
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2}}>
            <TextField
              id="jobFilter"
              name="jobFilter"
              label="Job Title"
              fullWidth
              variant="outlined"
              value={jobFilter}
              onChange={changeJobFilter}
              sx={{
                color: '#ffffff',
                input: {
                  color: '#ffffff'
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'solid #636369',
                },
                "& label": {
                  color: '#636369',
                },
                marginRight: 2
              }}
            />
            <TextField
              id="companyFilter"
              name="companyFilter"
              label="Company"
              fullWidth
              variant="outlined"
              value={companyFilter}
              onChange={changeCompanyFilter}
              sx={{
                // color: '#ffffff',
                input: {
                  color: '#ffffff'
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'solid #636369',
                },
                "& label": {
                  color: '#636369',
                },
              }}
            />
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: 2, justifyContent: 'space-between'}}>
            <FormControl sx={{minWidth: 90}}>
              <InputLabel sx={{color: '#636369'}} id="statusFilter-label">Status</InputLabel>
              <Select
                labelId="statusFilter-label"
                id="statusFilter"
                name="statusFilter"
                value={statusFilter}
                label="Status"
                onChange={changeStatusFilter}
                sx={{
                  color: '#ffffff',
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: 'solid #636369',
                  },
                }}
                inputProps={{
                  MenuProps: {
                    MenuListProps: {
                      sx: {
                        backgroundColor: '#000000',
                        color: '#ffffff'
                      }
                    }
                  }
                }}
              >
                <MenuItem value={''}>{'N/A'}</MenuItem>
                {statusList.map((status) => 
                  <MenuItem value={status}>{status}</MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl sx={{minWidth: 90}}>
              <InputLabel sx={{color: '#636369'}} id="remoteFilter-label">Remote</InputLabel>
              <Select
                labelId="remoteFilter-label"
                id="remoteFilter"
                name="remoteFilter"
                value={remoteFilter}
                label="Remote"
                onChange={changeRemoteFilter}
                sx={{
                  color: '#ffffff',
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: 'solid #636369',
                  },
                }}
                inputProps={{
                  MenuProps: {
                    MenuListProps: {
                      sx: {
                        // backgroundColor: '#1e1e1e',
                        backgroundColor: '#000000',
                        color: '#ffffff'
                      }
                    }
                  }
                }}
                // fullWidth
              >
                <MenuItem value={''}>{'N/A'}</MenuItem>
                <MenuItem value={'Remote'}>Remote</MenuItem>
                <MenuItem value={'Hybrid'}>Hybrid</MenuItem>
                <MenuItem value={'On-site'}>On-site</MenuItem>
              </Select>
            </FormControl>            
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2}}>
            <TextField
              id="cityFilter"
              name="cityFilter"
              label="City"
              variant="outlined"
              value={cityFilter}
              onChange={changeCityFilter}
              sx={{
                color: '#ffffff',
                input: {
                  color: '#ffffff'
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'solid #636369',
                },
                "& label": {
                  color: '#636369',
                },
                marginRight: 2,
              }}
            />  
            <FormControl sx={{minWidth: 90, marginRight: 2}}>
              <InputLabel sx={{color: '#636369'}} id="stateFilter-label">State</InputLabel>
              <Select
                labelId="stateFilter-label"
                id="stateFilter"
                name="stateFilter"
                placeholder="State"
                value={stateFilter}
                label="State"
                onChange={changeStateFilter}
                sx={{
                  color: '#ffffff',
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: 'solid #636369',
                  },
                }}
                inputProps={{
                  MenuProps: {
                    MenuListProps: {
                      sx: {
                        // backgroundColor: '#1e1e1e',
                        backgroundColor: '#000000',
                        color: '#ffffff'
                      }
                    }
                  }
                }}
                fullWidth
              >
                {Object.keys(states).map((state) => 
                  <MenuItem
                    value={state === 'N/A' ? states[state] : state}
                  >
                    {state}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              id="countryFilter"
              name="countryFilter"
              label="Country"
              variant="outlined"
              value={countryFilter}
              onChange={changeCountryFilter}
              sx={{
                color: '#ffffff',
                input: {
                  color: '#ffffff'
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'solid #636369',
                },
                "& label": {
                  color: '#636369',
                },
              }}
            />
          </Box>
          <TextField
            id="fromFilter"
            name="fromFilter"
            label="Posting Found From"
            placeholder="LinkedIn, Indeed, etc."
            variant="outlined"
            value={fromFilter}
            onChange={changeFromFilter}
            sx={{
              color: '#ffffff',
              input: {
                color: '#ffffff'
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: 'solid #636369',
              },
              "& label": {
                color: '#636369',
              },
              marginRight: 2,
              marginBottom: 2
            }}
          />
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={reset}>Reset</Button>
          <Button onClick={apply}>Apply</Button>
        </AccordionActions>
      </Accordion>
    </Box>
  );
}