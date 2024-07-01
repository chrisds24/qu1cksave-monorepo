import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { JobsContext } from '@/app/(main)/jobs/layout';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function FileUploadSection() {
  const { dialogJob } = useContext(JobsContext);
  const [resumeName, setResumeName] = useState<string>('');

  useEffect(() => {
    if (dialogJob) {
      if (dialogJob.resume && dialogJob.resume.file_name) setResumeName(dialogJob.resume.file_name);
    }
  }, [dialogJob]);

  const changeFileInput = (event: any) => {
    // https://github.com/microsoft/TypeScript/issues/31816
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setResumeName(file.name);
    } else { // File was removed
      // Before updating cancel behavior:
      // - When you upload a file, then try uploading again but cancel that one, the file you
      //   uploaded earlier gets removed, which triggers this.
      // - However, when you haven't uploaded a file yet (regardless of whether dialogJob had
      //   a resume name or not), changeFileInput will not trigger if you try uploading then
      //   cancelling it.
      setResumeName('N/A');
    }
  };

  return (
    <Box>
      <Typography display={'inline'} color='#ffffff' sx={{fontSize: '19px', fontWeight: 'bold', marginRight: 2}}>
        {'Resume:'} 
      </Typography>
      <Typography display={'inline'} color='#ffffff' sx={{fontSize: '19px', marginRight: 2}}>
        {resumeName ? resumeName : 'N/A'} 
      </Typography>   
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{
          color: '#ffffff',
          backgroundColor: '#000000',
          marginRight: 1,
          '&:hover': {
            backgroundColor: '#0b0b0b',
          },
          alignSelf: 'center'
        }}
      >
        Upload
        <VisuallyHiddenInput
          type="file"
          id="resumeInput"
          name="resumeInput"
          accept=".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={changeFileInput}
        />
      </Button>
    </Box>
  );
}

{/* <Box>
  <label htmlFor="avatar">
    <Typography sx={{color: '#ffffff'}} display={'inline'}>
      {'Upload Resume:  '}
    </Typography>
  </label>
  <input
    type="file"
    id="resume"
    name="resume"
    accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  />
</Box> */}