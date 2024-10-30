'use client'

import { useContext } from "react";
import JobsList from "@/components/job/list";
import { Box, Fab, Typography } from "@mui/material";
import DiscreteSliderValues from "@/components/discreteSliderValues";
import AddOrEditDialog from "@/components/addOrEditDialog";
import AddIcon from '@mui/icons-material/Add';
import Filters from "@/components/filters";
import SortOptions from "@/components/sortOptions";
import DeleteDialog from "@/components/deleteDialog";
import PaginationSection from "@/components/paginationSection";
import { SetIsAddContext } from "@/contexts/add_or_edit_dialog/IsAddContext";
import { SetDialogJobContext } from "@/contexts/add_or_edit_dialog/DialogJobContext";
import { SetOpenContext } from "@/contexts/add_or_edit_dialog/OpenContext";
import { JobsContext } from "@/contexts/JobsContext";

export default function Page() {
  const jobs = useContext(JobsContext);
  const setIsAdd = useContext(SetIsAddContext);
  const setDialogJob = useContext(SetDialogJobContext);
  const setOpen = useContext(SetOpenContext);

  if (jobs !== undefined) {
    return (
      <Box>
        <Filters />
  
        <Box sx={{ display: 'flex', flexDirection:  {xs: 'column', md: 'row'}, justifyContent: 'space-between', marginBottom: 3, alignItems: {xs: 'center', sm: 'flex-start'}}}>
          <SortOptions />
          <DiscreteSliderValues />
        </Box>
  
        <PaginationSection />
        <Box sx={{marginBottom: 2.5 }} />
  
        <AddOrEditDialog />
        <DeleteDialog />
  
        <JobsList />
  
        <Box sx={{marginTop: '3vh' }} />
  
        <Fab
          aria-label='add'
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            backgroundColor: '#2ea043',
            height: 80,
            width: 80,
            '&:hover': {
              backgroundColor: '#4ecc65',
            },
          }}
          onClick={
            () =>  {
              setIsAdd(true);
              setDialogJob(undefined);
              setOpen(true);
            }
          }
        >
          <AddIcon sx={{color: '#ffffff', height: 48, width: 48}} />
        </Fab>
      </Box>
    );
  } else {
    return (
      <Box sx={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around'}}>
        <Box sx={{display: 'flex', height: '100%', width: '60%', flexDirection: 'row', alignItems: 'center'}}>
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Typography variant="h3" sx={{fontWeight: 'bold', color: '#ffffff'}}>
              An error occured. Please try again later.
            </Typography>
          </Box>
        </Box>
      </Box>
    );      
  }
}