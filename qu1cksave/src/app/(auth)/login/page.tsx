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
import { login } from '@/actions/auth';
import { Credentials } from '@/types/auth';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

// Credit to:
// - https://mui.com/material-ui/getting-started/templates/
// - https://github.com/mui/material-ui/tree/v5.15.14/docs/data/material/getting-started/templates/sign-in-side
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="#ffffff" align="center" {...props}>
      {'Copyright © '}
    {/* <Link color="inherit" href="https://github.com/chrisds24"> */}
    <Link href="https://github.com/chrisds24">
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
    // https://regexr.com/3e48o
    if (!val || val.length > 254 || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val)) {
      setEmailErr(true)
    } else {
      setEmailErr(false)
    }
    setEmail(val);
  };

  const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value as string;
    if (!val || val.length < 8) {
      setPasswordErr(true)
    } else {
      setPasswordErr(false)
    }
    setPassword(val);
  };

  const signin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setButtonDisabled(true);

    const emailError = !email || email.length > 254;
    const passwordError = !password || password.length < 8;
    if (emailError || passwordError) {
      setEmailErr(emailError);
      setPasswordErr(passwordError);
      alert('Please ensure that all fields are valid.');
      setButtonDisabled(false);
      return;
    }

    const formdata = new FormData(event.currentTarget);
    const credentials: Credentials = {
      email: formdata.get('email') as string,
      password: formdata.get('password') as string
    };
    const user = await login(credentials);
    if (user) {
      router.push('/jobs');
    } else {
      alert('Error processing request. Please try again or check your credentials.');
    }
    setButtonDisabled(false);
  };

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: '#000000' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" color={'#ffffff'}>
        Sign In
      </Typography>
      <Box component="form" noValidate onSubmit={signin} sx={{ mt: 1 }}>
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
            emailErr ? 'Required. Maximum: 254 characters. Must be a valid email address.' : ''
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
            passwordErr ? 'Required. Minimum: 8 characters' : ''
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
          sx={{ mt: 3, mb: 2, color: '#ffffff', backgroundColor: '#000000' }}
          disabled={buttonDisabled}
        >
          {buttonDisabled ? <CircularProgress size={25} sx={{color: '#ffffff'}} />: 'Sign In'}
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