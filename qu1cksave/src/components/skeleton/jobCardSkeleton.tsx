import { Skeleton } from "@mui/material";

export default function JobCardSkeleton() {
  return (
    <Skeleton
      variant="rounded"
      sx={{
        bgcolor: '#1a1a1a',
        width: {xs: '87.5vw', sm: '100%'},
        // height: '200px'
        height: {xs: '45vh', sm: '25vh'}
      }}
    />
  );
}