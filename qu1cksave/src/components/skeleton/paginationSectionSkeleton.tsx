import { Skeleton } from "@mui/material";

export default function PaginationSectionSkeleton() {
  return (
    <Skeleton
      variant="rounded"
      sx={{
        bgcolor: '#1a1a1a',
        // width: '590px',
        width: '40.5vw',
        // height: '42px'
        height: '6.5vh'
      }}
    />
  );
}