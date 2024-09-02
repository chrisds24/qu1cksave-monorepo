import { Skeleton } from "@mui/material";

export default function DiscreteSliderValuesSkeleton() {
  return (
    <Skeleton
      variant="rounded"
      sx={{
        bgcolor: '#4b4e50',
        width: {xs:'320px', sm: '400px'},
        // width: '27.5vw',
        height: '52px'
        // height: '6.5vh'
      }}
    />
  );
}