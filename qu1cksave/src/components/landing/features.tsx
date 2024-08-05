import { Box, Typography } from "@mui/material";
import FeaturesList from "./featuresList";

export default function Features() {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#111111'}}>
      <Typography variant='h4' sx={{color: '#ffffff', fontWeight: 'bold', marginTop: '25px', marginBottom: '25px'}}>
        Features
      </Typography>
      <FeaturesList />
    </Box>
  );
}