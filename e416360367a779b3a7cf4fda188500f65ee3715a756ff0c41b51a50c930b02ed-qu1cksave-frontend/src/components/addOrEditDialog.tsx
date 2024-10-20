'use client'

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { JobsContext } from "@/app/(main)/jobs/layout";
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
import { DateValidationError } from "@mui/x-date-pickers/models";
import CustomDatePicker from "./customDatePicker";

const statusList = ['Not Applied', 'Applied', 'Assessment', 'Interview', 'Job Offered', 'Accepted Offer', 'Declined Offer', 'Rejected', 'Ghosted', 'Closed'];

const createLink = (idx: number, val: string) => {
  return (
    <TextField
      key={`link${idx}`}
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
        width: {xs: '100%', md: '80%'}
      }}
    />
  );
}

export default function AddOrEditDialog() {
  const {
    open,
    setOpen,
    isAdd,
    setIsAdd,
    dialogJob,
    setDialogJob,
    jobs,
    setJobs
  } = useContext(JobsContext);

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Create the list of existing links for the loaded job
  const link1 = createLink(1, '');
  const existingLinks: JSX.Element[] = [];
  if (!isAdd && dialogJob?.links) {
    const n = dialogJob.links.length;
    for (let i = 1; i < n + 1; i++) { // Start count at 1
      // i-1 since we count starting from 1
      existingLinks.push(createLink(i, dialogJob.links[i-1]))
    }
  }

  // If editing, fill in fields and set states based on selected job
  const [title , setTitle] = useState('');
  const [titleErr, setTitleErr] = useState(false);
  const [company , setCompany] = useState('');
  const [companyErr, setCompanyErr] = useState(false);
  const [city , setCity] = useState('');
  const [cityErr, setCityErr] = useState(false);
  const [country , setCountry] = useState('');
  const [countryErr, setCountryErr] = useState(false);
  const [from , setFrom] = useState('');
  const [fromErr, setFromErr] = useState(false);
  const [remote, setRemote] = useState('Remote');
  const [salaryMin, setSalaryMin] = useState<number | null>(null);
  const [salaryMax, setSalaryMax] = useState<number | null>(null);
  const [status, setStatus] = useState('Not Applied');
  const [applied, setApplied] = useState<Dayjs | null>(null);
  const [appliedErr, setAppliedErr] = useState<DateValidationError | null>(null);
  const [posted, setPosted] = useState<Dayjs | null>(null);
  const [postedErr, setPostedErr] = useState<DateValidationError | null>(null);
  const [state, setState] = useState('');
  const [links, setLinks] = useState<JSX.Element[]>([link1]);
  const [resumeName, setResumeName] = useState<string>('');
  const [coverLetterName, setCoverLetterName] = useState<string>('');

  // IMPORTANT:
  // - Storing derived state in state is bad:
  //   -- https://stackoverflow.com/questions/76796466/react-derived-state-whats-wrong-with-this-code
  // - Setting initial state using props is an anti-pattern.
  // - useState not setting initial value:
  //   -- https://stackoverflow.com/questions/58818727/react-usestate-not-setting-initial-value

  // Need this useEffect so that the initial state of the form fields is
  //   updated with the selected dialogJob's details, since the form fields
  //   rely on the dialogJob state through context.
  // Compare this to filters.tsx, where the filter fields also rely on the
  //   filter states from the context.
  // - In the case with the Filters component, the filter fields get prefilled
  //   with the currently set filters since when the component first consumes
  //   the context, the context already has the filters set. In other words,
  //   the component is given the filter states on the first render.
  // On the other hand, when the dialog first renders, the first render
  //   consumes the context with the undefined dialogJob then sets the initial
  //   state of the form fields to the default values. The dialog is
  //   opened when a job is selected and sets the open state, which the Dialog
  //   MUI component uses for its "open" attribute. The dialogJob and isAdd
  //   states are also set when the job is selected, and the dialog actually
  //   receives this updated data since it consumes the context.
  //   - However, the initial state of the form fields don't get updated
  //     since their initial states have already been set on the first
  //     render (Since the code below to set the initial state only runs on the
  //     first render)
  //     const [title , setTitle] = useState(
  //       (!isAdd && dialogJob) ? dialogJob.title : ''
  //     );
  //   - If we wanted the state of the form fields to be updated, we need a
  //     useEffect with isAdd and dialogJob as a dependency and sets the state
  //     of the form fields when those two dependencies change (In our case,
  //     they are changed when a job is selected for editing.)
  useEffect(() => {
    // In edit mode and the job exists
    if (!isAdd && dialogJob) {
      setTitle(dialogJob.title);
      if (!dialogJob.title) { setTitleErr(true); }
      setCompany(dialogJob.company_name);
      if (!dialogJob.company_name) { setCompanyErr(true); }
      if (dialogJob.city) { setCity(dialogJob.city); }
      if (dialogJob.country) { setCountry(dialogJob.country); }
      if (dialogJob.found_from) { setFrom(dialogJob.found_from); }
      setRemote(dialogJob.is_remote);
      setStatus(dialogJob.job_status);

      const dateApplied = dialogJob.date_applied;
      if (dateApplied) {
        setApplied(dayjs(new Date(
          dateApplied.year, dateApplied.month, dateApplied.date
        )));
      }
      const datePosted = dialogJob.date_posted;
      if (datePosted) {
        setPosted(dayjs(new Date(
          datePosted.year, datePosted.month, datePosted.date
        )));
      }

      if (dialogJob.salary_min !== null) { setSalaryMin(dialogJob.salary_min); }
      if (dialogJob.salary_max !== null) { setSalaryMax(dialogJob.salary_max); }
      if (dialogJob.us_state) { setState(dialogJob.us_state); }
      if (dialogJob.links) { setLinks(existingLinks); }
      // dialogJob.resume.file_name is needed since dialog.resume could be an empty {}
      //   due to how the postgresql query is constructed
      if (dialogJob.resume?.file_name) {
        setResumeName(dialogJob.resume.file_name);
      }
      if (dialogJob.cover_letter?.file_name) {
        setCoverLetterName(dialogJob.cover_letter.file_name);
      }
    }
  }, [isAdd, dialogJob]);

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value as string;
    if (!val || val.length > 255) {
      setTitleErr(true)
    } else {
      setTitleErr(false)
    }
    setTitle(val);
  };

  const changeCompany = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value as string;
    if (!val || val.length > 255) {
      setCompanyErr(true)
    } else {
      setCompanyErr(false)
    }
    setCompany(val);
  };

  const changeCity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value as string;
    if (val && val.length > 255) {
      setCityErr(true)
    } else {
      setCityErr(false)
    }
    setCity(val);
  };

  const changeCountry = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value as string;
    if (val && val.length > 255) {
      setCountryErr(true)
    } else {
      setCountryErr(false)
    }
    setCountry(val);
  };

  const changeFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value as string;
    if (val && val.length > 255) {
      setFromErr(true)
    } else {
      setFromErr(false)
    }
    setFrom(val);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setTitleErr(false);
    setCompany('');
    setCompanyErr(false);
    setCity('');
    setCityErr(false);
    setCountry('');
    setCountryErr(false);
    setFrom('');
    setFromErr(false);
    setRemote('Remote');
    setSalaryMin(null);
    setSalaryMax(null);
    setStatus('Not Applied');
    setApplied(null);
    setAppliedErr(null);
    setPosted(null);
    setPostedErr(null);
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
    setButtonDisabled(true);

    const data = new FormData(event.currentTarget);
    // Note: If user doesn't change the job title or the company name, the
    //   onChange won't trigger and titleErr and companyErr won't correctly
    //   indicate if those two required fields are empty. So the code
    //   below doesn't work perfectly.
    // if (titleErr || companyErr || cityErr || countryErr || fromErr) { ... }  // HAS A BUG

    const titleError = !title || title.length > 255;
    const companyError = !company || company.length > 255;
    if (
      titleError ||
      companyError ||
      cityErr ||
      countryErr ||
      fromErr ||
      appliedErr ||
      postedErr
    ) {
      // Useful for MUI validation:
      //   https://muhimasri.com/blogs/mui-validation/
      // No need to validate resume and cover letter file name since docs
      //   and pdfs don't allow names with > 255 characters (including
      //   the extension)
      setTitleErr(titleError);
      setCompanyErr(companyError);
      alert('Please ensure that all fields are valid.')
      setButtonDisabled(false);
      return;
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

    // TODO: Add an error state for description and notes. For now, just send
    //   an alert and cancel the request.
    if (
      (newJob.job_description && newJob.job_description.length > 16384) ||
      (newJob.notes && newJob.notes.length > 16384)
    ) { 
      alert('Job description and notes must each be at most 16384 characters long.')
      setButtonDisabled(false);
      return;
    }

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
      newJob['salary_min'] = salaryMin;
    }

    if (salaryMax !== null) {
      newJob['salary_max'] = salaryMax;
    }

    const linksList = []
    for (let i = 0; i < links.length; i++) {
      const link = data.get(`link${i+1}`);
      if (link) {
        const strLink = link as string;
        if (strLink.length > 1024) {
          alert('Each link must be at most 1024 characters long.')
          setButtonDisabled(false);
          return;
        }
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
          // For resume_id, I can just attach it to newJob and get
          //   it from there when we need it
          // job_id will be a path parameter in the API call
          // member_id will be in the request header during the API call
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
    if (!isAdd && dialogJob?.resume_id) {
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

    if (!isAdd && dialogJob?.cover_letter_id) {
      newJob.cover_letter_id = dialogJob.cover_letter_id
    }

    // -----------------------------------------------------------------

    // Using server actions
    try {
      const job: Job | undefined = await addOrEditJob(newJob, !isAdd ? dialogJob.id : undefined)
      if (job) {
        // Add this job to jobs, then set jobs
        let newJobs = [...jobs];
        if (!isAdd) {
          // When editing, remove the outdated job from the jobs list.
          newJobs = newJobs.filter((j) => j.id !== job.id);
        }

        newJobs.push(job)
        setJobs(newJobs)
      } else {
        // setJobs(undefined) // No need to go to error page.
        alert(`Error processing request. Please reload the page and try again.`)
      }
    } catch {
      alert(`Error processing request. Please reload the page and try again. Or try reducing the size of your request to under 2 MB by reducing your resume/cover letter file size.`)
    }

    handleClose();
    setButtonDisabled(false);
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
        onSubmit: handleSubmit,
        sx: {
          backgroundColor: '#1e1e1e',
        },
        noValidate: true
      }}
      fullWidth
      maxWidth={'lg'}
      fullScreen={fullScreen}
    >
      <DialogTitle sx={{color: '#4fc1ff', fontWeight: 'bold', fontSize: '24px'}}>{isAdd ? 'Add Job': 'Edit Job'}</DialogTitle>
      <DialogContent>
        {/*
          DialogContentText is purposely empty. Needed so the first row of
          forms don't get cut off on the top.
        */}
        <DialogContentText sx={{color: '#ffffff', marginBottom: 2}}></DialogContentText>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
          <FormControl sx={{marginRight: 2}}>
            <InputLabel sx={{color: '#636369'}} id="status-label">Status</InputLabel>
            <Select
              required
              labelId="status-label"
              id="status"
              name="status"
              value={status}
              label="Status"
              onChange={(event: SelectChangeEvent) =>
                setStatus(event.target.value as string)
              }
              sx={{
                color: '#ffffff',
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'solid #636369',
                },
                marginBottom: 2
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
                <MenuItem key={`${status} Status`} value={status}>{status}</MenuItem>
              )}
            </Select>
          </FormControl>
          <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: 2}}>
            <CustomDatePicker
              pickerType={'applied'}
              err={appliedErr}
              setErr={setAppliedErr}
              val={applied}
              changeVal={(val: Dayjs | null) => setApplied(val)}
            />
            <CustomDatePicker
              pickerType={'posted'}
              err={postedErr}
              setErr={setPostedErr}
              val={posted}
              changeVal={(val: Dayjs | null) => setPosted(val)}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, justifyContent: 'space-between'}}>
          <TextField
            required            
            id="title"
            name="title"
            label="Job Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={changeTitle}
            error={titleErr}
            helperText={
              titleErr ? 'Required. Maximum: 255 characters' : ''
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
              marginBottom: 2
            }}
          />
          <TextField
            required
            id="company"
            name="company"
            label="Company"
            fullWidth
            variant="outlined"
            value={company}
            onChange={changeCompany}
            error={companyErr}
            helperText={
              companyErr ? 'Required. Maximum: 255 characters' : ''
            }
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
              marginBottom: 2
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
          <FormControl sx={{marginRight: 2}}>
            <InputLabel sx={{color: '#636369'}} id="remote-label">Remote</InputLabel>
            <Select
              required
              labelId="remote-label"
              id="remote"
              name="remote"
              value={remote}
              label="Remote"
              onChange={(event: SelectChangeEvent) => 
                setRemote(event.target.value as string)               
              }
              sx={{
                color: '#ffffff',
                "& .MuiOutlinedInput-notchedOutline": {
                  border: 'solid #636369',
                },
                marginBottom: 2
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
              <MenuItem key={'Remote Job'} value={'Remote'}>Remote</MenuItem>
              <MenuItem key={'Hybrid Job'} value={'Hybrid'}>Hybrid</MenuItem>
              <MenuItem key={'On-site Job'} value={'On-site'}>On-site</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, flexWrap: 'wrap'}}>
            <Typography color='#ffffff' sx={{fontSize: '17px', marginRight: 2, alignSelf: {xs: 'flex-start', sm: 'center'}, marginBottom: 2}}>
              {'Salary Range ($):'}
            </Typography>
            <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
              <Box sx={{marginRight: 2, marginBottom: 2}}> 
                <NumberInputBasic
                  inputType={'Salary Min'}
                  numInputVal={salaryMin}
                  setNumInputVal={setSalaryMin}
                  min={0}
                  max={9999999}
                />
              </Box>
              <Box sx={{marginBottom: 2}}> 
                <NumberInputBasic
                  inputType={'Salary Max'}
                  numInputVal={salaryMax}
                  setNumInputVal={setSalaryMax}
                  min={0}
                  max={9999999}
                />
              </Box>
            </Box>
          </Box>       
        </Box>

        {/* City, State, Country */}
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
          <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 2}}>
            <TextField
              id="city"
              name="city"
              label="City"
              variant="outlined"
              value={city}
              onChange={changeCity}
              error={cityErr}
              helperText={
                cityErr ? 'Maximum: 255 characters' : ''
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
              <InputLabel sx={{color: '#636369'}} id="state-label">State</InputLabel>
              <Select
                labelId="state-label"
                id="state"
                name="state"
                placeholder="State"
                value={state}
                label="State"
                onChange={(event: SelectChangeEvent) =>
                  setState(event.target.value as string)
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
                fullWidth
              >
                {Object.keys(states).map((state) => 
                  <MenuItem
                    key={`${state} State`}
                    value={state === 'N/A' ? states[state] : state}
                  >
                    {state}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
          <TextField
            id="country"
            name="country"
            label="Country"
            variant="outlined"
            value={country}
            onChange={changeCountry}
            error={countryErr}
            helperText={
              countryErr ? 'Maximum: 255 characters' : ''
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
              marginBottom: 2
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
          defaultValue={(!isAdd && dialogJob?.job_description) ? dialogJob.job_description : ''}
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
          defaultValue={(!isAdd && dialogJob?.notes) ? dialogJob.notes : ''}
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
          value={from}
          onChange={changeFrom}
          error={fromErr}
          helperText={
            fromErr ? 'Maximum: 255 characters' : ''
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
        
        <FileUploadSection
          fileType={'coverLetter'}
          fileName={coverLetterName}
          setFileName={setCoverLetterName}
        />

      </DialogContent>
      <DialogActions>
        <Button sx={{color: '#ffffff'}} disabled={buttonDisabled} onClick={handleClose}>
          {buttonDisabled ? <CircularProgress size={20} sx={{color: '#ffffff'}} />: 'Cancel'}
        </Button>
        <Button sx={{color: '#ffffff' }} disabled={buttonDisabled} type="submit">
          {buttonDisabled ? <CircularProgress size={20} sx={{color: '#ffffff'}} />: 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}