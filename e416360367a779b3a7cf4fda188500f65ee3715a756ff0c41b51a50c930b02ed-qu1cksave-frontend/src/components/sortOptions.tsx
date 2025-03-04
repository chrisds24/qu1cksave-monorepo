// Sort options component

import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useContext } from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { SetSortByContext, SortByContext } from "@/contexts/SortByContext";
import { SetSortIncreasingContext, SortIncreasingContext } from "@/contexts/SortIncreasingContext";

const sortByList = ['Date Saved', 'Date Applied', 'Date Posted', 'Job Title', 'Company'];

export default function SortOptions() {
  const sortBy = useContext(SortByContext);
  const setSortBy = useContext(SetSortByContext);
  const sortIncreasing = useContext(SortIncreasingContext);
  const setSortIncreasing = useContext(SetSortIncreasingContext);

  const changeSortIncreasing = (
    event: React.MouseEvent<HTMLElement>,
    isIncreasing: boolean | null,
  ) => {
    if (isIncreasing !== null) {
      setSortIncreasing(isIncreasing);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', marginBottom: {xs: 2, md: 0}}}>
      <FormControl sx={{minWidth: 90, marginRight: 2}}>
        <InputLabel sx={{color: '#636369'}} id="sortBy-label">Sort By</InputLabel>
        <Select
          required
          labelId="sortBy-label"
          id="sortBy"
          name="sortBy"
          value={sortBy}
          label="Sort By"
          onChange={
            (event: SelectChangeEvent) => 
              setSortBy(event.target.value as string)
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
          {sortByList.map((sortBy) => 
            <MenuItem key={`Sort By ${sortBy}`} value={sortBy}>{sortBy}</MenuItem>
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
          // https://stackoverflow.com/questions/71146989/material-ui-toggle-button-color
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