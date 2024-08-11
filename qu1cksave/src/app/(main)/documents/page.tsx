'use client'

import { Box, Typography } from "@mui/material";

export default function Page() {

  return (
    <Box sx={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Box sx={{display: 'flex', height: '100%', width: '60%', flexDirection: 'row', alignItems: 'center'}}>
        <Typography variant="h3" sx={{fontWeight: 'bold', color: '#ffffff'}}>
          Documents page coming soon!
        </Typography>
      </Box>
    </Box>
  );
}