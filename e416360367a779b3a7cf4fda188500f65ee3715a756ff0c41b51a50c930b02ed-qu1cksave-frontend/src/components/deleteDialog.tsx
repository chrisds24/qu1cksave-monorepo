import { DeleteJobIdContext, SetDeleteJobIdContext } from '@/contexts/delete_dialog/DeleteJobIdContext';
import { DeleteJobOpenContext, SetDeleteJobOpenContext } from '@/contexts/delete_dialog/DeleteJobOpenContext';
import { JobsDispatchContext } from '@/contexts/JobsContext';
import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

export default function DeleteDialog() {
  const deleteJobId = useContext(DeleteJobIdContext);
  const setDeleteJobId = useContext(SetDeleteJobIdContext);
  const deleteJobOpen = useContext(DeleteJobOpenContext);
  const setDeleteJobOpen = useContext(SetDeleteJobOpenContext);
  const dispatch = useContext(JobsDispatchContext);

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleClose = () => {
    setDeleteJobOpen(false);
    setDeleteJobId('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // if (!buttonDisabled) {
    setButtonDisabled(true);

    await fetch(`/api/job/${deleteJobId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((job) => {
        dispatch({type: 'deleted', jobId: job.id});

        // If not in jobs, go to jobs
        //   Need to do this since the deleted job's page would be empty
        if (pathname !== '/jobs') {
          router.push('/jobs');
        }
      })
      .catch((err) => {
        // No need to set jobs to undefined (which will go to error page)
        alert(`Error processing request. Please reload the page and try again.`)
      });

    handleClose();
    setButtonDisabled(false);
    // }
  }

  return (
    <Dialog
      open={deleteJobOpen}
      onClose={handleClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: {
          backgroundColor: '#000000',
        }
      }}
      maxWidth={'xs'}
      fullWidth
    >
      <DialogTitle id="delete-dialog-title" sx={{color: '#ffffff', fontWeight: 'bold', fontSize: '24px'}}>
        {'Confirm delete?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description" sx={{color: '#ffffff'}}>
          This permanently deletes the job and any associated resumes/cover letters.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={buttonDisabled} sx={{color: '#ffffff'}} onClick={handleClose}>
          {buttonDisabled ? <CircularProgress size={20} sx={{color: '#ffffff'}} />: 'Cancel'}
        </Button>
        <Button disabled={buttonDisabled} color='error' type="submit">
          {buttonDisabled ? <CircularProgress size={20} sx={{color: '#ffffff'}} />: 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}