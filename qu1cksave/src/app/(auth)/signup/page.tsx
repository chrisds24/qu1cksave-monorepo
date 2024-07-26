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
import { signup } from '@/actions/auth';
import { NewUser } from '@/types/auth';
import { User } from '@/types/user';
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
  const [name, setName] = useState('');
  const [nameErr, setNameErr] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState(false);
  const [repeatPw, setRepeatPw] = useState('');
  const [repeatPwErr, setRepeatPwErr] = useState(false);

  const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value as string;
    if (!val || val.length > 255) {
      setNameErr(true)
    } else {
      setNameErr(false)
    }
    setName(val);
  };

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
    if (val && val !== repeatPw) {
      setRepeatPwErr(true)
    } else {
      setRepeatPwErr(false)
    }
    setPassword(val);
  };

  const changeRepeatPw = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value as string;
    if (!val || val !== password) {
      setRepeatPwErr(true)
    } else {
      setRepeatPwErr(false)
    }
    setRepeatPw(val);
  };

  const createAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setButtonDisabled(true);

    // If user doesn't enter a name, this code won't catch it since the
    //   onChange won't trigger
    // if (nameErr || emailErr || passwordErr || repeatPwErr) { ... }  // HAS A BUG
    
    const nameError = !name || name.length > 255;
    const emailError = !email || email.length > 254;
    const passwordError = !password || password.length < 8;
    const repeatPwError = !repeatPw || password !== repeatPw;
    if (nameError || emailError || passwordError || repeatPwError) {
      setNameErr(nameError);
      setEmailErr(emailError);
      setPasswordErr(passwordError);
      setRepeatPwErr(repeatPwError);
      alert('Please ensure that all fields are valid.');
      setButtonDisabled(false);
      return;
    }

    const data = new FormData(event.currentTarget);
    const newUser: NewUser = {
      name: data.get('name') as string,
      email: data.get('email') as string,
      password: data.get('password') as string
    };

    if (newUser.password !== data.get('repeatpw')) {
      alert("Passwords don't match.");
    } else {
      const user: User | undefined = await signup(newUser);
      if (user) {
        alert('Successfully created account!');
        router.push('/login')
      } else {
        alert('Error processing request. Please try again or use a different email address.');
      }
    }
    setButtonDisabled(false);
  };

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: '#000000' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" color={'#ffffff'}>
        Sign Up
      </Typography>
      <Box component="form" noValidate onSubmit={createAccount} sx={{ mt: 1 }}>
      {/* <Box component="form" onSubmit={createAccount} sx={{ mt: 1 }}> */}
        {/* https://stackoverflow.com/questions/70989890/how-to-change-textfield-inputs-focus-border-using-material-ui-theme */}
        <TextField
          margin="normal"
          required
          fullWidth
          name="name"
          label="Name"
          id="name"
          value={name}
          onChange={changeName}
          error={nameErr}
          helperText={
            nameErr ? 'Required. Maximum: 255 characters' : ''
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
        <TextField
          margin="normal"
          required
          fullWidth
          name="repeatpw"
          label="Repeat password"
          type="password"
          id="repeatpw"
          autoComplete="current-password"
          value={repeatPw}
          onChange={changeRepeatPw}
          error={repeatPwErr}
          helperText={
            repeatPwErr ? 'Passwords do not match.' : ''
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
            <Link href="/login" variant="body2">
              {"Already have an account? Log in"}
            </Link>
          </Grid>
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </>
  );
}