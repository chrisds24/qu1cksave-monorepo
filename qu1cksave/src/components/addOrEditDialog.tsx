'use client'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { JobsContext } from "@/app/(main)/jobs/layout";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { states } from "@/lib/states";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import dayjs, {Dayjs} from 'dayjs'
import { Job, NewJob } from "@/types/job";
import { YearMonthDate } from "@/types/common";
import FileUploadSection from "./fileUploadSection";
import { NewResume } from "@/types/resume";
import { addOrEditJob } from "@/actions/job";
import NumberInputBasic from "./numberInput";
import { NewCoverLetter } from "@/types/coverLetter";

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
  const [buttonDisabled, setButtonDisabled] = useState(false);

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
  const [salaryMax, setSalaryMax] = useState<number | null>(null);
  const [salaryMin, setSalaryMin] = useState<number | null>(null);
  const [status, setStatus] = useState('Not Applied');
  const [state, setState] = useState('');
  const [links, setLinks] = useState<JSX.Element[]>([link1]);
  const [resumeName, setResumeName] = useState<string>('');
  const [coverLetterName, setCoverLetterName] = useState<string>('');

  useEffect(() => {
    if (!isAdd && dialogJob) { // In edit mode and the job has been loaded
      setRemote(dialogJob.is_remote);
      setStatus(dialogJob.job_status);
      if (dialogJob.salary_min !== null) setSalaryMin(dialogJob.salary_min);
      if (dialogJob.salary_max !== null) setSalaryMax(dialogJob.salary_max);
      if (dialogJob.us_state) setState(dialogJob.us_state);
      if (dialogJob.links) setLinks(existingLinks);
      // dialogJob.resume.file_name is needed since dialog.resume could be an empty {}
      //   due to how the postgresql query is constructed
      if (dialogJob.resume && dialogJob.resume.file_name) setResumeName(dialogJob.resume.file_name);
      if (dialogJob.cover_letter && dialogJob.cover_letter.file_name) setCoverLetterName(dialogJob.cover_letter.file_name);
    }
  }, [isAdd, dialogJob]);

  const handleClose = () => {
    setOpen(false);
    setRemote('Remote');
    setSalaryMin(null);
    setSalaryMax(null);
    setStatus('Not Applied');
    setState('');
    setLinks([link1]);
    setDialogJob(undefined);
    setIsAdd(true);
    setResumeName('');
    setCoverLetterName('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // 'title', 'company_name', 'job_description', 'notes', 'is_remote', 'country',
    // 'us_state', 'city', 'date_applied', 'date_posted', 'job_status', 'links', 'found_from'

    event.preventDefault();

    // This also doesn't fix the 2 jobs created issue when spamming submit
    // - I think what's happening is that after setButtonDisabled becomes
    //   false at the end, the button becomes available for a split second
    //   before the modal closes.
    // - UPDATE: It happens at the "beginning", "middle", and "end"
    //   -- UPDATE: When I removed this if condition, it only happens at the end
    //        And I was still somehow able to click Submit even though the dialog
    //        is visually not on the screen!!!
    //      + View this GitHub issue: https://github.com/users/chrisds24/projects/2/views/1?pane=issue&itemId=70881061
    // if (!buttonDisabled) {

    setButtonDisabled(true);
    console.log('Submit clicked');

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

    if (salaryMin !== null) {
      // TODO: Check if integer?
      newJob['salary_min'] = salaryMin;
    }

    if (salaryMax !== null) {
      // TODO: Check if integer?
      newJob['salary_max'] = salaryMax;
    }

    const linksList = []
    for (let i = 0; i < links.length; i++) {
      const link = data.get(`link${i+1}`);
      if (link) {
        linksList.push(link as string);
      }
    }
    if (linksList.length > 0) newJob['links'] = linksList;

    // -------------------- PROCESS RESUME --------------------

    // ----- Cases -----
    // ADD
    // A.) Name and input field both empty. (No resume was uploaded)
    //     - Send a newJob with no newResume and no resume_id
    // B.) Both are filled (A resume was uploaded)
    //     - Send a newJob with a newResume, but no resume_id
    //
    // EDIT
    // A.) Name is filled, but input is empty.
    //     - When loaded job has a resume, but user didn't change it.
    //     - Send a newJob with no newResume, but has a resume_id.
    //     - Also set keepResume to true. (To differentiate it from case EDIT.C.b)
    // B.) Name and resume field are both filled.
    //     a.) dialogJob does not have a resume_id
    //         - This is when we're adding a job to the resume for the first time
    //         - Send a newJob with a newResume, but no resume_id
    //     b.) dialogJob has a resume_id
    //         - This is when we're editing a job's resume
    //         - Send a newJob with a newResume + a resume_id
    //         - NOTE: newResume will retain the old resume's resume_id.
    //           It won't get a new database entry in the resume table, but will
    //           just replace the old one with its details.
    // C.) Name and resume fields are both empty
    //     a.) dialogJob has no resume_id
    //         - Job had no resume in the first place
    //         - Send a newJob with no newResume and no resume_id
    //     b.) dialogJob has a resume_id
    //         - We're deleting the job's resume
    //         - Send a newJob with no newResume but has a resume_id
    //         - Also set keepResume to false (To differentiate it from case EDIT.A)

    // The id for resumeInput is in fileUploadSection.tsx
    const resumeInput = document!.getElementById('resumeInput') as HTMLInputElement;
    const resumeFiles = resumeInput.files;

    if (resumeFiles) {
      // For both ADD and EDIT mode
      //   Note that resumeFiles will always be true regardless if there's a file uploaded or not.
      if (resumeName && resumeFiles.length > 0) {
        // This branch is for Cases ADD.B, EDIT.B.a, and EDIT.B.b
        // - Note that when there's an uploaded file in the field, there will
        //   always be a resume name. (Though, just because there's a name
        //   doesn't mean that there's an uploaded file...Such as when we're
        //   editing a job with a resume). This is important since the "remove
        //   file" button only clears out the name.
        // - There's an uploaded resume, so process it and create a newResume
        // - For EDIT.B.a, dialogJob won't have a resume_id that we can attach,
        //   to newJob. For EDIT.B.b, we need to attach the resume_id to newJob
        //   -- This is done outside if (resumeFiles) { ... }

        const resumeFile = resumeFiles[0];
        // https://developer.mozilla.org/en-US/docs/Web/API/Blob
        // https://bun.sh/guides/read-file/uint8array
        // https://bun.sh/guides/binary/blob-to-typedarray (I used this)
        const blob = new Blob([resumeFile],{type: resumeFile.type})
        const byteArray = new Uint8Array(await blob.arrayBuffer());
        const arr = Array.from(byteArray);
        const newResume: NewResume = {
          // For member_id, job_id, and resume_id, I can just attach it to newJob and get
          //   it from there when we need it
          file_name: resumeFile.name, // Or resumeName, since they're the same in this case
          mime_type: resumeFile.type,
          bytearray_as_array: arr   
        }

        newJob.resume = newResume;
      } else { // There's no resume to be processed
        if (!isAdd) {
          // For EDIT MODE only
          if (resumeName) {
            // Case EDIT.A: When the job originally had a resume and the user didn't change it.
            // - If we used dialogJob.resume.file_name, this case would always be true
            //   if the job had a resume from the beginning (WRONG BEHAVIOR)
            newJob.keepResume = true;
            // (SEE BELOW) Also include the resume_id in the NewJob
          } else {
            // This branch is for cases EDIT.C.a and EDIT.C.b
            // - Either the job had a resume and the user specified to delete it
            //   OR it never had one to begin with
            if (dialogJob.resume_id) { 
              // Case EDIT.C.b: Job had a resume, which is to be deleted
              newJob.keepResume = false;
              // (SEE BELOW) Also include the resume_id in the NewJob
            }
            // Case EDIT.C.a: No need to set keepResume if the job didn't have a resume to begin with
          }
        }
        // Case ADD.A: No need to do anything if there's no uploaded resume
      }
    }

    // For EDIT mode, include the resume_id in the NewJob if dialogJob had one
    // - Deals with cases EDIT.A, EDIT.C.b, and EDIT.B.b
    if (!isAdd && dialogJob && dialogJob.resume_id) {
      // newJob.resume_id = dialogJob.resumeId
      newJob.resume_id = dialogJob.resume_id
    }

    // -------------------------- PROCESS COVER LETTER ----------------------------------
    // Cases are the same as for resume

    const coverLetterInput = document!.getElementById('coverLetterInput') as HTMLInputElement;
    const coverLetterFiles = coverLetterInput.files;

    if (coverLetterFiles) {
      if (coverLetterName && coverLetterFiles.length > 0) {

        const coverLetterFile = coverLetterFiles[0];
        const blob = new Blob([coverLetterFile],{type: coverLetterFile.type})
        const byteArray = new Uint8Array(await blob.arrayBuffer());
        const arr = Array.from(byteArray);
        const newCoverLetter: NewCoverLetter = {
          file_name: coverLetterFile.name,
          mime_type: coverLetterFile.type,
          bytearray_as_array: arr   
        }

        newJob.cover_letter = newCoverLetter;
      } else {
        if (!isAdd) {
          // For EDIT MODE only
          if (coverLetterName) {
            newJob.keepCoverLetter = true;
          } else {
            if (dialogJob.cover_letter_id) { 
              newJob.keepCoverLetter = false;
            }
          }
        }
      }
    }

    if (!isAdd && dialogJob && dialogJob.cover_letter_id) {
      newJob.cover_letter_id = dialogJob.cover_letter_id
    }

    // -----------------------------------------------------------------

    // Using server actions
    const job: Job | undefined = await addOrEditJob(newJob, !isAdd ? dialogJob.id : undefined)
    if (job) {
      // Add this job to jobs, then set jobs
      let newJobs = [...jobs];
      if (!isAdd) {
        // When editing, remove the outdated job from the jobs list.
        newJobs = newJobs.filter((j) => j.id !== job.id);
      }

      newJobs.push(job)
      // NOTE: Whenever jobs is set, apply the filters.
      // This is done in layout.tsx to get filteredJobs
      setJobs(newJobs)
      // NOTE: The useEffect to automatically update jobsInPage when jobs
      //   changes is in job/page.tsx
      // NOTE: For some reason, the links are weird in the single job view.
      //   If I create link fields in the modal and set it to for example,
      //   a bunch of spaces. It creates a link to the single job page for
      //   the current job.
      //   (Turns out this is the case for anything that isn't a link)
    }

    // Using route handlers
    // let fetchString = '/api/job';
    // if (!isAdd) {
    //   fetchString += `/${dialogJob.id}`;
    // }
    // await fetch(fetchString, {
    //   method: isAdd ? "POST" : "PUT",
    //   body: JSON.stringify(newJob),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((res) => {
    //     if (!res.ok) {
    //       throw res;
    //     }
    //     return res.json();
    //   })
    //   .then((job) => {
    //     // Add this job to jobs, then set jobs
    //     let newJobs = [...jobs];
    //     if (!isAdd) {
    //       // When editing, remove the outdated job from the jobs list.
    //       newJobs = newJobs.filter((j) => j.id !== job.id);
    //     }

    //     newJobs.push(job)
    //     // NOTE: Whenever jobs is set, apply the filters.
    //     // This is done in layout.tsx to get filteredJobs
    //     setJobs(newJobs)
    //     // NOTE: The useEffect to automatically update jobsInPage when jobs
    //     //   changes is in job/page.tsx
    //     // NOTE: For some reason, the links are weird in the single job view.
    //     //   If I create link fields in the modal and set it to for example,
    //     //   a bunch of spaces. It creates a link to the single job page for
    //     //   the current job.
    //     //   (Turns out this is the case for anything that isn't a link)
    //   })
    //   .catch((err) => {
    //     console.error(err)
    //   });

    // When it's here, only 1 S3 call, but there could be 2 POST requests to the
    //   database so 2 jobs are created when spamming submit
    // setButtonDisabled(false);

    handleClose();

    // Down here doesn't fix the 2 jobs created issue when spamming submit
    setButtonDisabled(false);
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
            <Typography color='#ffffff' sx={{fontSize: '17px', marginRight: 2, alignSelf: 'center'}}>
              {'Salary Range ($):'}
            </Typography>
            <NumberInputBasic inputType={'Salary Min'} numInputVal={salaryMin} setNumInputVal={setSalaryMin} min={0} max={9999999} />
            <Box sx={{marginRight: 2}}/> 
            <NumberInputBasic inputType={'Salary Max'} numInputVal={salaryMax} setNumInputVal={setSalaryMax} min={0} max={9999999} />
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

        {/* 
          View this GitHub issue by me: https://github.com/users/chrisds24/projects/2/views/1?pane=issue&itemId=68365376
            User uploads file here
              - MUI has a nice-looking file upload example: https://mui.com/material-ui/react-button/
              - NOTE: There's some options to change the behavior when uploading a file.
                -- From some limited testing I did: After the user uploads a file, then starts the upload process
                    again (by clicking upload which opens the file search window), then cancels it, the file that
                    was uploaded earlier gets removed. DON'T CHANGE THIS
              - Using MUI's example, the name of the uploaded file is hidden. This is what I want. However, I
                still want a state that keeps track of the name of the currently uploaded file. Not only is this
                helpful to the user, but this state is used to check if the original file that we got from the
                job in the database was changed during EDIT.
        */}

        <FileUploadSection
          fileType={'resume'}
          fileName={resumeName}
          setFileName={setResumeName}
        />

        <Box sx={{marginBottom: 2}} />

        <FileUploadSection
          fileType={'coverLetter'}
          fileName={coverLetterName}
          setFileName={setCoverLetterName}
        />

      </DialogContent>
      <DialogActions>
        <Button sx={{color: '#ffffff'}} disabled={buttonDisabled} onClick={handleClose}>Cancel</Button>
        <Button sx={{color: '#ffffff' }} disabled={buttonDisabled} type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}