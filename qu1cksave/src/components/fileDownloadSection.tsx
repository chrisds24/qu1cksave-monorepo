import { Box, Button, Typography } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { Resume } from "@/types/resume";
import { Job } from "@/types/job";
import { useContext, useState } from "react";
import { JobsContext } from "@/app/(main)/jobs/layout";
import { CoverLetter } from "@/types/coverLetter";

export default function FileDownloadSection(props: any) {
  const { job, fileType } = props;
  const {jobs, setJobs} = useContext(JobsContext);
  // https://stackoverflow.com/questions/65668008/disabling-submit-button-when-submitting-form-in-react-not-working-as-expected-wh
  // https://mui.com/material-ui/react-button/
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const file = fileType === 'resume' ? job.resume : job.cover_letter;

  const downloadFile = async (target: any) => {
    // IMPORTANT: One issue with the "caching" in state is that it will use a lot of RAM.
    // IMPORTANT: Also, I noticed that the blob stays in memory even without storing
    //   it in state (gone after refresh). How do I clear this out?
    // Alternatives
    //   IndexedDB
    //   - https://stackoverflow.com/questions/55353250/what-is-considered-too-much-data-in-react-state

    // target.disabled = true;
    setButtonDisabled(true);

    // File in "cache"
    if (file.bytearray_as_array) {
        // Convert the array into a byte array
        const byteArray = Uint8Array.from(file.bytearray_as_array!);
        // https://stackoverflow.com/questions/74401312/javascript-convert-binary-string-to-blob
        const blob = new Blob([byteArray], {type: file.mime_type!});
        const url = URL.createObjectURL(blob);
        
        // Create an <a href=... then programatically click
        // - https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          file.file_name!,
        );
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style['display'] = 'none';
        document.body.appendChild(link); // Append to html link element page
        link.click(); // Start download
        link.parentNode!.removeChild(link); // Clean up and remove the link
    } else { // Fetch the file
      await fetch(`/api/${fileType === 'resume' ? 'resume' : 'coverLetter'}/${file.id}`)
        .then((res) => { 
          if (!res.ok) {
            throw res;
          }
          return res.json()
        })
        .then((fileVal: Resume | CoverLetter | undefined) => {
          if (fileVal) {
            // Convert the array into a byte array
            const byteArray = Uint8Array.from(fileVal.bytearray_as_array!);
            // https://stackoverflow.com/questions/74401312/javascript-convert-binary-string-to-blob
            const blob = new Blob([byteArray], {type: fileVal.mime_type!});
            const url = URL.createObjectURL(blob);

            // Just replace the job's resume/cover letter data with fileVal
            // - But this one will have the actual file instead of just file info
            // Then replace the job in jobs
            // - This function can only be called when there's a job with a resume/cover letter
            if (fileType === 'resume') {
              job!.resume! = fileVal;
            } else {
              job!.cover_letter! = fileVal;
            }
            const newJobs = jobs.filter((j: Job) => j.id !== job!.id);
            newJobs.push(job);
            setJobs(newJobs);

            // Create an <a href=... then programatically click
            // - https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
              'download',
              fileVal.file_name!,
            );
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.style['display'] = 'none';
            document.body.appendChild(link); // Append to html link element page
            link.click(); // Start download
            link.parentNode!.removeChild(link); // Clean up and remove the link

            // Alternative:
            // https://stackoverflow.com/questions/69555158/http-response-with-content-disposition-doesnt-trigger-download
            // window.open(url);
          }
        })
        .catch((err) => {
          alert('Error getting file.')
        }); 
    }

    // target.disabled = false;
    setButtonDisabled(false);
  }

  return (
    <Box sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, maxWidth: '90vw', flexWrap: {xs: 'nowrap', md: 'wrap'}}}>
      <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginRight: 1, marginBottom: 1, alignSelf: {md: 'center'}}}>
        {`${fileType === 'resume' ? 'Resume:' : 'Cover Letter:'}`} 
      </Typography>
      <Typography color='#ffffff' sx={{fontSize: '20px', marginRight: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 1, alignSelf: {md: 'center'}}}>
        {file?.file_name ? file.file_name : 'N/A'} 
      </Typography>
      {file?.id ?
        (
          <Button
            variant="contained"
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              marginRight: 1,
              '&:hover': {
                backgroundColor: '#0b0b0b',
              },
              alignSelf: {xs: 'flex-start', md: 'center'},
              marginBottom: 1
            }}
            onClick={
              (event) =>  {
                downloadFile(event.currentTarget);
              }
            }
            disabled={buttonDisabled}
          >
            <DownloadIcon sx={{ color: '#ffffff', width: 30, height: 30, paddingRight: 1}} />
            {'Download'}
          </Button>             
        )
        :
        undefined
      }               
    </Box>
  );
}



// ---------- Version for resume only ----------
// const downloadResume = async (resume: Resume, target: any) => {
//   // IMPORTANT: One issue with the "caching" in state is that it will use a lot of RAM.
//   // IMPORTANT: Also, I noticed that the blob stays in memory even without storing
//   //   it in state (gone after refresh). How do I clear this out?
//   // Alternatives
//   //   IndexedDB
//   //   - https://stackoverflow.com/questions/55353250/what-is-considered-too-much-data-in-react-state

//   target.disabled = true;

//   // Resume file in "cache"
//   if (resume.bytearray_as_array) {
//       // Convert the array into a byte array
//       const byteArray = Uint8Array.from(resume.bytearray_as_array!);
//       // https://stackoverflow.com/questions/74401312/javascript-convert-binary-string-to-blob
//       const blob = new Blob([byteArray], {type: resume.mime_type!});
//       const url = URL.createObjectURL(blob);
      
//       // Create an <a href=... then programatically click
//       // - https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute(
//         'download',
//         resume.file_name!,
//       );
//       link.target = '_blank';
//       link.rel = 'noopener noreferrer';
//       link.style['display'] = 'none';
//       document.body.appendChild(link); // Append to html link element page
//       link.click(); // Start download
//       link.parentNode!.removeChild(link); // Clean up and remove the link
//   } else { // Fetch the resume file
//     await fetch(`/api/resume/${resume.id}`)
//     .then((res) => { 
//       if (!res.ok) {
//         throw res;
//       }
//       return res.json()
//     })
//     .then((resumeVal: Resume | undefined) => {
//       if (resumeVal) {
//         // Convert the array into a byte array
//         const byteArray = Uint8Array.from(resumeVal.bytearray_as_array!);
//         // https://stackoverflow.com/questions/74401312/javascript-convert-binary-string-to-blob
//         const blob = new Blob([byteArray], {type: resumeVal.mime_type!});
//         const url = URL.createObjectURL(blob);

//         // Just replace the job's resume data with resumeVal
//         // Then replace the job in jobs
//         // - This function can only be called when there's a job with a resume
//         job!.resume! = resumeVal;
//         const newJobs = jobs.filter((j: Job) => j.id !== job!.id);
//         newJobs.push(job);
//         setJobs(newJobs);

//         // Create an <a href=... then programatically click
//         // - https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute(
//           'download',
//           resumeVal.file_name!,
//         );
//         link.target = '_blank';
//         link.rel = 'noopener noreferrer';
//         link.style['display'] = 'none';
//         document.body.appendChild(link); // Append to html link element page
//         link.click(); // Start download
//         link.parentNode!.removeChild(link); // Clean up and remove the link

//         // Alternative:
//         // https://stackoverflow.com/questions/69555158/http-response-with-content-disposition-doesnt-trigger-download
//         // window.open(url);
//       }
//     })
//     .catch((err) => {
//       console.log('Error getting resume!')
//     }); 
//   }

//   target.disabled = false;
// }

// return (
//   <Box>
//     <Typography display={'inline'} color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginRight: 1}}>
//       {'Resume:'} 
//     </Typography>
//     <Typography display={'inline'} color='#ffffff' sx={{fontSize: '20px', marginRight: 2}}>
//       {job.resume?.file_name ? job.resume.file_name : 'N/A'} 
//     </Typography>
//     {job.resume?.id ?
//       (
//         <Button
//           variant="contained"
//           sx={{
//             color: '#ffffff',
//             backgroundColor: '#000000',
//             marginRight: 1,
//             '&:hover': {
//               backgroundColor: '#0b0b0b',
//             },
//             alignSelf: 'center'
//           }}
//           onClick={
//             (event) =>  {
//               downloadResume(job.resume!, event.currentTarget);
//             }
//           }
//         >
//           <DownloadIcon sx={{ color: '#ffffff', width: 30, height: 30, paddingRight: 1}} />
//           {'Download'}
//         </Button>             
//       )
//       :
//       undefined
//     }               
//   </Box>
// );