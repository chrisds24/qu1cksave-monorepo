'use client'

import { Avatar, Box, Button, CircularProgress, Grid, Link, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

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
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value as string;
    // Only require that email field isn't empty.
    if (!val) {
      setEmailErr(true);
    } else {
      setEmailErr(false);
    }
    setEmail(val);
  }

  const sendResetLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setButtonDisabled(true);

    if (!email) {
      setEmailErr(true);
      alert('Please enter an email.');
      setButtonDisabled(false);
      return;
    }

    await sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('If the email you entered is valid and is associated with an account, a password reset email has been sent to it.');
      })
      .catch(() => {
        alert('Error sending password reset email. Please try again.')
      })
      .finally(() => {
        setButtonDisabled(false);
      })
  }

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: '#000000' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" color={'#ffffff'}>
        Reset Your Password
      </Typography>
      <Box component="form" noValidate onSubmit={sendResetLink} sx={{ mt: 1.5, width: '87%' }}>
        <Typography variant="subtitle2" color={'#ffffff'} marginBottom={1.5}>
          Please enter the email associated with your account and we&apos;ll send you password reset instructions
        </Typography>
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
          {
            buttonDisabled ?
            <CircularProgress size={25} sx={{color: '#ffffff'}} />:
            'Reset Password'
          }
        </Button>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: 0.5,
            marginBottom: 1
          }}
        >
            <Link href="/login" variant="body2">
              {"Back to login"}
            </Link>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </>
  )
};
