import { Skeleton } from "@mui/material";

export default function DiscreteSliderValuesSkeleton() {
  return (
    <Skeleton
      variant="rounded"
      sx={{
        bgcolor: '#1a1a1a',
        width: '400px',
        // width: '27.5vw',
        height: '57px'
        // height: '6.5vh'
      }}
    />
  );
}