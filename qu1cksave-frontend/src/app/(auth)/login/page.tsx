'use client'

import { useRouter } from 'next/navigation';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { setCookieAndGoToJobs } from '@/actions/auth';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Credit to:
// - https://mui.com/material-ui/getting-started/templates/
// - https://github.com/mui/material-ui/tree/v5.15.14/docs/data/material/getting-started/templates/sign-in-side
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="#ffffff" align="center" {...props}>
      {'Copyright © '}
    <Link href="/">
      qu1cksave
    </Link>
    {' 2024.'}
    </Typography>
  );
}

export default function Page() {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState(false);

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value as string;
    // Only require that email field isn't empty.
    if (!val) {
      setEmailErr(true)
    } else {
      setEmailErr(false)
    }
    setEmail(val);
  };

  const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value as string;
    // Only require that password field isn't empty.
    if (!val) {
      setPasswordErr(true)
    } else {
      setPasswordErr(false)
    }
    setPassword(val);
  };

  const signin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setButtonDisabled(true);

    // Ensure all fields are valid
    const emailError = !email;
    const passwordError = !password;
    if (emailError || passwordError) {
      setEmailErr(emailError);
      setPasswordErr(passwordError);
      alert('Please ensure that all required fields have been filled.');
      setButtonDisabled(false);
      return;
    }

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => { // Successful Firebase login
        const user = userCredential.user;
        if (user.emailVerified) {
            // Need to set cookie so user can access autheticated pages. Then
            //   redirect to jobs page
            await setCookieAndGoToJobs("arbitrary value not used for request authentication");
            // router.push('/jobs'); // Doesn't work anymore but used to
        } else {
            // Send verification email
            // - Must be signed in to do this
            await sendEmailVerification(user)
              .then(async () => {
                // Need to signout from Firebase since login wasn't successful.
                await signOut(auth);
                alert('A verification email has been sent. Please first verify your email before logging in.');
              })
              .catch(async () => {
                // Again, not putting signOut in finally since signOut must
                //   happen before a blocking alert
                await signOut(auth);
                alert('Error sending verification email. Please login again to send it then verify your email there.');
              })
        }
      })
      .catch(() => { // Unsuccessful Firebase login
        alert('Error logging in. Please try again or check your credentials.');
      })
      .finally(() => {
        setButtonDisabled(false);
      });
  };

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: '#000000' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" color={'#ffffff'}>
        Log In
      </Typography>
      <Box component="form" noValidate onSubmit={signin} sx={{ mt: 1, width: '87%' }}>
        {/* https://stackoverflow.com/questions/70989890/how-to-change-textfield-inputs-focus-border-using-material-ui-theme */}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          type="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={changeEmail}
          error={emailErr}
          helperText={
            emailErr ? 'Required. Please fill out this field.' : ''
          }
          sx={{
            input: {
              color: '#ffffff'
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: 'solid #3e3e42',
            },
            // "& .Mui-focused": {
            //   "& .MuiOutlinedInput-notchedOutline": {
            //     border: 'solid #ffffff',
            //   },
            // },
            "& label": {
              color: '#3e3e42',
            },
            // "& label.Mui-focused": {
            //   color: '#ffffff',
            // },
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={changePassword}
          error={passwordErr}
          helperText={
            passwordErr ? 'Required. Please fill out this field.' : ''
          }
          sx={{
            input: {
              color: '#ffffff'
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: 'solid #3e3e42',
            },
            "& label": {
              color: '#3e3e42',
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 0.5,
            marginBottom: 1
          }}
        >
            <Link href="/resetpassword" variant="body2">
              {"Forgot password?"}
            </Link>         
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            mb: 2,
            color: '#ffffff',
            backgroundColor: '#000000',
            '&:hover': {
              backgroundColor: '#4b4e50',
              color: '#ffffff'
            },
           }}
          disabled={buttonDisabled}
        >
          {buttonDisabled ? <CircularProgress size={25} sx={{color: '#ffffff'}} />: 'Log In'}
        </Button>
        <Grid container>
          <Grid item>
            <Link href="/signup" variant="body2">
              {"Don't have an account? Sign up"}
            </Link>
          </Grid>
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </>
  );
}

// Notes (Mar 17, 2026):
// - Molly and Anna can just login since they're already in Firebase with email
//   verified and the test DB
// - Goat User can just login since he's in Firebase + email verified
//   -- No notification of a signup for DB (as expected)
// - Nobby (in Firebase + email verified + in test DB) can also login.
//   -- He can go to the main page, but my custom error page is shown for
//      jobs page as expected.
// - Christian: Same as with Goat User
// - Unverified Email: Notification about verification email being sent.
//   -- A verification email has been sent. Please first verify your email before logging in.
//   -- NOTE: There's no way to test the branch when sending an email fails
// - No Name: Same as Goat User
//   -- Even though the Firebase user doesn't have a name, the sidebar
//      defaulted to No Name which is expected.
