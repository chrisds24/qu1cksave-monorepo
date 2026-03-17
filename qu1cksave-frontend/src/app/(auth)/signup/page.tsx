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
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import {
  validateName,
  validatePassword
} from '@/lib/signupValidations';
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, signOut, updateProfile, User } from 'firebase/auth';
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
    if (!validateName(val)) {
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
    if (!validatePassword(val)) {
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
    
    // Ensure all fields are valid
    const nameError = !validateName(name);
    const emailError = !email ||
      email.length > 254 ||
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    const passwordError = !validatePassword(password);
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

    // https://firebase.google.com/docs/auth/web/password-auth#create_a_password-based_account
    // - A newly created user is automatically signed it, so I need to sign
    //   them out.
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => { // ACCOUNT SUCCESSFULLY CREATED
        // Need to update name since createUserWithEmailAndPassword doesn't
        //   have an option to set the displayName
        await updateProfile(userCredential.user, { displayName: name })
          .then(async () => { // UPDATE NAME SUCCESS
            // Need to send email verification since account creation was successful
            // - Must be logged in to do this
            await sendEmailVerification(userCredential.user)
              .then(async () => { // EMAIL VERIFICATION SENT SUCCESSFULLY
                // Need to sign out from Firebase since I don't want users to login
                //   automatically on sign up
                // Note that I'm not putting signOut in a finally block since
                //   I need to signOut before calling a blocking alert.
                await signOut(auth);
                alert('Successfully created account! A verification email has been sent. Please verify your email in order to log in.');
              })
              .catch(async () => { // VERIFICATION EMAIL NOT SENT
                await signOut(auth);
                // Inform user that they need to login to resend the email
                alert('Successfully created account! However, there was an error sending the verification email, so please login to resend it.');
              })
              .finally(() => {
                // Successful login, so go to login page
                router.push('/login');
              })
          })
          .catch(async () => { // UPDATE NAME FAIL
            // If update name fails, I could try to delete the user
            //   so I don't end up with an incomplete user. HOWEVER, that
            //   delete could also fail.
            await deleteUser(userCredential.user)
              .then(() => { // SUCCESSFULLY DELETED INCOMPLETE USER
                // The verification email also shouldn't be sent since
                //   the account has just been deleted
                // Note that successfully deleting user clears auth just like
                //   signOut, so there's no need to call signOut here
                // NO NEED TO SIGN OUT (See note above)
                alert('Error setting name when signing up. Please try signing up again.');
              })
              .catch(async () => { // UNABLE TO DELETE INCOMPLETE USER
                // Account creation was still successful, so I need to send the
                //   email verification even though the user doesn't have a name
                await sendEmailVerification(userCredential.user)
                  .then(async () => { // VERIFICATION EMAIL SENT
                    await signOut(auth);
                    // Inform user that they also need to update their name in
                    //   their profile settings.
                    alert('Successfully created account! A verification email has been sent. Please verify your email in order to log in. However, an error has occured when setting your name. You may update it in your profile settings after logging in.');
                  })
                  .catch(async () => { // VERIFICATION EMAIL NOT SENT
                    await signOut(auth);
                    alert('Successfully created account! However, there was an error sending the verification email, so please login to resend it. An error has also occured when setting your name. You may update it in your profile settings after logging in.');
                  })
                  .finally(() => {
                    router.push('/login');
                  })

                // What to do if updateProfile to update name fails? (DONE)
                // - Responsive sidebar must default to using "No Name" if the
                //   user's name cannot be obtained from sessionUser (which
                //   comes from Firebase auth).
                // - Upon signing up in the backend to my DB, name should be set
                //   to "No Name" since the DB has name as NOT NULL.
                // - The user can set it in their profile settings, which should
                //   also set it in Firebase via Admin SDK.

                // What to do if someone signs up with someone else's email?
                // - The actual owner would receive the email, which they can
                //   just ignore.
                //   -- Not sure how Firebase's rate limiting for this works,
                //      but hopefully it's good enough to avoid spamming
                // - What if the actual owner actually wants to sign up, but
                //   they don't know their password since someone else signed
                //   up their email to Firebase without their consent?
                //   -- Need a password reset feature.
                //      + Only the owner will receive the email to reset
                //        their password.
              });
          })
      })
      .catch(() => {
        alert('Error signing up. Please try again.');
      })
      .finally(() => {
        // router.push() is async, so this finally will run.
        setButtonDisabled(false);
      });
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
          autoFocus
          error={nameErr}
          helperText={
            nameErr ? 'Required. Maximum: 255 characters. Must be at least two words. Must not start or end with a space.' : ''
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
            "& label": {
              color: '#3e3e42',
            },
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
          autoComplete="new-password"
          value={password}
          onChange={changePassword}
          error={passwordErr}
          helperText={
            passwordErr ? `Required. 15-64 characters. No leading or trailing whitespace. Must contain at least: 1 lowercase, 1 uppercase, 1 numeric, and 1 non-alphanumeric character from the following: ^ $ * . [ ] { } ( ) ? " ! @ # % & / \ , > < ' : ; | _ ~` : ''
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
        <TextField
          margin="normal"
          required
          fullWidth
          name="repeatpw"
          label="Repeat password"
          type="password"
          id="repeatpw"
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
            "& label": {
              color: '#3e3e42',
            },
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            color: '#ffffff',
            backgroundColor:'#000000',
            '&:hover': {
              backgroundColor: '#4b4e50',
              color: '#ffffff'
            },
          }}
          disabled={buttonDisabled}
        >
          {buttonDisabled ? <CircularProgress size={25} sx={{color: '#ffffff'}} />: 'Sign Up'}
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

// Notes (Mar 17, 2026):
// - Chris Santos (my yahoo email)
//   -- "Successfully created account! A verification email has been sent.
//       Please verify your email in order to log in."
//   -- Verification email keeps being sent if logging in without verifying,
//      which is expected
//   -- When clicking a verification link other than the most recent:
//      "Try verifying your email again. Your request to verify your email has
//       expired or the link has already been used"
//   -- Once verified:
//      "Your email has been verified. You can now sign in with your new account"
//      + Can now login
//   -- When attempting to sign up with the same email, says "Error processing
//      request" which is expected
