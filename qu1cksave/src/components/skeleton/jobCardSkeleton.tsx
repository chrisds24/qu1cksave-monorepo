import { Skeleton } from "@mui/material";

export default function JobCardSkeleton() {
  return (
    <Skeleton
      variant="rounded"
      sx={{
        bgcolor: '#1a1a1a',
        width: '100%',
        // height: '200px'
        height: '25vh'
      }}
    />
  );
}