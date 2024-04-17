'use client'

import { Paper } from "@mui/material";

export default function JobCard(props: any) {
  const job = props.job;
  return (
    <Paper
      sx={{backgroundColor: '#2d2d30', width: '100%', padding: 2, color: '#ffffff'}}
      elevation={6}
    >
      {`Job Title: ${job.title}`} <br />
      {`Company: ${job.company_name}`} <br />
      {`Status: ${job.job_status}`} <br />      
    </Paper>
  );
}