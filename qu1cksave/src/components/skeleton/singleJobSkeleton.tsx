import { Box, Button, Divider, Skeleton, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SingleJobSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column'}}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1.5}}>
        {/* Back button */}
        <ArrowBackIcon sx={{color: '#ffffff', cursor: 'pointer'}}/>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Button
            variant="contained"
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              marginRight: 1,
              '&:hover': {
                backgroundColor: '#0b0b0b',
              },
            }}
          >
            <EditIcon
              sx={{ color: '#ffffff'}}
            />
          </Button>
          <Button
            variant="contained"
            sx={{ color: '#ffffff' }}
            color='error'
          >
            <DeleteIcon sx={{ color: '#ffffff'}} />
          </Button>    
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, justifyContent: 'space-between', marginBottom: {xs: 1, md: 0}}}>
        <Box sx={{marginRight: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
          <Typography color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
            {'Applied:'} 
          </Typography>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              bgcolor: '#1a1a1a',
              fontSize: '17px',
              width: '120px'
            }}
          />                 
        </Box>
        <Box sx={{marginRight: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
          <Typography color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
            {'Posted:'} 
          </Typography>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              bgcolor: '#1a1a1a',
              fontSize: '17px',
              width: '120px'
            }}
          />   
        </Box>
        <Box sx={{marginRight: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
          <Typography color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
            {'Saved:'} 
          </Typography>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              bgcolor: '#1a1a1a',
              fontSize: '17px',
              width: '120px'
            }}
          />              
        </Box>
      </Box>
      <Box sx={{marginBottom: 1.5, display: 'flex', flexDirection: 'row',}}>
        <Typography  color='#ffffff' sx={{fontSize: '17px', marginRight: 1, fontWeight: 'bold'}}>
          {'Status:'} 
        </Typography>
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '17px',
            width: '120px',
          }}
        />
      </Box>
      {/* Title */}
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          bgcolor: '#1a1a1a',
          fontSize: '24px',
          width: '300px'
        }}
      />
      {/* Company Name */}
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          bgcolor: '#1a1a1a',
          fontSize: '20px',
          width: '250px'
        }}
      />
      <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}}>
        {/* Remote */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '20px',
            width: '100px'
          }}
        />
        {/* <HorizontalRuleIcon sx={{color: '#ffffff', margin: '0vw 1vw', alignSelf: 'center'}} /> */}
        <Divider orientation="vertical" flexItem sx={{backgroundColor: '#ffffff', margin: '0px 15px', height: '20px', alignSelf: 'center', display: {xs: 'none', sm: 'flex'}}} />
        {/* Salary */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '20px',
            width: '250px'
          }}
        />
      </Box>
      <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}}>
        {/* City and State */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '17px',
            width: '200px'
          }}
        />
        {/* <HorizontalRuleIcon sx={{color: '#ffffff', margin: '0vw 1vw'}} /> */}
        <Divider orientation="vertical" flexItem sx={{display: {xs: 'none', sm: 'flex'}, backgroundColor: '#ffffff', margin: '0px 15px', height: '17px', alignSelf: 'center'}} />
        {/* Country */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '17px',
            width: '150px'
          }}
        />
      </Box>
      <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />
      <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginBottom: 1}}>
        {'Description'}
      </Typography>
      {/* Description content */}
      <Skeleton
        variant="rounded"
        sx={{
          bgcolor: '#1a1a1a',
          width: '100%',
          height: '25vh'
        }}
      />
      <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />
      <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginBottom: 1}}>
        {'Notes'}
      </Typography>
      {/* Notes content */}
      <Skeleton
        variant="rounded"
        sx={{
          bgcolor: '#1a1a1a',
          width: '100%',
          height: '25vh'
        }}
      />
      <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />
      <Box sx={{maxWidth: '80vw'}}>
        <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginBottom: 1}}>
          {'Links'}
        </Typography>
        {/* Links Content */}
        <Skeleton
          variant="rounded"
          sx={{
            bgcolor: '#1a1a1a',
            width: '100%',
            height: '25vh'
          }}
        />
      </Box>

      <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />

      <Box sx={{display: 'flex', flexWrap: 'wrap', flexDirection: {xs: 'column', sm: 'row'}, marginBottom: 2}}>
        <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginRight: 1}}>
          {'Job posting found from:'} 
        </Typography>
        {/* Found From text */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '20px',
            width: '200px'
          }}
        />              
      </Box>
      <Box sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, maxWidth: '90vw', flexWrap: {xs: 'nowrap', md: 'wrap'}}}>
        <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginRight: 1, marginBottom: 1}}>
          {'Resume:'} 
        </Typography>
        {/* Resume content */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '20px',
            width: '200px'
          }}
        />              
      </Box>
      <Box sx={{marginBottom: 1}}/>
      <Box sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, maxWidth: '90vw', flexWrap: {xs: 'nowrap', md: 'wrap'}}}>
        <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginRight: 1, marginBottom: 1}}>
          {'Cover Letter:'} 
        </Typography>
        {/* Cover letter content */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '20px',
            width: '200px'
          }}
        />              
      </Box>
    </Box>
  );
}