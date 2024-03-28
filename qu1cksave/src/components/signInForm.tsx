'use client'

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// Credit to:
// - https://mui.com/material-ui/getting-started/templates/
// - https://github.com/mui/material-ui/tree/v5.15.14/docs/data/material/getting-started/templates/sign-in-side
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="#ffffff" align="center" {...props}>
      {'Copyright © '}
    <Link color="inherit" href="https://github.com/chrisds24">
      qu1cksave
    </Link>
    {' 2024.'}
    </Typography>
  );
}

export default function SignInForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // TODO:
    // 1.) fetch
    // 2.) if successful sign in, use useRouter to navigate to dashboard
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {/* https://stackoverflow.com/questions/70989890/how-to-change-textfield-inputs-focus-border-using-material-ui-theme */}
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, color: '#ffffff', backgroundColor: '#000000' }}
      >
        Sign In
      </Button>
      <Grid container>
        <Grid item>
          <Link href="#" variant="body2">
            {/* TODO: Center this */}
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
      <Copyright sx={{ mt: 5 }} />
    </Box>
  );
}