import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link'
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: '#000000',
            borderRadius: '15px',
            maxWidth: '80vw',
            alignSelf: 'center'
          }}
        >
          <Toolbar sx={{height: 70}}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              backgroundColor: '#000000',
              height: 64 // The Toolbar that MUI uses to add the space has height 64
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
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
    </main>
  );
}
