import { Box, Divider, Skeleton, Typography } from "@mui/material";

export default function SingleJobSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column'}}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1.5}}>
      {/* Back button */}
      <Skeleton
        variant="rounded"
          sx={{
          bgcolor: '#1a1a1a',
          width: '24px',
          height: '24px'
        }}
      />
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Skeleton
            variant="rounded"
            sx={{
              bgcolor: '#1a1a1a',
              width: '64px',
              height: '36px',
              marginRight: 1
            }}
          />
          <Skeleton
            variant="rounded"
              sx={{
              bgcolor: '#1a1a1a',
              width: '64px',
              height: '36px'
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '15vw'}}>
          <Typography color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
            {'Applied:'} 
          </Typography>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              bgcolor: '#1a1a1a',
              fontSize: '17px',
              width: '100%'
            }}
          />                 
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '15vw'}}>
          <Typography color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
            {'Posted:'} 
          </Typography>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              bgcolor: '#1a1a1a',
              fontSize: '17px',
              width: '100%'
            }}
          />   
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '15vw'}}>
          <Typography color='#ffffff' sx={{fontSize: '17px', marginRight: 1}}>
            {'Saved:'} 
          </Typography>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              bgcolor: '#1a1a1a',
              fontSize: '17px',
              width: '100%'
            }}
          />              
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '15vw', marginBottom: 1.5}}>
        <Typography color='#ffffff' sx={{fontSize: '17px', marginRight: 1, fontWeight: 'bold'}}>
          {'Status:'} 
        </Typography>
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '17px',
            width: '100%'
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
          width: '25vw'
        }}
      />
      {/* Company Name */}
      <Skeleton
        variant="text"
        animation="wave"
        sx={{
          bgcolor: '#1a1a1a',
          fontSize: '20px',
          width: '20vw'
        }}
      />
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        {/* Remote */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '20px',
            width: '10vw'
          }}
        />
        {/* <HorizontalRuleIcon sx={{color: '#ffffff', margin: '0vw 1vw', alignSelf: 'center'}} /> */}
        <Divider orientation="vertical" flexItem sx={{backgroundColor: '#ffffff', margin: '0px 15px', height: '20px', alignSelf: 'center'}} />
        {/* Salary */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '20px',
            width: '10vw'
          }}
        />
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        {/* City and State */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '17px',
            width: '7vw'
          }}
        />
        {/* <HorizontalRuleIcon sx={{color: '#ffffff', margin: '0vw 1vw'}} /> */}
        <Divider orientation="vertical" flexItem sx={{backgroundColor: '#ffffff', margin: '0px 15px', height: '17px', alignSelf: 'center'}} />
        {/* Country */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '17px',
            width: '7vw'
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
          // height: '25vh'
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
          // height: '25vh'
        }}
      />
      <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />
      <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginBottom: 1}}>
        {'Links'}
      </Typography>
      {/* Links Content */}
      <Skeleton
        variant="rounded"
        sx={{
          bgcolor: '#1a1a1a',
          width: '100%',
          // height: '25vh'
        }}
      />

      <Divider sx={{ backgroundColor: '#808080', marginTop: 2, marginBottom: 2}} />

      <Box sx={{ display: 'flex', flexDirection: 'row', width: '50vw', marginBottom: 2}}>
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
            width: '20%'
          }}
        />              
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '50vw', marginBottom: 2}}>
        <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginRight: 1}}>
          {'Resume:'} 
        </Typography>
        {/* Resume content */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '20px',
            width: '40%'
          }}
        />              
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '50vw', marginBottom: 2}}>
        <Typography color='#c586c0' sx={{fontSize: '20px', fontWeight: 'bold', marginRight: 1}}>
          {'Cover Letter:'} 
        </Typography>
        {/* Cover letter content */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            bgcolor: '#1a1a1a',
            fontSize: '20px',
            width: '50%'
          }}
        />              
      </Box>
    </Box>
  );
}