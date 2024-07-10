import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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

export default function FileUploadSection(props: any) {
  const changeFileInput = (event: any) => {
    // https://github.com/microsoft/TypeScript/issues/31816
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file = files[0];
      props.setFileName(file.name);
    } else { // File was removed
      // Before updating cancel behavior:
      // - When you upload a file, then try uploading again but cancel that one, the file you
      //   uploaded earlier gets removed, which triggers this change event.
      // - However, when you haven't uploaded a file yet (regardless of whether dialogJob had
      //   a resume name or not), changeFileInput will not trigger if you try uploading then
      //   cancelling it.
      props.setFileName('');
    }
  };

  return (
    <Box>
      <Typography display={'inline'} color='#ffffff' sx={{fontSize: '19px', fontWeight: 'bold', marginRight: 2}}>
        {props.fileType === 'resume' ? 'Resume:' : 'Cover Letter:'} 
      </Typography>
      <Typography display={'inline'} color='#ffffff' sx={{fontSize: '19px', marginRight: 2}}>
        {props.fileName ? props.fileName : 'N/A'} 
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
          id={`${props.fileType}Input`}
          name={`${props.fileType}Input`}
          accept=".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={changeFileInput}
        />
      </Button>
      <Button
        variant="contained"
        sx={{ color: '#ffffff' }}
        color='error'
        onClick={() => props.setFileName('')}
        startIcon={<DeleteIcon sx={{ color: '#ffffff'}} />}
        tabIndex={-1}
      >
        Remove
      </Button> 
    </Box>
  );
}