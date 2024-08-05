import { Box, Typography } from "@mui/material";
import FeaturesList from "./featuresList";

export default function Features() {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#111111', paddingTop: '25px', paddingBottom: '25px'}}>
      <Typography variant='h4' sx={{color: '#ffffff', fontWeight: 'bold', marginBottom: '25px'}}>
        What is qu1cksave?
      </Typography>
      <FeaturesList />
    </Box>
  );
}