// Sort options component

import { JobsContext } from "@/app/(main)/jobs/layout";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useContext } from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const sortByList = ['Date Saved', 'Date Applied', 'Date Posted', 'Job Title', 'Company'];

export default function SortOptions() {
  const {
    setSortBy,
    sortBy,
    sortIncreasing,
    setSortIncreasing
  } = useContext(JobsContext);

  const changeSortBy = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const changeSortIncreasing = (
    event: React.MouseEvent<HTMLElement>,
    isIncreasing: boolean | null,
  ) => {
    if (isIncreasing !== null) {
      setSortIncreasing(isIncreasing);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start'}}>
      <FormControl sx={{minWidth: 90, marginRight: 2}}>
        <InputLabel sx={{color: '#636369'}} id="sortBy-label">Sort By</InputLabel>
        <Select
          required
          labelId="sortBy-label"
          id="sortBy"
          name="sortBy"
          value={sortBy}
          label="Sort By"
          onChange={changeSortBy}
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
          {sortByList.map((sortBy) => 
            <MenuItem value={sortBy}>{sortBy}</MenuItem>
          )}
        </Select>
      </FormControl>
      <ToggleButtonGroup
        value={sortIncreasing}
        exclusive
        onChange={changeSortIncreasing}
        aria-label="sort increasing"
      >
        <ToggleButton
          value={false}
          aria-label="decreasing option"
          sx={{
            backgroundColor: '#111111',
            '&.Mui-selected': {
              backgroundColor: '#000000',
              '&:hover': {
                backgroundColor: '#000000',
              },
            },
            '&:hover': {
              backgroundColor: '#000000',
            },
          }}
        >
          <ArrowDownwardIcon sx={{color: '#ffffff'}} />
        </ToggleButton>
        <ToggleButton
          value={true}
          aria-label="increasing option"
          sx={{
            backgroundColor: '#111111',
            '&.Mui-selected': {
              backgroundColor: '#000000',
              '&:hover': {
                backgroundColor: '#000000',
              },
            },
            '&:hover': {
              backgroundColor: '#000000',
            },
          }}
        >
          <ArrowUpwardIcon sx={{color: '#ffffff'}} />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
} 