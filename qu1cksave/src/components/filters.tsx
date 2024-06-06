import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";

const statusList = ['N/A', 'Not Applied', 'Applied', 'Assessment', 'Interview', 'Job Offered', 'Accepted Offer', 'Declined Offer', 'Rejected', 'Ghosted', 'Closed'];

export default function Filters() {
  const [jobFilter, setJobFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('N/A');
  const [remoteFilter, setRemoteFilter] = useState('N/A');

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

  return (
    <Box sx={{marginBottom: 3}}>
      {/* <Accordion defaultExpanded> */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="filters-header"
        >
          Filters
        </AccordionSummary>
        <AccordionDetails>
          {/* Filters go here. */}
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2}}>
            <TextField
              required            
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
              required
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
            <FormControl>
              <InputLabel sx={{color: '#636369'}} id="statusFilter-label">Status</InputLabel>
              <Select
                required
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
                {statusList.map((status) => 
                  <MenuItem value={status}>{status}</MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel sx={{color: '#636369'}} id="remoteFilter-label">Remote</InputLabel>
              <Select
                required
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
                <MenuItem value={'N/A'}>{'N/A'}</MenuItem>
                <MenuItem value={'Remote'}>Remote</MenuItem>
                <MenuItem value={'Hybrid'}>Hybrid</MenuItem>
                <MenuItem value={'On-site'}>On-site</MenuItem>
              </Select>
            </FormControl>            
          </Box>
        </AccordionDetails>
        <AccordionActions>
          <Button>Reset</Button>
          <Button>Apply</Button>
        </AccordionActions>
      </Accordion>
    </Box>
  );
}