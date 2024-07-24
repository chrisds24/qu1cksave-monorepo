import { Box, Skeleton } from "@mui/material";

export default function PaginationSectionSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection:  {xs: 'column', sm: 'row'}, alignItems: 'center'}}>
      <Skeleton
        variant="rounded"
        sx={{
          bgcolor: '#64676a',
          width: {xs: '305px', sm: '480px', md: '585px'},
          height: {xs: '40px', sm: '50px'},
          // height: '6.5vh'
        }}
      />
      <Skeleton
        variant="rounded"
        sx={{
          marginTop: 1.5,
          bgcolor: '#64676a',
          width: '150px',
          // width: '40.5vw',
          height: '50px',
          // height: '6.5vh'
          display: {xs: 'flex', sm: 'none'}
        }}
      />
    </Box>
  );
}