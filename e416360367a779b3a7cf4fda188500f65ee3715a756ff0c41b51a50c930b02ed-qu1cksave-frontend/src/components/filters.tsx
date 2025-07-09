import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ChangeEvent, useContext, useMemo, useState } from "react";
import { states } from "@/lib/states";
import { QuickStats, YearMonthDateFilter } from "@/types/common";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import YearOnlyDatePicker from "./yearOnlyDatePicker";
import MonthOnlyDatePicker from "./monthOnlyDatePicker";
import getQuickStats from "@/lib/getQuickStats";
import { FiltersContext, SetFiltersContext } from "@/contexts/FiltersContext";
import { JobsContext } from "@/contexts/JobsContext";
import getFilteredJobs from "@/lib/getFilteredJobs";

const statusList = ['Not Applied', 'Applied', 'Assessment', 'Interview', 'Job Offered', 'Accepted Offer', 'Declined Offer', 'Rejected', 'Ghosted', 'Closed'];
const monthsList = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'} as any;

export default function Filters() {
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
  const {
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
    setPostedFilter    
  } = useContext(SetFiltersContext);
  const jobs = useContext(JobsContext);

  // These are the values for the filter related fields
  const [jobFilterField, setJobFilterField] = useState(jobFilter);
  const [companyFilterField, setCompanyFilterField] = useState(companyFilter);
  const [statusFilterField, setStatusFilterField] = useState(statusFilter);
  const [remoteFilterField, setRemoteFilterField] = useState(remoteFilter);
  const [cityFilterField, setCityFilterField] = useState(cityFilter);
  const [stateFilterField, setStateFilterField] = useState(stateFilter);
  const [countryFilterField, setCountryFilterField] = useState(countryFilter);
  const [fromFilterField, setFromFilterField] = useState(fromFilter);
  // Saved
  const [savedYearField, setSavedYearField] = useState<Dayjs | null>(
    savedFilter?.year ? dayjs().year(savedFilter.year) : null
  );
  const [savedMonthField, setSavedMonthField] = useState<Dayjs | null>(
    savedFilter?.month ? dayjs().month(savedFilter.month) : null
  );
  // Applied
  const [appliedYearField, setAppliedYearField] = useState<Dayjs | null>(
    appliedFilter?.year ? dayjs().year(appliedFilter.year) : null
  );
  const [appliedMonthField, setAppliedMonthField] = useState<Dayjs | null>(
    appliedFilter?.month ? dayjs().month(appliedFilter.month) : null
  );
  // Posted
  const [postedYearField, setPostedYearField] = useState<Dayjs | null>(
    postedFilter?.year ? dayjs().year(postedFilter.year) : null
  );
  const [postedMonthField, setPostedMonthField] = useState<Dayjs | null>(
    postedFilter?.month ? dayjs().month(postedFilter.month) : null
  );

  // Currently applied filters list
  const currentFilters = [
    {name: 'Job Title', val: jobFilter},
    {name: 'Company', val: companyFilter},
    {name: 'Status', val: statusFilter},
    {name: 'Remote', val: remoteFilter},
    {name: 'City', val: cityFilter},
    {name: 'State', val: stateFilter},
    {name: 'Country', val: countryFilter},
    {name: 'From', val: fromFilter},
    {name: 'Saved', val: savedFilter},
    {name: 'Applied', val: appliedFilter},
    {name: 'Posted', val: postedFilter}
  ];

  const filteredJobs = useMemo(
    () => getFilteredJobs(
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
      postedFilter 
    ]
  );

  // Memoizing filteredJobs then having it as a dependency here works.
  // See "Memoizing a dependency of another Hook"
  //   section of https://react.dev/reference/react/useMemo
  // const quickStats = useMemo(
  //   () => getQuickStats(filteredJobs),
  //   [filteredJobs]
  // );
  // However, it's not really needed since getQuickStats isn't expensive
  const quickStats = getQuickStats(filteredJobs);

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
      savedFilterVal['year'] = savedYearField?.year();
      savedFilterVal['month'] = savedMonthField?.month();
    }

    let appliedFilterVal: YearMonthDateFilter | null = null;
    if (appliedYearField || appliedMonthField) {
      appliedFilterVal = {};
      appliedFilterVal['year'] = appliedYearField?.year();
      appliedFilterVal['month'] = appliedMonthField?.month();
    }

    let postedFilterVal: YearMonthDateFilter | null = null;
    if (postedYearField || postedMonthField) {
      postedFilterVal = {};
      postedFilterVal['year'] = postedYearField?.year();
      postedFilterVal['month'] = postedMonthField?.month();
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
    setAppliedYearField(null);
    setAppliedMonthField(null);
    setPostedYearField(null);
    setPostedMonthField(null);
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
          Filters / Stats
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
              onChange={
                (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                  setJobFilterField(event.target.value as string)  
              }
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
              onChange={
                (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  setCompanyFilterField(event.target.value as string)        
              }
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
                onChange={
                  (event: SelectChangeEvent) => 
                    setStatusFilterField(event.target.value as string)              
                }
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
                  <MenuItem key={`${status} Status Filter`} value={status}>{status}</MenuItem>
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
                onChange={
                  (event: SelectChangeEvent) => {
                    setRemoteFilterField(event.target.value as string);
                  }                  
                }
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
                <MenuItem key={'No Job Type Filter'} value={''}>{'N/A'}</MenuItem>
                <MenuItem key={'Remote Job Type Filter'} value={'Remote'}>Remote</MenuItem>
                <MenuItem key={'Hybrid Job Type Filter'} value={'Hybrid'}>Hybrid</MenuItem>
                <MenuItem key={'On-site Job Type Filter'} value={'On-site'}>On-site</MenuItem>
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
              onChange={
                (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                  setCityFilterField(event.target.value as string)      
              }
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
                onChange={
                  (event: SelectChangeEvent) =>
                    setStateFilterField(event.target.value as string)                   
                }
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
                    key={`${state} State Filter`}
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
              onChange={
                (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  setCountryFilterField(event.target.value as string)               
              }
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
            onChange={
              (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setFromFilterField(event.target.value as string)        
            }
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
            <YearOnlyDatePicker id={'savedYearField'} name={'savedYearField'} val={savedYearField} setVal={setSavedYearField}/>
            <MonthOnlyDatePicker id={'savedMonthField'} name={'savedMonthField'} val={savedMonthField} setVal={setSavedMonthField}/>
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: 2}}>
            <Typography sx={{color: '#ffffff', paddingRight: 3, alignSelf: 'center'}}>
              {'Applied: '}
            </Typography>
            <YearOnlyDatePicker id={'appliedYearField'} name={'appliedYearField'} val={appliedYearField} setVal={setAppliedYearField}/>    
            <MonthOnlyDatePicker id={'appliedMonthField'} name={'appliedMonthField'} val={appliedMonthField} setVal={setAppliedMonthField}/>
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: 3}}>
            <Typography sx={{color: '#ffffff', paddingRight: 3, alignSelf: 'center'}}>
              {'Posted: '}
            </Typography>
            <YearOnlyDatePicker id={'postedYearField'} name={'postedYearField'} val={postedYearField} setVal={setPostedYearField}/>    
            <MonthOnlyDatePicker id={'postedMonthField'} name={'postedMonthField'} val={postedMonthField} setVal={setPostedMonthField}/>      
          </Box>
          {
            currentFilters?.length > 0 ?
              <Grid rowSpacing={1} columnSpacing={1} container direction='row' sx={{marginBottom: 3}}>
                {currentFilters.map((filter: any) => {
                  if (filter.val) {
                    if (filter.name === 'Saved' || filter.name === 'Applied' || filter.name === 'Posted') {
                      const year = filter.val.year;
                      const month = filter.val.month;
                      return (
                        <Grid item key={`Current Filter ${filter.name}`}>
                          <Chip
                            // Needed to add null case since Spring Boot backend has null for non existent values
                            // label={`${filter.name}: ${month !== undefined ? monthsList[month as keyof any] : ''} ${year ? year : ''}`}
                            label={`${filter.name}: ${!(month === undefined || month === null) ? monthsList[month as keyof any] : ''} ${year ? year : ''}`}
                            sx={{backgroundColor: '#1e1e1e', color: '#ffffff', fontSize: '16px'}}
                          />
                        </Grid>
                      );
                    } else {
                      return (
                        <Grid item key={`Current Filter ${filter.name}`} sx={{maxWidth: {xs: '70vw', md: '90%'}}}>
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
                {Object.keys(quickStats).map((stat: string) => {
                  return (
                    <Grid item key={`${stat} Stat`}>
                      <Typography sx={{fontSize: '17px', color: '#ffffff'}} display={'inline'}>
                        {`${stat}: `}
                      </Typography>
                      <Typography sx={{fontSize: '17px', fontWeight: 'bold', color: '#ce9178'}} display={'inline'}>
                        {`${quickStats[stat as keyof QuickStats]}`}
                      </Typography>
                    </Grid>
                  );                   
                })}
                <Grid item key={'Total Stat'}>
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