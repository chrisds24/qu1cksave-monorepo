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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newUser = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password')
    }

    const fetchData = async () => {
      await fetch("http://localhost:3010/api/v0/user/signup", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          alert('Successfully created account!')
          router.push('/login');
        })
        .catch((err) => {
          // console.log(err);
          alert('Email already in use.');
        });
    };

    if (newUser.password !== data.get('repeatpw')) {
      alert("Passwords don't match.");
    } else {
      fetchData();
    }
  };

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: '#000000' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" color={'#ffffff'}>
        Sign Up
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        {/* https://stackoverflow.com/questions/70989890/how-to-change-textfield-inputs-focus-border-using-material-ui-theme */}
        <TextField
          margin="normal"
          required
          fullWidth
          name="name"
          label="Name"
          id="name"
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
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
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
        >
          Sign Up
        </Button>
        <Grid container>
          <Grid item>
            <Link href="/login" variant="body2">
              {/* TODO: Center this */}
              {"Already have an account? Log in"}
            </Link>
          </Grid>
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </>
  );
}