'use client'

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter(); 

  return (
    <>
      Job Id: {params.id}
      <Button onClick={() => router.push('/jobs')}>Go Back</Button>
    </>
  );
}