'use client'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { JobsContext } from "@/app/(main)/jobs/layout";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { states } from "@/lib/states";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const statusList = ['Not Applied', 'Applied', 'Assessment', 'Interview', 'Job Offered', 'Accepted Offer', 'Declined Offer', 'Rejected', 'Ghosted', 'Closed'];

export default function AddOrEditDialog() {
  const {open, setOpen, isAdd} = useContext(JobsContext);

  const link1 = 
    <TextField
      id='link1'
      name='link1'
      label='Link 1'
      placeholder='Link 1'
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
        marginBottom: 2,
        width: '50%'
      }}
    />;

  // TODO: I need to reset the state when the dialog is closed
  //   I remember there's a callback function for this in the MUI Dialog page
  const [remote, setRemote] = useState('Remote');
  const [status, setStatus] = useState('Not Applied');
  const [state, setState] = useState('');
  const [links, setLinks] = useState<JSX.Element[]>([link1]);

  const handleClose = () => {
    setOpen(false);
    setRemote('Remote');
    setStatus('Not Applied');
    setState('');
    setLinks([link1]);
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
      const link =
        <TextField
          id={`link${links.length + 1}`}
          name={`link${links.length + 1}`}
          label={`Link ${links.length + 1}`}
          placeholder={`Link ${links.length + 1}`}
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
            marginBottom: 2,
            width: '50%'
          }}
        />;
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
        </DialogContentText>
        <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: 2, justifyContent: 'space-between'}}>
          <FormControl>
            <InputLabel sx={{color: '#636369'}} id="status-label">Status</InputLabel>
            <Select
              required
              labelId="status-label"
              id="status"
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
        </Box>
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
          <FormControl>
            <InputLabel sx={{color: '#636369'}} id="remote-label">Remote</InputLabel>
            <Select
              required
              labelId="remote-label"
              id="remote"
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
              // fullWidth
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
              // fullWidth
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