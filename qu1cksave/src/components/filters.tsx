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

  // These are the values for the filter related fields
  const [jobFilterField, setJobFilterField] = useState('');
  const [companyFilterField, setCompanyFilterField] = useState('');
  const [statusFilterField, setStatusFilterField] = useState('');
  const [remoteFilterField, setRemoteFilterField] = useState('');
  const [cityFilterField, setCityFilterField] = useState('');
  const [stateFilterField, setStateFilterField] = useState('');
  const [countryFilterField, setCountryFilterField] = useState('');
  const [fromFilterField, setFromFilterField] = useState('');

  const changeJobFilter = (event: any) => {
    setJobFilterField(event.target.value as string);
  };

  const changeCompanyFilter = (event: any) => {
    setCompanyFilterField(event.target.value as string);
  };

  const changeStatusFilter = (event: SelectChangeEvent) => {
    setStatusFilterField(event.target.value as string);
  };

  const changeRemoteFilter = (event: SelectChangeEvent) => {
    setRemoteFilterField(event.target.value as string);
  };

  const changeCityFilter = (event: any) => {
    setCityFilterField(event.target.value as string);
  };

  const changeStateFilter = (event: SelectChangeEvent) => {
    setStateFilterField(event.target.value as string);
  };

  const changeCountryFilter = (event: any) => {
    setCountryFilterField(event.target.value as string);
  };

  const changeFromFilter = (event: any) => {
    setFromFilterField(event.target.value as string);
  };

  // - When filters are applied, we need to sort again otherwise we lose
  //   sorting (since the filters are applied to the non-filtered jobs
  //   and a new list is returned).
  // - This updates the applied filters so they can be used automatically
  //   whenever needed. Note that the call to applyFilters here uses the 
  //   values from the fields and not the applied filters so we don't have
  //   to wait for the state of the applied filters to update before updating
  //   the state for filteredJobs.
  const apply = () => {
    // TODO: Do any field value checks here

    // Set the applied filters
    setJobFilter(jobFilterField)
    setCompanyFilter(companyFilterField)
    setStatusFilter(statusFilterField)
    setRemoteFilter(remoteFilterField)
    setCityFilter(cityFilterField)
    setStateFilter(stateFilterField)
    setCountryFilter(countryFilterField)
    setFromFilter(fromFilterField)

    // Set the filtered jobs
    setFilteredJobs(
      sortJobs(
        applyFilters(
          jobs,
          jobFilterField,
          companyFilterField,
          statusFilterField,
          remoteFilterField,
          cityFilterField,
          stateFilterField,
          countryFilterField,
          fromFilterField
        ),
        sortBy,
        sortIncreasing
      )
    );
  }

  const clear = () => {
    setJobFilterField('');
    setCompanyFilterField('');
    setStatusFilterField('');
    setRemoteFilterField('');
    setCityFilterField('');
    setStateFilterField('');
    setCountryFilterField('');
    setFromFilterField('');
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
              value={jobFilterField}
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
              value={companyFilterField}
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
                value={statusFilterField}
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
                value={remoteFilterField}
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
              value={cityFilterField}
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
                value={stateFilterField}
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
              value={countryFilterField}
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
            value={fromFilterField}
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
          <Button onClick={clear}>Clear</Button>
          <Button onClick={apply}>Apply</Button>
        </AccordionActions>
      </Accordion>
    </Box>
  );
}