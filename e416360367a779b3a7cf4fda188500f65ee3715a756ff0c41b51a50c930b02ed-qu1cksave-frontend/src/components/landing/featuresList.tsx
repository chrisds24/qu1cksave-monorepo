'use client'

import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Card, CardContent, CardMedia, Typography, useMediaQuery, useTheme } from '@mui/material';

export default function FeaturesList() {
  const theme = useTheme();
  const xl = useMediaQuery(theme.breakpoints.down('xl'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const xs = useMediaQuery(theme.breakpoints.down('xs'));

  let col = 3;
  if (xs) {
    col = 1
  } else if (sm) {
    col = 1
  } else if (md) {
    col = 1
  } else if (lg) {
    col = 2
  } else if (xl) {
    col = 3
  }
  
  return (
    <ImageList
      sx={{
        maxWidth: {xs: '95vw', lg: '90vw'},
      }}
      cols={col}
      gap={40}
      rowHeight={410}
    >
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          {/* <img
            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
          /> */}
          <Card sx={{ maxWidth: 345, backgroundColor: '#000000' }}>
            <CardMedia
              component="img"
              image={item.img}
              alt={item.title}
              // height="300px"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{color: '#ffffff'}}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="#707477" sx={{fontSize: '17px'}}>
                {item.details}
              </Typography>
            </CardContent>
          </Card>
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const itemData = [
  {
    img: '/track_jobsearch.png',
    title: 'Track your job search in one place',
    details: 'Store all your job applications and documents securely in one place. Save every opportunity, regardless of when and where you found it.'
  },
  {
    img: '/comprehensive_tracker.png',
    title: 'Comprehensive tracker',
    details: 'Never worry about job postings being taken down or changing before an interview. Store job descriptions, salaries, dates, locations, and many more.'
  },
  {
    img: '/manage_resumes_coverletters.png',
    title: 'Manage multiple resumes and cover letters',
    details: 'Save tailored resumes and cover letters for each job, allowing for quick and easy access to everything you need for all your jobs.'
  },
  {
    img: '/advanced_filtering.png',
    title: 'Advanced filtering',
    details: 'Quickly search through your saved applications using a comprehensive filter that allows you to filter by status, location, dates, where you found the job from, and many others.'
  },
  {
    img: '/beautiful_ui.png',
    title: 'Beautiful and easy to use',
    details: "Tired of looking at monotonous text all day reading through job descriptions? Utilize qu1cksave's simple but beautiful UI to enhance your job search productivity."
  },
  {
    img: '/efficiency_simplicity.png',
    title: 'Efficiency through simplicity',
    details: "qu1cksave's sole purpose is to help you securely track and search through your saved jobs, without all the other unnecessary details that add more distractions to an already grueling job search."
  }
];