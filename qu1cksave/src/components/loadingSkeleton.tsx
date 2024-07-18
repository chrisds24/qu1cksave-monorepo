// https://nextjs.org/docs/app/api-reference/file-conventions/loading
export default function LoadingSkeleton() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      <h1>
        This works. But its hard to see when whatever's here is small.
        {/* 
          I usually see this when:
          - Go from /documents to /jobs, vice versa
          - Go from /jobs to /jobs/<specificjob>
         */}
      </h1>
    </>
  );
}