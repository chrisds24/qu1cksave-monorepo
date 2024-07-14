import { JobsContext } from '@/app/(main)/jobs/layout';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext } from 'react';

export default function DeleteDialog() {
  const {deleteJobId, deleteJobOpen, setDeleteJobOpen, setDeleteJobId, jobs, setJobs} = useContext(JobsContext)

  const handleClose = () => {
    setDeleteJobOpen(false);
    setDeleteJobId('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
        // Remove this job from jobs, then set jobs
        let newJobs = [...jobs];
        newJobs = newJobs.filter((j) => j.id !== job.id);
        // NOTE: Whenever jobs is set, apply the filters.
        // This is done in layout.tsx to get filteredJobs
        setJobs(newJobs)
        // NOTE: The useEffect automatically updates jobsInPage when jobs
        //   changes is in job/page.tsx
      })
      .catch((err) => {
        console.error(err)
      });

    handleClose();
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
        <Button sx={{color: '#ffffff'}} onClick={handleClose}>Cancel</Button>
        <Button color='error' type="submit">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}