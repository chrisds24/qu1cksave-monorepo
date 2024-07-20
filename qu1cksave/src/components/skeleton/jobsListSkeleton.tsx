import { Stack } from "@mui/material";
import JobCardSkeleton from "./jobCardSkeleton";

export default function JobsListSkeleton() {
  // https://stackoverflow.com/questions/70828116/how-to-use-for-loop-inside-react-jsx-code
  return (
    <Stack spacing={'3vh'}>
      {(() => {
        const jobCardSkeletonList = [];
        for (let i = 0; i < 10; i++) {
          jobCardSkeletonList.push(
            <JobCardSkeleton />
          );
        }
        return jobCardSkeletonList;
      })()}
    </Stack>
  );
}