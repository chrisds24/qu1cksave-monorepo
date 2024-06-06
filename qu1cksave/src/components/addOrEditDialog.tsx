'use client'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { JobsContext } from "@/app/(main)/jobs/layout";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { states } from "@/lib/states";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import dayjs, {Dayjs} from 'dayjs'
import { NewJob } from "@/types/job";
import { YearMonthDate } from "@/types/common";
import compareDateSaved from "@/lib/applyFilters";
import applyFilters from "@/lib/applyFilters";

const statusList = ['Not Applied', 'Applied', 'Assessment', 'Interview', 'Job Offered', 'Accepted Offer', 'Declined Offer', 'Rejected', 'Ghosted', 'Closed'];

const createLink = (idx: number, val: string) => {
  return (
    <TextField
      id={`link${idx}`}
      name={`link${idx}`}
      label={`Link ${idx}`}
      placeholder={`Link ${idx}`}
      variant="outlined"
      defaultValue={val}
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
        marginBottom: 2,
        width: '50%'
      }}
    />
  );
}

export default function AddOrEditDialog() {
  const {open, setOpen, isAdd, setIsAdd, dialogJob, setDialogJob, jobs, setJobs} = useContext(JobsContext);

  const link1 = createLink(1, '');
  const existingLinks: JSX.Element[] = [];
  let applied: Date | undefined = undefined;
  let posted: Date | undefined = undefined;
  // !isAdd && dialogJob means we're in edit mode and the selected job is set
  if (!isAdd && dialogJob) {
    if (dialogJob.links) {
      const n = dialogJob.links.length;
      for (let i = 1; i < n + 1; i++) { // Start count at 1
        // i-1 since we count starting from 1
        existingLinks.push(createLink(i, dialogJob.links[i-1]))
      }
    }
    if (dialogJob.date_applied) {
      const dateApplied = dialogJob.date_applied;
      applied = dateApplied ? new Date(dateApplied.year, dateApplied.month, dateApplied.date) : undefined;
    }
    if (dialogJob.date_posted) {
      const datePosted = dialogJob.date_posted;
      posted = datePosted ? new Date(datePosted.year, datePosted.month, datePosted.date) : undefined;
    }
  }

  // If editing, fill in fields and set states based on selected job
  // const [remote, setRemote] = useState(!isAdd && dialogJob ? dialogJob.is_remote : 'Remote');
  // const [status, setStatus] = useState(!isAdd && dialogJob ? dialogJob.job_status : 'Not Applied');
  // const [state, setState] = useState(!isAdd && dialogJob && dialogJob.us_state ? dialogJob.us_state : '');
  // const [links, setLinks] = useState<JSX.Element[]>(!isAdd && dialogJob && dialogJob.links ? existingLinks : [link1]);
  const [remote, setRemote] = useState('Remote');
  const [status, setStatus] = useState('Not Applied');
  const [state, setState] = useState('');
  const [links, setLinks] = useState<JSX.Element[]>([link1]);

  useEffect(() => {
    if (!isAdd && dialogJob) {
      setRemote(dialogJob.is_remote)
      setStatus(dialogJob.job_status)
      if (dialogJob.us_state) setState(dialogJob.us_state)
      if (dialogJob.links) setLinks(existingLinks)
    }
  }, [isAdd, dialogJob]);

  const handleClose = () => {
    setOpen(false);
    setRemote('Remote');
    setStatus('Not Applied');
    setState('');
    setLinks([link1]);
    setDialogJob(undefined);
    setIsAdd(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // Add additional validation here to make sure that that required values are given.
    if (!(data.get('title') && data.get('company') && data.get('remote') && data.get('status'))) {
      alert('Please fill all required values.')
    }

    const newJob: Partial<NewJob> = {
      title: data.get('title') as string,
      company_name: data.get('company') as string,
      is_remote: data.get('remote') as string,
      job_status: data.get('status') as string
    };
    // for (const key of data.keys()) {  // Need downlevelIteration if using this
    //   ...
    // }
    // TODO: Refactor this. I might actually just resort to downlevelIteration
    if (data.get('description')) newJob['job_description'] = data.get('description') as string;
    if (data.get('notes')) newJob['notes'] = data.get('notes') as string;
    if (data.get('country')) newJob['country'] = data.get('country') as string;
    if (data.get('state')) newJob['us_state'] = data.get('state') as string;
    if (data.get('city')) newJob['city'] = data.get('city') as string;
    if (data.get('from')) newJob['found_from'] = data.get('from') as string;
    if (data.get('applied')) {
      const applied = data.get('applied');
      if (applied) {
        const appliedDayjs = dayjs(applied as string);
        newJob['date_applied'] = {
          year: appliedDayjs.year(),
          month: appliedDayjs.month(),
          date: appliedDayjs.date()
        } as YearMonthDate;
      }
    }
    if (data.get('posted')) {
      const posted = data.get('posted');
      if (posted) {
        const postedDayjs = dayjs(posted as string);
        newJob['date_posted'] = {
          year: postedDayjs.year(),
          month: postedDayjs.month(),
          date: postedDayjs.date()
        } as YearMonthDate;
      }
    }

    const linksList = []
    for (let i = 0; i < links.length; i++) {
      const link = data.get(`link${i+1}`);
      if (link) {
        linksList.push(link as string);
      }
    }
    newJob['links'] = linksList;

    let fetchString = '/api/job';
    if (!isAdd) {
      fetchString += `/${dialogJob.id}`;
    }
    await fetch(fetchString, {
      method: isAdd ? "POST" : "PUT",
      body: JSON.stringify(newJob),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((job) => {
        // Add this job to jobs, then set jobs
        let newJobs = [...jobs];
        if (!isAdd) {
          // When editing, remove the outdated job from the jobs list.
          newJobs = newJobs.filter((j) => j.id !== job.id);
        }

        newJobs.push(job)
        // NOTE: Whenever jobs is set, apply the filters
        //   For now, just sort by date saved (newest to oldest)
        setJobs(applyFilters(newJobs))
        // NOTE: The useEffect to automatically update jobsInPage when jobs
        //   changes is in job/page.tsx
        // NOTE: For some reason, the links are weird in the single job view.
        //   If I create link fields in the modal and set it to for example,
        //   a bunch of spaces. It creates a link to the single job page for
        //   the current job.
        //   (Turns out this is the case for anything that isn't a link)
      })
      .catch((err) => {
        console.error(err)
      });

    handleClose();
  };

  const changeRemote = (event: SelectChangeEvent) => {
    setRemote(event.target.value as string);
  };

  const changeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const changeState = (event: SelectChangeEvent) => {
    setState(event.target.value as string);
  };

  const addLink = () => {
    if (links.length < 10) {
      const link = createLink(links.length + 1, '')
      const newLinks = [...links];
      newLinks.push(link);
      setLinks(newLinks);
    } else {
      alert('Maximum number of links reached.')
    }
  };

  const removeLink = () => {
    if (links.length > 0) {
      const newLinks = [...links];
      newLinks.pop();
      setLinks(newLinks);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        // onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
        //   event.preventDefault();
        //   // Do stuff here
        //   handleClose();
        // },
        onSubmit: handleSubmit,
        sx: {
          backgroundColor: '#1e1e1e',
        }
      }}
      fullWidth
      maxWidth={'lg'}
    >
      <DialogTitle sx={{color: '#4fc1ff', fontWeight: 'bold', fontSize: '24px'}}>{isAdd ? 'Add Job': 'Edit Job'}</DialogTitle>
      <DialogContent>
        {/*
          DialogContentText is purposely empty. Needed so the first row of
          forms don't get cut off on the top.
        */}
        <DialogContentText sx={{color: '#ffffff', marginBottom: 2}}></DialogContentText>
        <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: 2, justifyContent: 'space-between'}}>
          <FormControl>
            <InputLabel sx={{color: '#636369'}} id="status-label">Status</InputLabel>
            <Select
              required
              labelId="status-label"
              id="status"
              name="status"
              value={status}
              label="Status"
              onChange={changeStatus}
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
              {statusList.map((status) => 
                <MenuItem value={status}>{status}</MenuItem>
              )}
            </Select>
          </FormControl>
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
            {/* TODO: When in edit mode, set values of date picker based on job to be edited. */}
            <DatePicker
              // Source:
              //   https://stackoverflow.com/questions/76767152/i-am-using-react-mui-mui-x-date-pickers-please-tell-me-how-to-change-color-of
              // This works, but I don't want to change the color
              // slotProps={{
              //   day: {
              //     sx: {
              //       "&.MuiPickersDay-root.Mui-selected": {
              //         backgroundColor: "#636369",
              //       },
              //     },
              //   },
              // }}  
              // https://stackoverflow.com/questions/74733138/unable-to-assign-name-or-id-to-datepicker-component-for-the-purpose-of-yup-valid 
              slotProps={{
                textField: {
                  id: 'applied',
                  name: 'applied',
                },
              }}     
              sx={{
                marginRight: 2,
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
              }}
              label="Date Applied"
              // https://stackoverflow.com/questions/75334255/how-to-convert-the-input-date-value-of-mui-datepicker
              defaultValue={!isAdd && applied ? dayjs(applied): null}
            />
            <DatePicker
              slotProps={{
                textField: {
                  id: 'posted',
                  name: 'posted',
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
                }
              }}          
              label="Date Posted"
              defaultValue={!isAdd && posted ? dayjs(posted): null}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2}}>
          <TextField
            required            
            id="title"
            name="title"
            label="Job Title"
            fullWidth
            variant="outlined"
            defaultValue={!isAdd && dialogJob ? dialogJob.title : ''}
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
            required
            id="company"
            name="company"
            label="Company"
            fullWidth
            variant="outlined"
            defaultValue={!isAdd && dialogJob ? dialogJob.company_name : ''}
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
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2}}>
          <FormControl>
            <InputLabel sx={{color: '#636369'}} id="remote-label">Remote</InputLabel>
            <Select
              required
              labelId="remote-label"
              id="remote"
              name="remote"
              value={remote}
              label="Remote"
              onChange={changeRemote}
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
              <MenuItem value={'Remote'}>Remote</MenuItem>
              <MenuItem value={'Hybrid'}>Hybrid</MenuItem>
              <MenuItem value={'On-site'}>On-site</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
            {/* TODO: Change these to a numeric input once salaries are implemented */}
            <TextField
              id="salaryMin"
              name="salaryMin"
              label="Salary Min"
              variant="outlined"
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
            <TextField
              id="salaryMax"
              name="salaryMax"
              label="Salary Max"
              variant="outlined"
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
        </Box>

        {/* City, State, Country */}
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2}}>
          <TextField
            id="city"
            name="city"
            label="City"
            variant="outlined"
            defaultValue={!isAdd && dialogJob && dialogJob.city ? dialogJob.city : ''}
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
            <InputLabel sx={{color: '#636369'}} id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              id="state"
              name="state"
              placeholder="State"
              value={state}
              label="State"
              onChange={changeState}
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
            id="country"
            name="country"
            label="Country"
            variant="outlined"
            defaultValue={!isAdd && dialogJob && dialogJob.country ? dialogJob.country : ''}
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
          id="description"
          name="description"
          label="Job Description"
          multiline
          rows={10}
          fullWidth
          defaultValue={!isAdd && dialogJob && dialogJob.job_description ? dialogJob.job_description : ''}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: 'solid #636369',
            },
            "& label": {
              color: '#636369',
            },
            marginBottom: 2
          }}
          inputProps={{ style: { color: "#ffffff" } }}
        />
        <TextField
          id="notes"
          name="notes"
          label="Notes"
          placeholder="Enter any additional info you want here"
          multiline
          rows={10}
          fullWidth
          defaultValue={!isAdd && dialogJob && dialogJob.notes ? dialogJob.notes : ''}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: 'solid #636369',
            },
            "& label": {
              color: '#636369',
            },
            marginBottom: 2
          }}
          inputProps={{ style: { color: "#ffffff" } }}
        />
        <Typography color='#ffffff' fontWeight='bold' sx={{fontSize: '19px', marginBottom: 2}}>
          Links
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column'}}>
          {links.map((link) =>
            link
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 2}}>
          <AddIcon sx={{color: '#ffffff', cursor: 'pointer', marginRight: 4}} onClick={addLink} /> 
          <RemoveIcon sx={{color: '#ffffff', cursor: 'pointer'}} onClick={removeLink} />
        </Box>
        <TextField
          id="from"
          name="from"
          label="Posting Found From"
          placeholder="LinkedIn, Indeed, etc."
          variant="outlined"
          defaultValue={!isAdd && dialogJob && dialogJob.found_from ? dialogJob.found_from : ''}
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
      </DialogContent>
      <DialogActions>
        <Button sx={{color: '#ffffff'}} onClick={handleClose}>Cancel</Button>
        <Button sx={{color: '#ffffff' }} type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}