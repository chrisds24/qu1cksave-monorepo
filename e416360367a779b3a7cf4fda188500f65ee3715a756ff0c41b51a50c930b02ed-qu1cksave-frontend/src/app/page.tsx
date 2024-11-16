import { AppBar, Box, Button, Toolbar } from "@mui/material";
import Link from 'next/link'
// import styles from "./page.module.css"; // Used by initial boilerplate
import Intro from "@/components/landing/intro";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <main>
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: '#000000',
            // borderRadius: '40px',
            // maxWidth: {xs: '95vw', lg: '90vw'},
            // marginRight: {xs: '2.5vw', lg: '5vw'},
            // marginTop: 2,
          }}
        >
          {/* https://stackoverflow.com/questions/78299645/unable-to-override-left-and-right-padding-on-mui-toolbar-other-than-with-import */}
          <Toolbar sx={{height: 75, flexDirection: 'row', justifyContent: 'space-between', "@media (min-width: 0px)": { paddingRight: {xs: '2.5vw', lg: '5vw'}, paddingLeft: {xs: '2.5vw', lg: '5vw'} }}}> 
            {/* This Box is for the image */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              backgroundColor: '#000000',
              height: 64, // The Toolbar that MUI uses to add the space has height 64
              marginLeft: 1
            }}>
              <Link href="/">
                <img
                  height={56}
                  width={'auto'}
                  src="/qu1cksave_black_bg.png"
                  alt="qu1cksave logo"
                  style={{marginTop: 4}}
                />
              </Link>
            </Box>   
            <Box>
              <Link href="/signup">
                <Button
                  sx={{
                    backgroundColor: '#4b4e50',
                    color: '#ffffff',
                    borderRadius: '40px',
                    padding: '7px 10px',
                    marginRight: 1,
                    '&:hover': {
                      backgroundColor: '#323436',
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant='outlined'
                  sx={{
                    color: '#ffffff',
                    borderRadius: '40px',
                    borderColor: '#4b4e50',
                    padding: '7px 10px',
                    '&:hover': {
                      borderColor: '#323436',
                    }
                  }}
                >
                  Login
                </Button>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
        <Intro />
        <Features />
        <Footer />
      </Box>
    </main>
  );
}
