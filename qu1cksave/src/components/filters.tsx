import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext, useEffect, useState } from "react";
import { states } from "@/lib/states";
import { JobsContext } from "@/app/(main)/jobs/layout";
import applyFilters from "@/lib/applyFilters";
import sortJobs from "@/lib/sortJobs";
import { DatePicker } from "@mui/x-date-pickers";
import { YearMonthDateFilter } from "@/types/common";
import dayjs from "dayjs";

const statusList = ['Not Applied', 'Applied', 'Assessment', 'Interview', 'Job Offered', 'Accepted Offer', 'Declined Offer', 'Rejected', 'Ghosted', 'Closed'];
const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Filters() {
  const {
    // Filters
    setJobFilter,
    setCompanyFilter,
    setStatusFilter,
    setRemoteFilter,
    setCityFilter,
    setStateFilter,
    setCountryFilter,
    setFromFilter,
    setSavedFilter,
    setAppliedFilter,
    setPostedFilter,
    // Current filters
    currentFilters,
    // Filter fields
    jobFilterField,
    setJobFilterField,
    companyFilterField,
    setCompanyFilterField,
    statusFilterField,
    setStatusFilterField,
    remoteFilterField,
    setRemoteFilterField,
    cityFilterField,
    setCityFilterField,
    stateFilterField,
    setStateFilterField,
    countryFilterField,
    setCountryFilterField,
    fromFilterField,
    setFromFilterField,
    // Saved Filter Field
    savedYearField,
    setSavedYearField,
    savedMonthField,
    setSavedMonthField,
    savedDateField,
    setSavedDateField,
    // Applied Filter Field
    appliedYearField,
    setAppliedYearField,
    appliedMonthField,
    setAppliedMonthField,
    appliedDateField,
    setAppliedDateField,
    // Posted Filter Field
    postedYearField,
    setPostedYearField,
    postedMonthField,
    setPostedMonthField,
    postedDateField,
    setPostedDateField,
    // Sort
    sortBy,
    sortIncreasing,
    // Other
    filteredJobs,
    setFilteredJobs,
    jobs,
    quickStats
  } = useContext(JobsContext);

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
    let savedFilterVal: YearMonthDateFilter | null = null;
    if (savedYearField || savedMonthField) {
      savedFilterVal = {};
      if (savedYearField) savedFilterVal['year'] = dayjs(savedYearField as string).year();
      if (savedMonthField) savedFilterVal['month'] = dayjs(savedMonthField as string).month();
    }

    let appliedFilterVal: YearMonthDateFilter | null = null;
    if (appliedYearField || appliedMonthField) {
      appliedFilterVal = {};
      if (appliedYearField) appliedFilterVal['year'] = dayjs(appliedYearField as string).year();
      if (appliedMonthField) appliedFilterVal['month'] = dayjs(appliedMonthField as string).month();
    }

    let postedFilterVal: YearMonthDateFilter | null = null;
    if (postedYearField || postedMonthField) {
      postedFilterVal = {};
      if (postedYearField) postedFilterVal['year'] = dayjs(postedYearField as string).year();
      if (postedMonthField) postedFilterVal['month'] = dayjs(postedMonthField as string).month();
    }

    // Set the applied filters
    setJobFilter(jobFilterField)
    setCompanyFilter(companyFilterField)
    setStatusFilter(statusFilterField)
    setRemoteFilter(remoteFilterField)
    setCityFilter(cityFilterField)
    setStateFilter(stateFilterField)
    setCountryFilter(countryFilterField)
    setFromFilter(fromFilterField)
    setSavedFilter(savedFilterVal)
    setAppliedFilter(appliedFilterVal)
    setPostedFilter(postedFilterVal)

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
          fromFilterField,
          savedFilterVal,
          appliedFilterVal,
          postedFilterVal,
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
    setSavedYearField(null);
    setSavedMonthField(null);
    setSavedDateField(null);
    setAppliedYearField(null);
    setAppliedMonthField(null);
    setAppliedDateField(null);
    setPostedYearField(null);
    setPostedMonthField(null);
    setPostedDateField(null);
  }

  return (
    <Box sx={{marginBottom: 3}}>
      {/* <Accordion defaultExpanded> */}
      <Accordion sx={{backgroundColor: '#111111'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color: '#ffffff'}} />}
          aria-controls="panel3-content"
          id="filters-header"
          sx={{color: '#ffffff', fontWeight: 'bold', fontSize: '20px'}}
        >
          Filters / Quick Stats
        </AccordionSummary>
        <AccordionDetails>
          {/* Filters go here. */}
          <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 2}}>
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
          <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: 2}}>
            <FormControl sx={{minWidth: 90, marginRight: 2}}>
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
          <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 2}}>
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
              marginBottom: 3
            }}
          />
          <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: 2}}>
            <Typography sx={{color: '#ffffff', paddingRight: 3, alignSelf: 'center'}}>
              {'Saved: '}
            </Typography>
            {/* https://stackoverflow.com/questions/50556433/material-ui-datepicker-enable-only-year */}
            <DatePicker
              slotProps={{
                textField: {
                  id: 'savedYearField',
                  name: 'savedYearField',
                },
              }}  
              sx={{
                input: {
                  color: '#ffffff'
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'solid #636369',
                },
                "& label": {
                  color: '#636369',
                },
                "& .MuiButtonBase-root": {
                  color: '#636369',
                },
                marginRight: 2
              }}          
              label="Year"
              value={savedYearField}
              onChange={(val) => setSavedYearField(val)}
              views={["year"]}
            />
            <DatePicker
              slotProps={{
                textField: {
                  id: 'savedMonthField',
                  name: 'savedMonthField',
                },
                // https://stackoverflow.com/questions/74515452/mui-change-date-picker-header-elements-order
                calendarHeader: {
                  sx: {
                    "& .MuiPickersCalendarHeader-label": {
                      display: 'none'
                    }
                  }
                }
              }}  
              sx={{
                input: {
                  color: '#ffffff'
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'solid #636369',
                },
                "& label": {
                  color: '#636369',
                },
                "& .MuiButtonBase-root": {
                  color: '#636369',
                }
              }}          
              label="Month"
              value={savedMonthField}
              onChange={(val) => setSavedMonthField(val)}
              views={["month"]}
            />
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: 2}}>
            <Typography sx={{color: '#ffffff', paddingRight: 3, alignSelf: 'center'}}>
              {'Applied: '}
            </Typography>
            <DatePicker
              slotProps={{
                textField: {
                  id: 'appliedYearField',
                  name: 'appliedYearField',
                },
              }}  
              sx={{
                input: {
                  color: '#ffffff'
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'solid #636369',
                },
                "& label": {
                  color: '#636369',
                },
                "& .MuiButtonBase-root": {
                  color: '#636369',
                },
                marginRight: 2
              }}          
              label="Year"
              value={appliedYearField}
              onChange={(val) => setAppliedYearField(val)}
              views={["year"]}
            />
            <DatePicker
              slotProps={{
                textField: {
                  id: 'appliedMonthField',
                  name: 'appliedMonthField',
                },
                calendarHeader: {
                  sx: {
                    "& .MuiPickersCalendarHeader-label": {
                      display: 'none'
                    }
                  }
                }
              }}  
              sx={{
                input: {
                  color: '#ffffff'
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'solid #636369',
                },
                "& label": {
                  color: '#636369',
                },
                "& .MuiButtonBase-root": {
                  color: '#636369',
                }
              }}          
              label="Month"
              value={appliedMonthField}
              onChange={(val) => setAppliedMonthField(val)}
              views={["month"]}
            />
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: 3}}>
            <Typography sx={{color: '#ffffff', paddingRight: 3, alignSelf: 'center'}}>
              {'Posted: '}
            </Typography>
            <DatePicker
              slotProps={{
                textField: {
                  id: 'postedYearField',
                  name: 'postedYearField',
                },
              }}  
              sx={{
                input: {
                  color: '#ffffff'
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'solid #636369',
                },
                "& label": {
                  color: '#636369',
                },
                "& .MuiButtonBase-root": {
                  color: '#636369',
                },
                marginRight: 2
              }}          
              label="Year"
              value={postedYearField}
              onChange={(val) => setPostedYearField(val)}
              views={["year"]}
            />
            <DatePicker
              slotProps={{
                textField: {
                  id: 'postedMonthField',
                  name: 'postedMonthField',
                },
                calendarHeader: {
                  sx: {
                    "& .MuiPickersCalendarHeader-label": {
                      display: 'none'
                    }
                  }
                }
              }}  
              sx={{
                input: {
                  color: '#ffffff'
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'solid #636369',
                },
                "& label": {
                  color: '#636369',
                },
                "& .MuiButtonBase-root": {
                  color: '#636369',
                }
              }}          
              label="Month"
              value={postedMonthField}
              onChange={(val) => setPostedMonthField(val)}
              views={["month"]}
            />
          </Box>
          {
            currentFilters && currentFilters.length > 0 ?
              <Grid rowSpacing={1} columnSpacing={1} container direction='row' sx={{marginBottom: 3}}>
                {currentFilters.map((filter: any, idx: number) => {
                  if (filter.val) {
                    if (filter.name === 'Saved' || filter.name === 'Applied' || filter.name === 'Posted') {
                      const year = filter.val.year;
                      const month = filter.val.month;
                      const date = new Date(
                        year ? year : 0,
                        month ? month : 0
                      );
                      return (
                        <Grid item key={idx}>
                          <Chip
                            label={`${filter.name}: ${month ? monthsList[date.getMonth()] : ''} ${year ? date.getFullYear() : ''}`}
                            sx={{backgroundColor: '#1e1e1e', color: '#ffffff', fontSize: '16px'}}
                          />
                        </Grid>
                      );
                    } else {
                      return (
                        <Grid item key={idx}>
                          <Chip label={`${filter.name}: ${filter.val}`} sx={{backgroundColor: '#1e1e1e', color: '#ffffff', fontSize: '16px'}} />
                        </Grid>
                      );
                    }
                  }
                })}
              </Grid>
              :
              undefined       
          }

          {
            quickStats ?
              <Grid rowSpacing={1} columnSpacing={4} container direction='row'>
                {Object.keys(quickStats).map((stat: string, idx: number) => {
                  return (
                    <Grid item key={idx}>
                      <Typography sx={{fontSize: '17px', color: '#ffffff'}} display={'inline'}>
                        {`${stat}: `}
                      </Typography>
                      <Typography sx={{fontSize: '17px', fontWeight: 'bold', color: '#ce9178'}} display={'inline'}>
                        {`${quickStats[stat]}`}
                      </Typography>
                    </Grid>
                  );                   
                })}
                <Grid item key={'totalkey'}>
                  <Typography sx={{fontSize: '17px', color: '#ffffff'}} display={'inline'}>
                    {`Total: `}
                  </Typography>
                  <Typography sx={{fontSize: '17px', fontWeight: 'bold', color: '#ce9178'}} display={'inline'}>
                    {`${filteredJobs.length}`}
                  </Typography>                  
                </Grid>
              </Grid>
              :
              undefined       
          }
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={clear}>Clear</Button>
          <Button onClick={apply}>Apply</Button>
        </AccordionActions>
      </Accordion>
    </Box>
  );
}