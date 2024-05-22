'use client'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { JobsContext } from "@/app/(main)/jobs/layout";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function AddOrEditDialog() {
  const {open, setOpen, isAdd} = useContext(JobsContext);

  const handleClose = () => {
    setOpen(false);
  };

  const [remote, setRemote] = useState('Remote');

  const changeRemote = (event: SelectChangeEvent) => {
    setRemote(event.target.value as string);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          // Do stuff here
          handleClose();
        },
        sx: {
          backgroundColor: '#1e1e1e',
        }
      }}
      fullWidth
      maxWidth={'lg'}
    >
      <DialogTitle sx={{color: '#4fc1ff', fontWeight: 'bold', fontSize: '24px'}}>{isAdd ? 'Add Job': 'Edit Job'}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{color: '#ffffff', marginBottom: 2}}>
          Edit this job. Required values will be marked with an asterisk (*).
        </DialogContentText>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2}}>
          <TextField
            required            
            id="title"
            name="title"
            label="Job Title"
            fullWidth
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
          <Box sx={{marginRight: 2}}>
            {/* <InputLabel sx={{color: '#636369'}} id="remote-label">Remote</InputLabel> */}
            <Select
              required
              // labelId="remote-label"
              id="remote"
              value={remote}
              // label="Remote"
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
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
            <TextField
              // required={isAdd ? true : false}
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
              // fullWidth
            />  
            <TextField
              // required={isAdd ? true : false}
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
              // fullWidth
            />
          </Box>       
        </Box>
        <TextField
          id="description"
          label="Job Description"
          multiline
          rows={10}
          fullWidth
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
          // TODO: When editing, defaultValue is the description of the job
          //   being edited
          // defaultValue="Default Value"
        />
        <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: 2}}>
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
          />
          <DatePicker
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
          />
        </Box>
        <TextField
          id="notes"
          label="Notes"
          placeholder="Enter any additional info you want here"
          multiline
          rows={10}
          fullWidth
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
          // defaultValue="Default Value"
        />
      </DialogContent>
      <DialogActions>
        <Button sx={{color: '#ffffff'}} onClick={handleClose}>Cancel</Button>
        <Button sx={{color: '#ffffff' }} type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}